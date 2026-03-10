import twilio from 'twilio';
import { logger } from '../config/logger.js';

// Inicializar cliente Twilio
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;

/**
 * Enviar mensagem via WhatsApp
 */
export const sendMessage = async (to, message) => {
  try {
    // Garantir que o número está no formato correto
    const formattedTo = formatPhoneNumber(to);
    
    const sentMessage = await client.messages.create({
      body: message,
      from: `whatsapp:${WHATSAPP_NUMBER}`,
      to: `whatsapp:${formattedTo}`
    });

    logger.info(`Mensagem enviada para ${formattedTo}. SID: ${sentMessage.sid}`);

    return {
      success: true,
      messageId: sentMessage.sid,
      status: sentMessage.status,
    };
  } catch (error) {
    logger.error('Erro ao enviar mensagem WhatsApp:', error);
    throw error;
  }
};

/**
 * Validar assinatura do webhook do Twilio (segurança)
 */
export const validateRequest = (req) => {
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioSignature = req.headers['x-twilio-signature'];
  const url = `${process.env.BACKEND_URL}${req.originalUrl}`;
  
  return twilio.validateRequest(authToken, twilioSignature, url, req.body);
};

/**
 * Processar mensagem recebida do webhook
 */
export const processIncomingMessage = (webhookData) => {
  return {
    messageId: webhookData.MessageSid,
    from: extractPhoneNumber(webhookData.From),
    to: extractPhoneNumber(webhookData.To),
    body: webhookData.Body,
    numMedia: parseInt(webhookData.NumMedia) || 0,
    mediaUrls: extractMediaUrls(webhookData),
    timestamp: new Date(),
  };
};

/**
 * Enviar mensagem com template (futuro - WhatsApp Business API)
 */
export const sendTemplateMessage = async (to, templateName, variables) => {
  // TODO: Implementar quando migrar para WhatsApp Business API oficial
  logger.warn('Envio de templates ainda não implementado');
  return { success: false, message: 'Não implementado' };
};

/**
 * Marcar mensagem como lida
 */
export const markAsRead = async (messageId) => {
  try {
    // Twilio Sandbox não suporta, mas deixar preparado
    logger.info(`Marcando mensagem ${messageId} como lida`);
    return { success: true };
  } catch (error) {
    logger.error('Erro ao marcar como lida:', error);
    return { success: false };
  }
};

/**
 * Enviar indicador de "digitando..."
 */
export const sendTypingIndicator = async (to) => {
  // Twilio Sandbox não suporta, mas deixar preparado para API oficial
  logger.debug(`Enviando indicador de digitação para ${to}`);
  return { success: true };
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Formatar número de telefone para formato internacional
 */
function formatPhoneNumber(phone) {
  // Remove todos os caracteres não numéricos
  let cleaned = phone.replace(/\D/g, '');
  
  // Se começar com 0, remove
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // Se não tiver código do país, adiciona +55 (Brasil)
  if (!cleaned.startsWith('55') && cleaned.length <= 11) {
    cleaned = '55' + cleaned;
  }
  
  // Adicionar + no início
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

/**
 * Extrair número de telefone do formato WhatsApp
 */
function extractPhoneNumber(whatsappNumber) {
  // Remove "whatsapp:" do início
  return whatsappNumber.replace('whatsapp:', '');
}

/**
 * Extrair URLs de mídia da mensagem
 */
function extractMediaUrls(webhookData) {
  const numMedia = parseInt(webhookData.NumMedia) || 0;
  const mediaUrls = [];
  
  for (let i = 0; i < numMedia; i++) {
    const mediaUrl = webhookData[`MediaUrl${i}`];
    const mediaType = webhookData[`MediaContentType${i}`];
    
    if (mediaUrl) {
      mediaUrls.push({
        url: mediaUrl,
        type: mediaType,
      });
    }
  }
  
  return mediaUrls;
}

/**
 * Obter status de uma mensagem
 */
export const getMessageStatus = async (messageSid) => {
  try {
    const message = await client.messages(messageSid).fetch();
    
    return {
      status: message.status,
      dateCreated: message.dateCreated,
      dateSent: message.dateSent,
      dateUpdated: message.dateUpdated,
      errorCode: message.errorCode,
      errorMessage: message.errorMessage,
    };
  } catch (error) {
    logger.error('Erro ao buscar status da mensagem:', error);
    throw error;
  }
};

export default {
  sendMessage,
  validateRequest,
  processIncomingMessage,
  sendTemplateMessage,
  markAsRead,
  sendTypingIndicator,
  getMessageStatus,
};

