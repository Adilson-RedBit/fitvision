# 📋 ENDPOINTS DISPONÍVEIS - CHATBOT HOTELEIRO

**Base URL:** `http://localhost:3000`

---

## ✅ PÚBLICOS (Sem autenticação)

### 🏥 Health Check
```http
GET /health
```

**Resposta:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-30T20:22:26.225Z",
  "uptime": 8.8938898,
  "environment": "development"
}
```

---

### 🔐 Registro de Usuário
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "seu@email.com",
  "password": "suasenha123",
  "name": "Seu Nome"
}
```

**Resposta (sucesso):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "seu@email.com",
      "name": "Seu Nome",
      "role": "ADMIN"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 🔑 Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@teste.com",
  "password": "123456"
}
```

**Resposta (sucesso):**
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "token": "SEU_TOKEN_JWT_AQUI"
  }
}
```

---

## 🔒 PROTEGIDOS (Requerem autenticação)

**Header obrigatório:**
```
Authorization: Bearer SEU_TOKEN_JWT_AQUI
```

---

### 👤 Meus Dados
```http
GET /api/auth/me
Authorization: Bearer TOKEN
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "admin@teste.com",
    "name": "Admin Teste",
    "role": "ADMIN",
    "hotel": null
  }
}
```

---

### 🔐 Alterar Senha
```http
PUT /api/auth/password
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "currentPassword": "123456",
  "newPassword": "novasenha123"
}
```

---

### 🏨 HOTÉIS

#### Listar Hotéis
```http
GET /api/hotels
Authorization: Bearer TOKEN
```

#### Criar Hotel
```http
POST /api/hotels
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Hotel Exemplo",
  "phone": "+5511999999999",
  "email": "contato@hotel.com",
  "city": "São Paulo",
  "state": "SP",
  "checkInTime": "14:00",
  "checkOutTime": "12:00",
  "whatsappNumber": "+5511999999999",
  "whatsappEnabled": true
}
```

#### Detalhes do Hotel
```http
GET /api/hotels/:id
Authorization: Bearer TOKEN
```

#### Atualizar Hotel
```http
PUT /api/hotels/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "name": "Hotel Atualizado",
  "whatsappEnabled": true
}
```

---

### ❓ FAQs

#### Listar FAQs
```http
GET /api/faqs
Authorization: Bearer TOKEN
```

#### Criar FAQ
```http
POST /api/faqs
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "question": "Qual o horário do café da manhã?",
  "answer": "O café da manhã é servido das 6h às 10h.",
  "category": "Alimentação",
  "keywords": "cafe,manha,horario,breakfast",
  "isActive": true,
  "order": 1
}
```

#### Atualizar FAQ
```http
PUT /api/faqs/:id
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "answer": "O café da manhã é servido das 6h30 às 10h30."
}
```

#### Deletar FAQ
```http
DELETE /api/faqs/:id
Authorization: Bearer TOKEN
```

---

### 💬 CONVERSAS

#### Listar Conversas
```http
GET /api/conversations
Authorization: Bearer TOKEN

# Com filtros:
GET /api/conversations?status=ACTIVE&limit=20&offset=0
```

**Query params:**
- `status`: ACTIVE, RESOLVED, WAITING, CLOSED
- `limit`: Número de resultados (padrão: 50)
- `offset`: Paginação (padrão: 0)

#### Detalhes da Conversa
```http
GET /api/conversations/:id
Authorization: Bearer TOKEN
```

**Retorna a conversa com todas as mensagens**

#### Assumir Conversa (Takeover)
```http
POST /api/conversations/:id/takeover
Authorization: Bearer TOKEN
```

**Transfere a conversa do bot para atendimento humano**

#### Enviar Mensagem Manual
```http
POST /api/conversations/:id/message
Authorization: Bearer TOKEN
Content-Type: application/json

{
  "message": "Olá! Como posso ajudar?"
}
```

#### Encerrar Conversa
```http
POST /api/conversations/:id/close
Authorization: Bearer TOKEN
```

---

### 📊 MÉTRICAS

#### Dashboard
```http
GET /api/metrics/dashboard?period=30
Authorization: Bearer TOKEN
```

**Query params:**
- `period`: Número de dias (padrão: 30)

