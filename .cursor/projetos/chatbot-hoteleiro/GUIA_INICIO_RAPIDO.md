# 🚀 GUIA DE INÍCIO RÁPIDO - MVP CHATBOT HOTELEIRO

## ✅ O QUE JÁ FOI CRIADO

### 📁 Estrutura Completa do Projeto
```
chatbot-hoteleiro/
├── backend/              ✅ CRIADO
│   ├── src/
│   │   ├── config/      ✅ Logger configurado
│   │   ├── middleware/  ✅ Error handler pronto
│   │   ├── routes/      ⏳ Precisa implementar
│   │   ├── controllers/ ⏳ Precisa implementar
│   │   ├── services/    ⏳ Precisa implementar
│   │   └── server.js    ✅ Servidor configurado
│   ├── prisma/
│   │   └── schema.prisma ✅ Schema completo
│   ├── package.json     ✅ Dependências definidas
│   └── .gitignore       ✅ Configurado
├── frontend/            ⏳ A fazer
├── docs/                📝 Documentado
└── README.md            ✅ Completo
```

### 📊 Schema do Banco de Dados ✅
- ✅ Tabela de Usuários
- ✅ Tabela de Hotéis
- ✅ Tabela de FAQs
- ✅ Tabela de Conversas
- ✅ Tabela de Mensagens
- ✅ Tabela de Métricas
- ✅ Tabela de Logs

### 🔧 Configurações Base ✅
- ✅ Express.js configurado
- ✅ Middleware de segurança (Helmet)
- ✅ CORS configurado
- ✅ Rate limiting
- ✅ Logger (Winston)
- ✅ Error handler global

---

## 🎯 PRÓXIMOS PASSOS (EM ORDEM)

### PASSO 1: Instalar Dependências (5 minutos)

```bash
cd backend
npm install
```

**O que será instalado:**
- Express.js (servidor web)
- Prisma (ORM do banco)
- OpenAI (GPT-4)
- Twilio (WhatsApp)
- JWT (autenticação)
- E mais...

---

### PASSO 2: Configurar Variáveis de Ambiente (10 minutos)

```bash
# Copiar arquivo de exemplo
cp env.example .env
```

**Editar `.env` com suas credenciais:**

1. **PostgreSQL** (Banco de dados)
   ```
   DATABASE_URL="postgresql://postgres:senha@localhost:5432/chatbot_hotel"
   ```
   
2. **OpenAI** (IA - GPT-4)
   - Criar conta em: https://platform.openai.com/
   - Pegar API Key
   ```
   OPENAI_API_KEY="sk-..."
   ```

3. **Twilio** (WhatsApp)
   - Criar conta em: https://www.twilio.com/
   - Pegar credenciais
   ```
   TWILIO_ACCOUNT_SID="AC..."
   TWILIO_AUTH_TOKEN="..."
   TWILIO_WHATSAPP_NUMBER="+14155238886"
   ```

4. **JWT Secret** (Autenticação)
   ```bash
   # Gerar secret seguro
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

---

### PASSO 3: Configurar Banco de Dados (15 minutos)

```bash
# Instalar PostgreSQL (se não tiver)
# Windows: https://www.postgresql.org/download/windows/
# Mac: brew install postgresql
# Linux: sudo apt install postgresql

# Criar banco de dados
createdb chatbot_hotel

# Gerar cliente Prisma
npx prisma generate

# Rodar migrations
npx prisma migrate dev --name init

# Ver banco no navegador (opcional)
npx prisma studio
```

---

### PASSO 4: Implementar Rotas e Controllers (2-3 horas)

**O que precisa ser feito:**

#### 4.1 - Auth Routes (Autenticação)
```javascript
// src/routes/auth.routes.js
POST /api/auth/register  - Cadastrar usuário
POST /api/auth/login     - Login
POST /api/auth/logout    - Logout
GET  /api/auth/me        - Dados do usuário logado
```

#### 4.2 - Hotel Routes
```javascript
// src/routes/hotel.routes.js
GET    /api/hotels           - Listar hotéis
POST   /api/hotels           - Criar hotel
GET    /api/hotels/:id       - Detalhes
PUT    /api/hotels/:id       - Atualizar
DELETE /api/hotels/:id       - Deletar
```

#### 4.3 - FAQ Routes
```javascript
// src/routes/faq.routes.js
GET    /api/faqs             - Listar FAQs
POST   /api/faqs             - Criar FAQ
PUT    /api/faqs/:id         - Atualizar
DELETE /api/faqs/:id         - Deletar
```

#### 4.4 - Webhook Routes (MAIS IMPORTANTE!)
```javascript
// src/routes/webhook.routes.js
POST /api/webhooks/whatsapp  - Receber mensagens Twilio
POST /api/webhooks/status    - Status de entrega
```

---

### PASSO 5: Integração WhatsApp + IA (3-4 horas)

**Criar serviços:**

#### 5.1 - WhatsApp Service
```javascript
// src/services/whatsapp.service.js
- sendMessage(to, message)
- receiveMessage(webhook)
- validateRequest(signature)
```

#### 5.2 - OpenAI Service
```javascript
// src/services/openai.service.js
- generateResponse(message, context, faqs)
- detectIntent(message)
- extractInfo(message)
```

#### 5.3 - Conversation Service
```javascript
// src/services/conversation.service.js
- startConversation(guestPhone, hotelId)
- addMessage(conversationId, message)
- getConversationHistory(conversationId)
- shouldTransferToHuman(conversation)
```

---

### PASSO 6: Testar MVP (1 hora)

```bash
# Rodar servidor
npm run dev

