// Script de teste rápido do servidor
import express from 'express';
import { logger } from './src/config/logger.js';
import prisma from './src/config/database.js';

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor funcionando!' });
});

app.get('/test-db', async (req, res) => {
  try {
    // Testar conexão com o banco
    await prisma.$queryRaw`SELECT 1 as result`;
    res.json({ status: 'OK', message: 'Banco de dados conectado!' });
  } catch (error) {
    res.status(500).json({ status: 'ERROR', message: error.message });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  logger.info(`✅ Servidor de teste rodando na porta ${PORT}`);
  console.log(`\n🚀 Teste os endpoints:`);
  console.log(`   http://localhost:${PORT}/health`);
  console.log(`   http://localhost:${PORT}/test-db\n`);
});

