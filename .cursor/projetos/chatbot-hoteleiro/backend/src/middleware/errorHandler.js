import { logger } from '../config/logger.js';

// Classe para erros personalizados
export class AppError extends Error {
  constructor(message, statusCode = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware de tratamento de erros
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log do erro
  logger.error(`${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

  // Erro de validação do Prisma
  if (err.code === 'P2002') {
    error = new AppError('Este registro já existe no banco de dados', 400);
  }

  // Erro de registro não encontrado do Prisma
  if (err.code === 'P2025') {
    error = new AppError('Registro não encontrado', 404);
  }

  // Erro de JWT inválido
  if (err.name === 'JsonWebTokenError') {
    error = new AppError('Token inválido. Faça login novamente.', 401);
  }

  // Erro de JWT expirado
  if (err.name === 'TokenExpiredError') {
    error = new AppError('Token expirado. Faça login novamente.', 401);
  }

  // Erro de validação do Zod
  if (err.name === 'ZodError') {
    const message = err.errors.map(e => e.message).join(', ');
    error = new AppError(message, 400);
  }

  // Resposta
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Erro interno do servidor';

  res.status(statusCode).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err
    })
  });
};

// Wrapper para funções assíncronas
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default errorHandler;

