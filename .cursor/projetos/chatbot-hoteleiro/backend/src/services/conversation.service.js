import prisma from '../config/database.js';
import { logger } from '../config/logger.js';
import * as openaiService from './openai.service.js';
import * as whatsappService from './whatsapp.service.js';

/**
 * Processar mensagem recebida e gerar resposta
 */
export const processMessage = async (incomingMessage, hotelId) => {
  try {
    // 1. Buscar ou criar conversa
    let conversation = await findOrCreateConversation(
      incomingMessage.from,
      hotelId
    );

    // 2. Salvar mensagem recebida
    await saveMessage({
      conversationId: conversation.id,
      hotelId,
      content: incomingMessage.body,
      direction: 'INBOUND',
      sender: 'BOT', // Será BOT até ser transferido
      messageId: incomingMessage.messageId,
    });

    // 3. Verificar se conversa foi transferida para humano
    if (conversation.isHandedOver) {
      logger.info(`Conversa ${conversation.id} já foi transferida para humano`);
      return {
        shouldRespond: false,
        message: 'Conversa sendo atendida por humano',
      };
    }

    // 4. Buscar contexto do hotel e FAQs
    const hotel = await prisma.hotel.findUnique({
      where: { id: hotelId },
      include: {
        faqs: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
      },
    });

    // 5. Detectar intenção
    const intent = await openaiService.detectIntent(incomingMessage.body);
    logger.info(`Intenção detectada: ${intent}`);

    // 6. Verificar se precisa de humano
    const needsHuman = await openaiService.needsHumanIntervention(
      incomingMessage.body,
      intent
    );

    if (needsHuman) {
      await handoverToHuman(conversation.id);
      
      const response = await whatsappService.sendMessage(
        incomingMessage.from,
        'Entendo que você precisa de atenção especial. Estou transferindo você para um de nossos atendentes. Aguarde um momento, por favor. 👨‍💼'
      );

      await saveMessage({
        conversationId: conversation.id,
        hotelId,
        content: response.message,
        direction: 'OUTBOUND',
        sender: 'BOT',
        messageId: response.messageId,
        metadata: { intent, needsHuman: true },
      });

      return {
        shouldRespond: true,
        transferred: true,
        intent,
      };
    }

    // 7. Gerar resposta com IA
    const aiResponse = await openaiService.generateResponse(
      incomingMessage.body,
      {
        name: hotel.name,
        checkInTime: hotel.checkInTime,
        checkOutTime: hotel.checkOutTime,
        phone: hotel.phone,
        email: hotel.email,
      },
      hotel.faqs
    );

    // 8. Enviar resposta
    const sentMessage = await whatsappService.sendMessage(
      incomingMessage.from,
      aiResponse.response
    );

    // 9. Salvar resposta no banco
    await saveMessage({
      conversationId: conversation.id,
      hotelId,
      content: aiResponse.response,
      direction: 'OUTBOUND',
      sender: 'BOT',
      messageId: sentMessage.messageId,
      aiModel: aiResponse.model,
      aiTokens: aiResponse.tokensUsed,
      aiConfidence: aiResponse.confidence,
      aiIntent: intent,
    });

    // 10. Atualizar métricas da conversa
    await updateConversationMetrics(conversation.id);

    return {
      shouldRespond: true,
      response: aiResponse.response,
      intent,
      confidence: aiResponse.confidence,
    };
  } catch (error) {
    logger.error('Erro ao processar mensagem:', error);
    throw error;
  }
};

/**
 * Buscar ou criar conversa
 */
async function findOrCreateConversation(guestPhone, hotelId) {
  // Buscar conversa ativa existente
  let conversation = await prisma.conversation.findFirst({
    where: {
      hotelId,
      guestPhone,
      status: 'ACTIVE',
    },
  });

  // Se não existir, criar nova
  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        hotelId,
        guestPhone,
        channel: 'WHATSAPP',
        status: 'ACTIVE',
      },
    });

    logger.info(`Nova conversa criada: ${conversation.id}`);
  }

  return conversation;
}

/**
 * Salvar mensagem no banco
 */
async function saveMessage(data) {
  return await prisma.message.create({
    data: {
      conversationId: data.conversationId,
      hotelId: data.hotelId,
      content: data.content,
      direction: data.direction,
      sender: data.sender,
      messageId: data.messageId,
      aiModel: data.aiModel,
      aiTokens: data.aiTokens,
      aiConfidence: data.aiConfidence,
      aiIntent: data.aiIntent,
      status: data.status || 'SENT',
      metadata: data.metadata,
    },
  });
}

/**
 * Transferir conversa para humano
 */
async function handoverToHuman(conversationId) {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      isHandedOver: true,
      handedOverAt: new Date(),
      status: 'WAITING',
    },
  });

  logger.info(`Conversa ${conversationId} transferida para humano`);
}

/**
 * Atualizar métricas da conversa
 */
async function updateConversationMetrics(conversationId) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      messages: {
        select: {
          direction: true,
          sender: true,
        },
      },
    },
  });

  const totalMessages = conversation.messages.length;
  const botResponses = conversation.messages.filter(
    m => m.direction === 'OUTBOUND' && m.sender === 'BOT'
  ).length;
  const humanResponses = conversation.messages.filter(
    m => m.direction === 'OUTBOUND' && m.sender === 'HUMAN'
  ).length;

  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      messageCount: totalMessages,
      botResponses,
      humanResponses,
    },
  });
}

/**
 * Obter histórico da conversa
 */
export const getConversationHistory = async (conversationId, limit = 50) => {
  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return messages.reverse(); // Retornar em ordem cronológica
};

/**
 * Encerrar conversa
 */
export const closeConversation = async (conversationId) => {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      status: 'CLOSED',
      endedAt: new Date(),
    },
  });

  logger.info(`Conversa ${conversationId} encerrada`);
};

/**
 * Assumir conversa (atendente humano)
 */
export const takeoverConversation = async (conversationId, userId) => {
  await prisma.conversation.update({
    where: { id: conversationId },
    data: {
      isHandedOver: true,
      handedOverBy: userId,
      handedOverAt: new Date(),
      status: 'ACTIVE',
    },
  });

  logger.info(`Conversa ${conversationId} assumida por ${userId}`);
};

/**
 * Enviar mensagem manual (atendente)
 */
export const sendManualMessage = async (conversationId, message, userId) => {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
  });

  // Enviar via WhatsApp
  const sentMessage = await whatsappService.sendMessage(
    conversation.guestPhone,
    message
  );

  // Salvar no banco
  await saveMessage({
    conversationId,
    hotelId: conversation.hotelId,
    content: message,
    direction: 'OUTBOUND',
    sender: 'HUMAN',
    messageId: sentMessage.messageId,
  });

  await updateConversationMetrics(conversationId);

  return sentMessage;
};

export default {
  processMessage,
  getConversationHistory,
  closeConversation,
  takeoverConversation,
  sendManualMessage,
};

