import OpenAI from 'openai';
import { logger } from '../config/logger.js';

// Inicializar cliente OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Gerar resposta da IA baseada no contexto do hotel e FAQs
 */
export const generateResponse = async (message, hotelContext, faqs) => {
  try {
    // Construir contexto do sistema
    const systemPrompt = buildSystemPrompt(hotelContext, faqs);
    
    // Chamar GPT-4
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-4-turbo-preview',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE) || 0.7,
      max_tokens: parseInt(process.env.OPENAI_MAX_TOKENS) || 500,
    });

    const response = completion.choices[0].message.content;
    const tokensUsed = completion.usage.total_tokens;

    logger.info(`IA respondeu. Tokens usados: ${tokensUsed}`);

    return {
      response,
      tokensUsed,
      model: completion.model,
      confidence: calculateConfidence(completion),
    };
  } catch (error) {
    logger.error('Erro ao gerar resposta da IA:', error);
    throw error;
  }
};

/**
 * Detectar intenção da mensagem
 */
export const detectIntent = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Você é um classificador de intenções para mensagens de hóspedes de hotel.
          Classifique a mensagem em uma das categorias:
          - pergunta_horario (horários de serviços)
          - pergunta_wifi (senha ou problemas com internet)
          - reserva (fazer ou consultar reserva)
          - reclamacao (problema ou insatisfação)
          - elogio (feedback positivo)
          - solicitacao_servico (pedir toalha, amenities, etc)
          - informacao_local (restaurantes, atrações)
          - outro
          
          Responda APENAS com o nome da categoria.`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.3,
      max_tokens: 20,
    });

    return completion.choices[0].message.content.trim().toLowerCase();
  } catch (error) {
    logger.error('Erro ao detectar intenção:', error);
    return 'outro';
  }
};

/**
 * Extrair informações importantes da mensagem
 */
export const extractInfo = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: `Extraia informações estruturadas da mensagem do hóspede.
          Retorne um JSON com:
          - nome (se mencionado)
          - email (se mencionado)
          - telefone (se mencionado)
          - data (se mencionada)
          - numeroQuarto (se mencionado)
          
          Se não encontrar, deixe null.`
        },
        { role: 'user', content: message }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    const extracted = JSON.parse(completion.choices[0].message.content);
    return extracted;
  } catch (error) {
    logger.error('Erro ao extrair informações:', error);
    return {};
  }
};

/**
 * Verificar se mensagem precisa de intervenção humana
 */
export const needsHumanIntervention = async (message, intent) => {
  // Casos que sempre precisam de humano
  const urgentKeywords = [
    'emergência', 'urgente', 'problema grave', 'insatisfeito',
    'cancelar', 'gerente', 'reclamação', 'péssimo'
  ];

  const messageLower = message.toLowerCase();
  const hasUrgentKeyword = urgentKeywords.some(keyword => 
    messageLower.includes(keyword)
  );

  // Intenções que precisam de humano
  const humanIntents = ['reclamacao', 'cancelamento'];

  return hasUrgentKeyword || humanIntents.includes(intent);
};

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Construir prompt do sistema com contexto do hotel
 */
function buildSystemPrompt(hotelContext, faqs) {
  let prompt = `Você é um assistente virtual inteligente do ${hotelContext.name}.

INFORMAÇÕES DO HOTEL:
- Nome: ${hotelContext.name}
- Check-in: ${hotelContext.checkInTime}
- Check-out: ${hotelContext.checkOutTime}
- Telefone: ${hotelContext.phone || 'Não informado'}
- Email: ${hotelContext.email || 'Não informado'}

INSTRUÇÕES:
- Seja amigável, prestativo e profissional
- Responda em português brasileiro
- Use emojis com moderação (apenas quando apropriado)
- Se não souber a resposta, seja honesto e ofereça transferir para um atendente
- Mantenha respostas concisas (máximo 3-4 linhas)
- Personalize respostas com o nome do hóspede quando disponível

`;

  // Adicionar FAQs ao contexto
  if (faqs && faqs.length > 0) {
    prompt += '\nPERGUNTAS FREQUENTES:\n';
    faqs.forEach((faq, index) => {
      prompt += `\n${index + 1}. ${faq.question}\n   ${faq.answer}\n`;
    });
  }

  prompt += '\nResponda à mensagem do hóspede de forma natural e útil.';

  return prompt;
}

/**
 * Calcular confiança da resposta (0-1)
 */
function calculateConfidence(completion) {
  // Heurística simples baseada no finish_reason
  if (completion.choices[0].finish_reason === 'stop') {
    return 0.9; // Alta confiança
  } else if (completion.choices[0].finish_reason === 'length') {
    return 0.6; // Média confiança (resposta cortada)
  } else {
    return 0.4; // Baixa confiança
  }
}

export default {
  generateResponse,
  detectIntent,
  extractInfo,
  needsHumanIntervention,
};