**Resposta:**
```json
{
  "success": true,
  "data": {
    "period": "30 dias",
    "conversations": {
      "total": 150,
      "active": 12
    },
    "messages": {
      "total": 1250,
      "bot": 800,
      "human": 450
    },
    "performance": {
      "botResolutionRate": 85
    },
    "topIntents": [
      { "aiIntent": "pergunta_horario", "_count": 45 },
      { "aiIntent": "pergunta_wifi", "_count": 32 }
    ]
  }
}
```

#### Métricas Diárias
```http
GET /api/metrics/daily?days=7
Authorization: Bearer TOKEN
```

**Retorna métricas dos últimos N dias para gráficos**

---

### 📲 WEBHOOKS (Twilio/WhatsApp)

#### Receber Mensagem do WhatsApp
```http
POST /api/webhooks/whatsapp
Content-Type: application/x-www-form-urlencoded

# Payload enviado automaticamente pelo Twilio
MessageSid=SM...
From=whatsapp:+5511999999999
To=whatsapp:+14155238886
Body=Olá, gostaria de fazer uma reserva
```

**Este endpoint é chamado automaticamente pelo Twilio quando uma mensagem é recebida**

#### Status de Mensagem
```http
POST /api/webhooks/status
Content-Type: application/x-www-form-urlencoded

# Payload enviado automaticamente pelo Twilio
MessageSid=SM...
MessageStatus=delivered
```

---

## 🧪 TESTAR COM POWERSHELL

### Login
```powershell
$body = @{
    email = "admin@teste.com"
    password = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"
$token = $response.data.token
Write-Host "Token: $token"
```

### Criar FAQ
```powershell
$token = "SEU_TOKEN_AQUI"

$body = @{
    question = "Qual o horário do check-in?"
    answer = "O check-in pode ser feito a partir das 14h."
    category = "Hospedagem"
    keywords = "checkin,horario,entrada"
    isActive = $true
    order = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/faqs" -Method Post -Body $body -ContentType "application/json" -Headers @{Authorization="Bearer $token"}
```

### Ver Métricas
```powershell
$token = "SEU_TOKEN_AQUI"

Invoke-RestMethod -Uri "http://localhost:3000/api/metrics/dashboard?period=30" -Method Get -Headers @{Authorization="Bearer $token"}
```

---

## 🧪 TESTAR COM CURL

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@teste.com","password":"123456"}'
```

### Criar Hotel
```bash
TOKEN="seu_token_aqui"

curl -X POST http://localhost:3000/api/hotels \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Hotel Teste",
    "phone": "+5511999999999",
    "email": "contato@hotel.com",
    "city": "São Paulo",
    "state": "SP"
  }'
```

### Listar Conversas
```bash
TOKEN="seu_token_aqui"

curl -X GET "http://localhost:3000/api/conversations?status=ACTIVE&limit=10" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 📝 NOTAS IMPORTANTES

1. **Token JWT:** Expira em 7 dias. Após isso, faça login novamente.

2. **Rate Limiting:** Máximo de 100 requisições por IP a cada 15 minutos.

3. **Erros Comuns:**
   - `401 Unauthorized`: Token inválido ou expirado
   - `403 Forbidden`: Sem permissão para acessar o recurso
   - `400 Bad Request`: Dados inválidos no body
   - `404 Not Found`: Recurso não encontrado

4. **CORS:** Está habilitado para `http://localhost:5173` (frontend React)

5. **Logs:** Todos os erros são salvos em `backend/logs/`

---

## 🔐 SEGURANÇA

- ✅ JWT com secret de 64 caracteres
- ✅ Senhas hasheadas com Bcrypt (salt rounds: 10)
- ✅ Helmet para headers de segurança
- ✅ Rate limiting por IP
- ✅ CORS configurado
- ✅ Validação de dados com Zod

---

## 📚 RECURSOS

- **Documentação Completa:** `README.md`
- **Guia Rápido:** `GUIA_INICIO_RAPIDO.md`
- **Relatório de Testes:** `RELATORIO_TESTES.md`
- **Resumo do MVP:** `MVP_CONCLUIDO.md`

---

**🚀 Servidor rodando em:** `http://localhost:3000`  
**📊 Status:** ✅ Funcionando  
**🔒 Segurança:** ✅ Ativa  
**📝 Logs:** ✅ Ativos

