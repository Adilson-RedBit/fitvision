import jwt from 'jsonwebtoken';
import prisma from '../config/database.js';
import { AppError, asyncHandler } from './errorHandler.js';

/**
 * Middleware de autenticação JWT
 */
export const authMiddleware = asyncHandler(async (req, res, next) => {
  // Pegar token do header
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new AppError('Não autorizado. Token não fornecido.', 401);
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        hotel: true,
      },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 401);
    }

    // Adicionar usuário ao request
    req.user = user;
    next();
  } catch (error) {
    throw new AppError('Token inválido ou expirado', 401);
  }
});

/**
 * Middleware para verificar permissões por role
 */
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        'Você não tem permissão para acessar este recurso',
        403
      );
    }
    next();
  };
};

export default authMiddleware;

