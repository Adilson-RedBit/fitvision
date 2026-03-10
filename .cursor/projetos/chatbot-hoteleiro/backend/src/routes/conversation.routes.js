import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import prisma from '../config/database.js';
import * as conversationService from '../services/conversation.service.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar conversas
router.get('/', asyncHandler(async (req, res) => {
  const { status, limit = 50, offset = 0 } = req.query;
  
  const where = { hotelId: req.user.hotelId };
  if (status) where.status = status;

  const conversations = await prisma.conversation.findMany({
    where,
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: 'desc' },
      },
    },
    orderBy: { startedAt: 'desc' },
    take: parseInt(limit),
    skip: parseInt(offset),
  });

  const total = await prisma.conversation.count({ where });

  res.json({
    success: true,
    data: conversations,
    pagination: {
      total,
      limit: parseInt(limit),
      offset: parseInt(offset),
    },
  });
}));

// Detalhes da conversa com mensagens
router.get('/:id', asyncHandler(async (req, res) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: req.params.id },
    include: {
      messages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!conversation || conversation.hotelId !== req.user.hotelId) {
    throw new AppError('Conversa não encontrada', 404);
  }

  res.json({ success: true, data: conversation });
}));

// Assumir conversa (takeover)
router.post('/:id/takeover', asyncHandler(async (req, res) => {
  await conversationService.takeoverConversation(req.params.id, req.user.id);
  
  res.json({
    success: true,
    message: 'Conversa assumida com sucesso',
  });
}));

// Enviar mensagem manual
router.post('/:id/message', asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    throw new AppError('Mensagem é obrigatória', 400);
  }

  const result = await conversationService.sendManualMessage(
    req.params.id,
    message,
    req.user.id
  );

  res.json({
    success: true,
    data: result,
  });
}));

// Encerrar conversa
router.post('/:id/close', asyncHandler(async (req, res) => {
  await conversationService.closeConversation(req.params.id);
  
  res.json({
    success: true,
    message: 'Conversa encerrada',
  });
}));

export default router;

