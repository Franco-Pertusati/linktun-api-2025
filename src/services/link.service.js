const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * Crea un nuevo link
 * @param {Object} data - Datos para crear el link
 * @param {string} data.originalUrl - URL original
 * @param {string} data.shortCode - Código acortado único
 * @param {Date|null} data.expiresAt - Fecha de expiración (null si no expira)
 * @param {number|null} data.userId - ID del usuario (null si anónimo)
 */
async function createLink({ originalUrl, shortCode, expiresAt, userId, favIcon }) {
  return prisma.link.create({
    data: {
      originalUrl,
      shortCode,
      favIcon,
      expiresAt,
      userId,
    },
  });
}

/**
 * Busca un link por su shortCode
 * @param {string} shortCode
 */
async function findLinkByCode(shortCode) {
  return prisma.link.findUnique({
    where: { shortCode },
  });
}

/**
 * Lista los links creados por un usuario
 * @param {number} userId
 */
async function findLinksByUser(userId) {
  return prisma.link.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

/**
 * Elimina un link por ID (solo si pertenece al usuario)
 * @param {number} id
 * @param {number} userId
 */
async function deleteLink(id, userId) {
  return prisma.link.deleteMany({
    where: { id, userId },
  });
}

module.exports = {
  createLink,
  findLinkByCode,
  findLinksByUser,
  deleteLink,
};
