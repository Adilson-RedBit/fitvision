import { asyncHandler } from '../middleware/errorHandler.js';
import * as whatsappService from '../services/whatsapp.service.js';
import * as conversationService from '../services/conversation.service.js';
import prisma from '../config/database.js';
import { logger } from '../config/logger.js';

/**
 * Receber mensagem do WhatsApp (Twilio Webhook)
 */
export const handleWhatsAppMessage = asyncHandler(async (req, res) => {
  logger.info('Webhook WhatsApp recebido');

  // Validar assinatura do Twilio (segurança)
  // TODO: Descomentar em produção
  // const isValid = whatsappService.validateRequest(req);
  // if (!isValid) {
  //   logger.warn('Assinatura do Twilio inválida');
  //   return res.status(403).json({ error: 'Forbidden' });
  // }

  try {
    // Processar dados da mensagem
    const incomingMessage = whatsappService.processIncomingMessage(req.body);
    
    logger.info(`Mensagem recebida de: ${incomingMessage.from}`);
    logger.info(`Conteúdo: ${incomingMessage.body}`);

    // Identificar hotel pelo número do WhatsApp
    const hotel = await prisma.hotel.findFirst({
      where: {
        whatsappNumber: incomingMessage.to,
        whatsappEnabled: true,
        isActive: true,
      },
    });

    if (!hotel) {
      logger.warn(`Hotel não encontrado para número: ${incomingMessage.to}`);
      return res.status(200).send('OK'); // Retornar 200 para não reenviar
    }

    // Processar mensagem e gerar resposta
    const result = await conversationService.processMessage(
      incomingMessage,
      hotel.id
    );

    logger.info(`Mensagem processada. Resposta enviada: ${result.shouldRespond}`);

    // Twilio espera resposta 200
    res.status(200).send('OK');
  } catch (error) {
    logger.error('Erro ao processar webhook WhatsApp:', error);
    
    // Mesmo com erro, retornar 200 para não reenviar
    res.status(200).send('OK');
  }
});

/**
 * Receber status de mensagens (entregue, lido, etc)
 */
export const handleMessageStatus = asyncHandler(async (req, res) => {
  logger.info('Status de mensagem recebido');

  try {
    const { MessageSid, MessageStatus, To, From } = req.body;

    logger.info(`Status: ${MessageStatus} | SID: ${MessageSid}`);

    // Atualizar status da mensagem no banco
    const message = await prisma.message.findFirst({
      where: { messageId: MessageSid },
    });

    if (message) {
      const updateData = {
        status: MessageStatus.toUpperCase(),
      };

      if (MessageStatus === 'delivered') {
        updateData.deliveredAt = new Date();
      } else if (MessageStatus === 'read') {
        updateData.readAt = new Date();
      }

      await prisma.message.update({
        where: { id: message.id },
        data: updateData,
      });

      logger.info(`Mensagem ${MessageSid} atualizada para ${MessageStatus}`);
    }

    res.status(200).send('OK');
  } catch (error) {
    logger.error('Erro ao processar status:', error);
    res.status(200).send('OK');
  }
});

export default {
  handleWhatsAppMessage,
  handleMessageStatus,
};

