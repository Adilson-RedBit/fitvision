import express from 'express';
import { authMiddleware } from '../middleware/auth.middleware.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import prisma from '../config/database.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar FAQs do hotel
router.get('/', asyncHandler(async (req, res) => {
  const faqs = await prisma.fAQ.findMany({
    where: { hotelId: req.user.hotelId },
    orderBy: { order: 'asc' },
  });

  res.json({ success: true, data: faqs });
}));

// Criar FAQ
router.post('/', asyncHandler(async (req, res) => {
  const faq = await prisma.fAQ.create({
    data: {
      ...req.body,
      hotelId: req.user.hotelId,
    },
  });

  res.status(201).json({ success: true, data: faq });
}));

// Atualizar FAQ
router.put('/:id', asyncHandler(async (req, res) => {
  // Verificar se FAQ pertence ao hotel do usuário
  const existing = await prisma.fAQ.findUnique({
    where: { id: req.params.id },
  });

  if (!existing || existing.hotelId !== req.user.hotelId) {
    throw new AppError('FAQ não encontrado', 404);
  }

  const faq = await prisma.fAQ.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json({ success: true, data: faq });
}));

// Deletar FAQ
router.delete('/:id', asyncHandler(async (req, res) => {
  const existing = await prisma.fAQ.findUnique({
    where: { id: req.params.id },
  });

  if (!existing || existing.hotelId !== req.user.hotelId) {
    throw new AppError('FAQ não encontrado', 404);
  }

  await prisma.fAQ.delete({
    where: { id: req.params.id },
  });

  res.json({ success: true, message: 'FAQ deletado' });
}));

export default router;

