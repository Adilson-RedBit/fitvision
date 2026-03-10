import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import prisma from '../config/database.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Métricas do dashboard
router.get('/dashboard', asyncHandler(async (req, res) => {
  const hotelId = req.user.hotelId;
  const { period = '30' } = req.query; // Dias

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - parseInt(period));

  // Conversas totais
  const totalConversations = await prisma.conversation.count({
    where: {
      hotelId,
      startedAt: { gte: startDate },
    },
  });

  // Conversas ativas
  const activeConversations = await prisma.conversation.count({
    where: {
      hotelId,
      status: 'ACTIVE',
    },
  });

  // Total de mensagens
  const totalMessages = await prisma.message.count({
    where: {
      hotelId,
      createdAt: { gte: startDate },
    },
  });

  // Mensagens do bot vs humano
  const botMessages = await prisma.message.count({
    where: {
      hotelId,
      sender: 'BOT',
      createdAt: { gte: startDate },
    },
  });

  const humanMessages = await prisma.message.count({
    where: {
      hotelId,
      sender: 'HUMAN',
      createdAt: { gte: startDate },
    },
  });

  // Taxa de resolução do bot
  const botResolutionRate = totalConversations > 0
    ? ((totalConversations - await prisma.conversation.count({
        where: { hotelId, isHandedOver: true, startedAt: { gte: startDate } },
      })) / totalConversations * 100)
    : 0;

  // FAQs mais acessadas (aproximação via intents)
  const topIntents = await prisma.message.groupBy({
    by: ['aiIntent'],
    where: {
      hotelId,
      aiIntent: { not: null },
      createdAt: { gte: startDate },
    },
    _count: true,
    orderBy: {
      _count: {
        aiIntent: 'desc',
      },
    },
    take: 5,
  });

  res.json({
    success: true,
    data: {
      period: `${period} dias`,
      conversations: {
        total: totalConversations,
        active: activeConversations,
      },
      messages: {
        total: totalMessages,
        bot: botMessages,
        human: humanMessages,
      },
      performance: {
        botResolutionRate: Math.round(botResolutionRate),
      },
      topIntents,
    },
  });
}));

// Métricas por dia (gráfico)
router.get('/daily', asyncHandler(async (req, res) => {
  const hotelId = req.user.hotelId;
  const { days = 7 } = req.query;

  const metrics = await prisma.dailyMetrics.findMany({
    where: { hotelId },
    orderBy: { date: 'desc' },
    take: parseInt(days),
  });

  res.json({
    success: true,
    data: metrics.reverse(),
  });
}));

export default router;

