const linkService = require("../services/link.service");

// Función para generar un shortCode único
function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

// Crear un link (para usuario registrado o anónimo)
async function createLink(req, res) {
  try {
    const { originalUrl, expiresAt } = req.body;
    const userId = req.user ? req.user.id : null;

    // Si es anónimo → expira en 30 minutos
    let finalExpiresAt = null;
    if (!userId) {
      finalExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    } else if (expiresAt) {
      finalExpiresAt = new Date(expiresAt);
    }

    const shortCode = generateShortCode();

    const newLink = await linkService.createLink({
      originalUrl,
      shortCode,
      expiresAt: finalExpiresAt,
      userId,
    });

    return res.status(201).json(newLink);
  } catch (error) {
    console.error("Error creating link:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Obtener link por shortCode (redirigir)
async function getLinkByCode(req, res) {
  try {
    const { shortCode } = req.params;

    const link = await linkService.findLinkByCode(shortCode);

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    // Verificar si está expirado
    if (link.expiresAt && new Date(link.expiresAt) < new Date()) {
      return res.status(410).json({ message: "Link expired" });
    }

    // Redirigir
    return res.redirect(link.originalUrl);
  } catch (error) {
    console.error("Error retrieving link:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Obtener todos los links del usuario autenticado
async function getUserLinks(req, res) {
  try {
    const userId = req.user.id;
    const links = await linkService.findLinksByUser(userId);
    return res.json(links);
  } catch (error) {
    console.error("Error fetching user links:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

// Eliminar un link
async function deleteLink(req, res) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const result = await linkService.deleteLink(parseInt(id), userId);

    if (result.count === 0) {
      return res.status(404).json({ message: "Link not found or not owned by user" });
    }

    return res.status(204).send();
  } catch (error) {
    console.error("Error deleting link:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = {
  createLink,
  getLinkByCode,
  getUserLinks,
  deleteLink,
};