# Testar endpoints
curl http://localhost:3000/health

# Enviar mensagem de teste via Twilio
# (Configurar webhook no Twilio Dashboard)
```

---

### PASSO 7: Frontend Básico (4-6 horas)

**Criar:**
- Login/Register
- Dashboard com métricas
- Gerenciar FAQs
- Ver conversas em tempo real
- Configurações do hotel

---

## 📦 COMANDOS ÚTEIS

```bash
# Desenvolvimento
npm run dev              # Rodar servidor em dev mode
npm run prisma:studio    # Ver banco de dados

# Banco de Dados
npm run prisma:generate  # Gerar cliente Prisma
npm run prisma:migrate   # Rodar migrations
npm run prisma:seed      # Popular banco

# Testes
npm test                 # Rodar testes
npm run test:coverage    # Coverage

# Produção
npm start                # Rodar em produção
```

---

## 🔥 COMEÇAR AGORA (Ação Imediata)

### Opção 1: Tudo Automático (Recomendado)

```bash
cd backend
npm install
cp env.example .env
# EDITE o .env com suas credenciais
npx prisma migrate dev
npm run dev
```

### Opção 2: Passo a Passo

1. ✅ Estrutura já criada
2. ⏳ Instalar dependências: `npm install`
3. ⏳ Configurar .env
4. ⏳ Setup banco: `npx prisma migrate dev`
5. ⏳ Implementar rotas
6. ⏳ Integrar WhatsApp + OpenAI
7. ⏳ Testar

---

## 📚 DOCUMENTAÇÃO IMPORTANTE

### APIs que você vai usar:

1. **OpenAI GPT-4**
   - Docs: https://platform.openai.com/docs
   - Pricing: $0.01 por 1K tokens (~R$ 0.05)
   - Limite free: $5 de crédito grátis

2. **Twilio WhatsApp**
   - Docs: https://www.twilio.com/docs/whatsapp
   - Pricing: $0.005 por mensagem (~R$ 0.025)
   - Trial: Número de teste grátis

3. **Prisma ORM**
   - Docs: https://www.prisma.io/docs
   - Totalmente grátis

---

## 🎯 CRONOGRAMA SUGERIDO

### Semana 1: Backend Core
- Dia 1: Setup + Banco de Dados ✅
- Dia 2-3: Rotas e Controllers
- Dia 4-5: Integração WhatsApp + OpenAI
- Dia 6-7: Testes e ajustes

### Semana 2: Frontend + Testes
- Dia 1-2: Dashboard básico
- Dia 3-4: Gerenciar FAQs
- Dia 5: Ver conversas
- Dia 6-7: Testes com hotel real

### Semana 3: Refinamento
- Ajustes baseados em feedback
- Melhorias na IA
- Deploy em produção
- Documentação

---

## 💡 DICAS IMPORTANTES

1. **Comece Simples**
   - Primeiro faça funcionar com 1 hotel
   - Depois otimize para multi-tenant

2. **Teste Muito**
   - Use Postman/Insomnia para testar API
   - Teste conversas reais no WhatsApp
   - Simule diferentes cenários

3. **Documente Tudo**
   - Comente o código
   - Anote decisões importantes
   - Mantenha changelog

4. **Foque no MVP**
   - Não adicione features extras agora
   - Funcionalidades essenciais primeiro
   - Refinamento depois

---

## 🆘 PROBLEMAS COMUNS

### "npm install" falha
```bash
# Limpar cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Erro ao conectar no banco
```bash
# Verificar se PostgreSQL está rodando
# Windows: services.msc → PostgreSQL
# Mac/Linux: sudo service postgresql status

# Testar conexão
psql -U postgres -h localhost
```

### Twilio webhook não funciona
```bash
# Usar ngrok para expor localhost
ngrok http 3000
# Copiar URL https://xxx.ngrok.io
# Configurar no Twilio: https://xxx.ngrok.io/api/webhooks/whatsapp
```

---

## ✅ CHECKLIST DE PROGRESSO

- [x] Estrutura de pastas criada
- [x] Schema do banco definido
- [x] Servidor base configurado
- [x] Middleware de erro pronto
- [ ] Dependências instaladas
- [ ] .env configurado
- [ ] Banco de dados criado
- [ ] Rotas implementadas
- [ ] WhatsApp integrado
- [ ] OpenAI integrado
- [ ] Testes básicos rodando
- [ ] Frontend criado
- [ ] Deploy feito

---

## 🚀 STATUS ATUAL

**Você está aqui:** 30% completo

**Próximo passo:** Instalar dependências

```bash
cd backend
npm install
```

**Tempo estimado para MVP completo:** 2-3 semanas

---

**Bora codar! 💪🤖**

