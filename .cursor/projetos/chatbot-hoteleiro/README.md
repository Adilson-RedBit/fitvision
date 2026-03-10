# 🤖 Chatbot Hoteleiro Inteligente

Sistema de chatbot com IA para automação de atendimento em hotéis.

## 📋 Sobre o Projeto

MVP de um chatbot inteligente que integra WhatsApp Business com GPT-4 para atender hóspedes de hotéis automaticamente, respondendo perguntas frequentes, fazendo reservas e proporcionando atendimento 24/7.

## 🎯 Funcionalidades MVP

- ✅ Integração com WhatsApp Business (Twilio)
- ✅ IA Conversacional (OpenAI GPT-4)
- ✅ Sistema de FAQ gerenciável
- ✅ Transferência inteligente para humano
- ✅ Dashboard de administração
- ✅ Métricas básicas de atendimento
- ✅ Multi-hotel (SaaS)

## 🛠️ Tecnologias

### Backend
- **Node.js** v18+
- **Express.js** - Framework web
- **PostgreSQL** - Banco de dados
- **Prisma** - ORM
- **Redis** - Cache
- **OpenAI API** - GPT-4
- **Twilio API** - WhatsApp

### Frontend
- **React.js** v18+
- **Vite** - Build tool
- **TailwindCSS** - Estilização
- **React Query** - State management
- **Recharts** - Gráficos

## 📁 Estrutura do Projeto

```
chatbot-hoteleiro/
├── backend/
│   ├── src/
│   │   ├── config/          # Configurações
│   │   ├── controllers/     # Controladores
│   │   ├── services/        # Lógica de negócio
│   │   ├── models/          # Modelos de dados (Prisma)
│   │   ├── routes/          # Rotas da API
│   │   ├── middleware/      # Middlewares
│   │   ├── utils/           # Utilitários
│   │   └── server.js        # Entrada da aplicação
│   ├── tests/               # Testes
│   ├── prisma/              # Schema do banco
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # Componentes React
│   │   ├── pages/           # Páginas
│   │   ├── services/        # API calls
│   │   ├── hooks/           # Custom hooks
│   │   ├── utils/           # Utilitários
│   │   └── App.jsx
│   └── package.json
├── docs/                    # Documentação
└── scripts/                 # Scripts auxiliares
```

## 🚀 Como Rodar o Projeto

### Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Redis (opcional para cache)
- Conta Twilio (WhatsApp Business)
- Conta OpenAI (API Key)

### 1. Clonar e Instalar

```bash
# Clonar repositório
git clone <url>
cd chatbot-hoteleiro

# Instalar dependências do backend
cd backend
npm install

# Instalar dependências do frontend
cd ../frontend
npm install
```

### 2. Configurar Variáveis de Ambiente

```bash
# Backend - criar arquivo .env
cd backend
cp .env.example .env
```

Edite `.env` com suas credenciais:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DATABASE_URL="postgresql://user:password@localhost:5432/chatbot_hotel"

# Redis (opcional)
REDIS_URL="redis://localhost:6379"

# OpenAI
OPENAI_API_KEY="sk-..."

# Twilio (WhatsApp)
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="..."
TWILIO_WHATSAPP_NUMBER="+14155238886"

# JWT
JWT_SECRET="seu-secret-super-seguro-aqui"

# URLs
FRONTEND_URL="http://localhost:5173"
```

### 3. Configurar Banco de Dados

```bash
# Rodar migrations
cd backend
npx prisma migrate dev

# Seed (dados iniciais)
npx prisma db seed
```

### 4. Rodar Aplicação

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

**URLs:**
- Backend API: http://localhost:3000
- Frontend: http://localhost:5173

## 📚 Documentação da API

### Autenticação

```bash
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
```

### Webhooks

```bash
POST /api/webhooks/whatsapp     # Recebe mensagens do Twilio
POST /api/webhooks/status       # Status de entrega
```

### Hotéis

```bash
GET    /api/hotels              # Listar hotéis
POST   /api/hotels              # Criar hotel
GET    /api/hotels/:id          # Detalhes do hotel
PUT    /api/hotels/:id          # Atualizar hotel
DELETE /api/hotels/:id          # Deletar hotel
```

### FAQ

```bash
GET    /api/hotels/:id/faqs     # Listar FAQs
POST   /api/hotels/:id/faqs     # Criar FAQ
PUT    /api/faqs/:id            # Atualizar FAQ
DELETE /api/faqs/:id            # Deletar FAQ
```

### Conversas

```bash
GET    /api/conversations       # Listar conversas
GET    /api/conversations/:id   # Detalhes da conversa
POST   /api/conversations/:id/takeover  # Assumir conversa
```

### Métricas

```bash
GET    /api/metrics/dashboard   # Métricas gerais
GET    /api/metrics/conversations  # Métricas de conversas
```

## 🧪 Testes

```bash
# Backend - rodar todos os testes
cd backend
npm test

# Testes com coverage
npm run test:coverage

# Frontend - rodar testes
cd frontend
npm test
```

## 📦 Deploy

### Backend (Railway/Heroku/AWS)

```bash
# Build
npm run build

# Rodar em produção
npm start
```

### Frontend (Vercel/Netlify)

```bash
# Build
npm run build

# Preview
npm run preview
```

## 🔐 Segurança

- ✅ Autenticação JWT
- ✅ Rate limiting
- ✅ CORS configurado
- ✅ Validação de dados (Zod)
- ✅ Sanitização de inputs
- ✅ HTTPS em produção

## 📈 Roadmap

### Fase 1: MVP (Atual) ✅
- [x] Integração WhatsApp
- [x] Chat com GPT-4
- [x] Dashboard básico
- [x] Sistema de FAQ

### Fase 2: Features Avançadas
- [ ] Múltiplos canais (FB, IG)
- [ ] Reservas pelo chat
- [ ] Check-in digital
- [ ] Analytics avançado

### Fase 3: Premium
- [ ] Multilíngue
- [ ] Upsell inteligente
- [ ] Integração PMS
- [ ] Análise de sentimento

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 💬 Suporte

- Email: suporte@chatbothoteleiro.com
- WhatsApp: +55 11 99999-9999
- Docs: https://docs.chatbothoteleiro.com

---

**Desenvolvido com ❤️ para revolucionar o atendimento na hotelaria** 🏨

