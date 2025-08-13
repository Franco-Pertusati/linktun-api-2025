// modules/auth/auth.service.js
const prisma = require('../config/prisma');
const { hashPassword, comparePassword } = require('.././utils/hash');
const { generateToken } = require('.././config/jwt');

async function registerUser({ username, email, password }) {
  // Verificar si ya existe el usuario
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error('Email already registered');
  }

  // Hashear contraseña
  const hashed = await hashPassword(password);

  // Crear usuario
  const user = await prisma.user.create({
    data: { username, email, password: hashed },
  });

  // Generar token
  const token = generateToken({ id: user.id, email: user.email });

  return { user: { id: user.id, username: user.username, email: user.email }, token };
}

async function loginUser({ email, password }) {
  // Buscar usuario
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Comparar contraseñas
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid email or password');
  }

  // Generar token
  const token = generateToken({ id: user.id, email: user.email });

  return { user: { id: user.id, username: user.username, email: user.email }, token };
}

module.exports = { registerUser, loginUser };
