import express from 'express';
import { authMiddleware, authorize } from '../middleware/auth.middleware.js';
import { asyncHandler, AppError } from '../middleware/errorHandler.js';
import prisma from '../config/database.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authMiddleware);

// Listar hotéis
router.get('/', asyncHandler(async (req, res) => {
  // Super admin vê todos, outros veem apenas seu hotel
  const where = req.user.role === 'SUPER_ADMIN' ? {} : { id: req.user.hotelId };
  
  const hotels = await prisma.hotel.findMany({
    where,
    include: {
      _count: {
        select: {
          conversations: true,
          faqs: true,
          users: true,
        },
      },
    },
  });

  res.json({ success: true, data: hotels });
}));

// Criar hotel (apenas super admin)
router.post('/', authorize('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  const hotel = await prisma.hotel.create({
    data: req.body,
  });

  res.status(201).json({ success: true, data: hotel });
}));

// Detalhes do hotel
router.get('/:id', asyncHandler(async (req, res) => {
  const hotel = await prisma.hotel.findUnique({
    where: { id: req.params.id },
    include: {
      users: {
        select: { id: true, name: true, email: true, role: true },
      },
      _count: {
        select: { conversations: true, faqs: true, messages: true },
      },
    },
  });

  if (!hotel) {
    throw new AppError('Hotel não encontrado', 404);
  }

  // Verificar permissão
  if (req.user.role !== 'SUPER_ADMIN' && hotel.id !== req.user.hotelId) {
    throw new AppError('Sem permissão para acessar este hotel', 403);
  }

  res.json({ success: true, data: hotel });
}));

// Atualizar hotel
router.put('/:id', authorize('SUPER_ADMIN', 'ADMIN'), asyncHandler(async (req, res) => {
  const hotel = await prisma.hotel.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json({ success: true, data: hotel });
}));

// Deletar hotel (apenas super admin)
router.delete('/:id', authorize('SUPER_ADMIN'), asyncHandler(async (req, res) => {
  await prisma.hotel.delete({
    where: { id: req.params.id },
  });

  res.json({ success: true, message: 'Hotel deletado' });
}));

export default router;

