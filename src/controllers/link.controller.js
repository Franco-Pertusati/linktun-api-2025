const linkService = require("../services/link.service");
const jwt = require("jsonwebtoken");

// Función para generar un shortCode único
function generateShortCode() {
  return Math.random().toString(36).substring(2, 8);
}

function getGoogleFavicon(url) {
  const { hostname } = new URL(url);
  return `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;
}

// Crear un link (para usuario registrado o anónimo)
async function createLink(req, res) {
  try {
    const { originalUrl, expiresAt } = req.body;
    let userId = null;

    // Obtener userId desde el access_token en las cookies
    const token = req.cookies?.access_token;
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        userId = decoded.id;
      } catch (err) {
        // Token inválido, se trata como anónimo
        userId = null;
      }
    }


    // Si es anónimo → expira en 30 minutos
    let finalExpiresAt = null;
    if (!userId) {
      finalExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    } else if (expiresAt) {
      finalExpiresAt = new Date(expiresAt);
    }

    const shortCode = generateShortCode();
    const favIcon = getGoogleFavicon(originalUrl);

    const newLink = await linkService.createLink({
      originalUrl,
      shortCode,
      favIcon,
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
      return res
        .status(404)
        .json({ message: "Link not found or not owned by user" });
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
