import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import prisma from '../config/database.js';
import { logger } from '../config/logger.js';

/**
 * Registrar novo usuário
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, name, hotelId } = req.body;

  // Verificar se usuário já existe
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    throw new AppError('Email já cadastrado', 400);
  }

  // Hash da senha
  const hashedPassword = await bcrypt.hash(password, 10);

  // Criar usuário
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      hotelId,
      role: 'ADMIN', // Primeiro usuário é admin
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  // Gerar token
  const token = generateToken(user.id);

  logger.info(`Novo usuário registrado: ${email}`);

  res.status(201).json({
    success: true,
    data: {
      user,
      token,
    },
  });
});

/**
 * Login
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validar campos
  if (!email || !password) {
    throw new AppError('Por favor, forneça email e senha', 400);
  }

  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      hotel: true,
    },
  });

  if (!user) {
    throw new AppError('Credenciais inválidas', 401);
  }

  // Verificar senha
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new AppError('Credenciais inválidas', 401);
  }

  // Gerar token
  const token = generateToken(user.id);

  // Remover senha do objeto
  delete user.password;

  logger.info(`Login bem-sucedido: ${email}`);

  res.json({
    success: true,
    data: {
      user,
      token,
    },
  });
});

/**
 * Obter dados do usuário logado
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      hotel: true,
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      hotel: true,
      createdAt: true,
    },
  });

  res.json({
    success: true,
    data: user,
  });
});

/**
 * Logout (client-side, apenas retorna sucesso)
 */
export const logout = asyncHandler(async (req, res) => {
  logger.info(`Logout: ${req.user.email}`);

  res.json({
    success: true,
    message: 'Logout realizado com sucesso',
  });
});

/**
 * Alterar senha
 */
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError('Forneça a senha atual e a nova senha', 400);
  }

  // Buscar usuário
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
  });

  // Verificar senha atual
  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    throw new AppError('Senha atual incorreta', 401);
  }

  // Hash da nova senha
  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Atualizar senha
  await prisma.user.update({
    where: { id: req.user.id },
    data: { password: hashedPassword },
  });

  logger.info(`Senha alterada: ${user.email}`);

  res.json({
    success: true,
    message: 'Senha alterada com sucesso',
  });
});

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Gerar token JWT
 */
function generateToken(userId) {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    }
  );
}

export default {
  register,
  login,
  getMe,
  logout,
  changePassword,
};

