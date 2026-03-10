import express from 'express';
import * as webhookController from '../controllers/webhook.controller.js';

const router = express.Router();

// Webhook do WhatsApp (Twilio)
router.post('/whatsapp', webhookController.handleWhatsAppMessage);

// Webhook de status de mensagens
router.post('/status', webhookController.handleMessageStatus);

// Health check do webhook
router.get('/health', (req, res) => {
  res.json({ status: 'Webhooks ativos' });
});

export default router;

