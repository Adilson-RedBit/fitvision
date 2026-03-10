import { PrismaClient } from '@prisma/client';
import { logger } from './logger.js';

// Criar instância do Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error'],
});

// Conectar ao banco
export const connectDatabase = async () => {
  try {
    await prisma.$connect();
    logger.info('✅ Banco de dados conectado com sucesso');
  } catch (error) {
    logger.error('❌ Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  }
};

// Desconectar do banco
export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  logger.info('Banco de dados desconectado');
};

export default prisma;

