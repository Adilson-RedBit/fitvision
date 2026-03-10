# 🎮 COMO TESTAR O CHATBOT - GUIA PRÁTICO

**Status Atual:** ✅ Servidor rodando em `http://localhost:3000`

---

## 🚀 OPÇÃO 1: Script Automático (MAIS FÁCIL)

### Execute o script de teste:

```powershell
cd C:\Users\Adilson\.cursor\projetos\chatbot-hoteleiro
.\testar-api.ps1
```

**O script testa automaticamente:**
- ✅ Health check
- ✅ Login
- ✅ Autenticação JWT
- ✅ Endpoints protegidos
- ✅ Métricas

---

## 🌐 OPÇÃO 2: Navegador (VISUAL)

### 1. Abra no navegador:
```
http://localhost:3000/health
```

**Você verá:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-30T20:22:26.225Z",
  "uptime": 8.89,
  "environment": "development"
}
```

### 2. Para testar POST/PUT/DELETE, use:

**Postman** (Recomendado)
- Download: https://www.postman.com/downloads/
- Importar coleção: `ENDPOINTS_DISPONIVEIS.md`

**Insomnia** (Alternativa)
- Download: https://insomnia.rest/download

---

## 💻 OPÇÃO 3: PowerShell (MANUAL)

### Fazer Login:
```powershell
$body = @{
    email = "admin@teste.com"
    password = "123456"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body $body -ContentType "application/json"

# Salvar token
$token = $response.data.token
Write-Host "Token: $token"
```

### Criar um FAQ:
```powershell
$body = @{
    question = "Qual o horário do café da manhã?"
    answer = "O café da manhã é servido das 6h às 10h."
    category = "Alimentação"
    keywords = "cafe,manha,breakfast,horario"
    isActive = $true
    order = 1
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/faqs" `
    -Method Post `
    -Body $body `
    -ContentType "application/json" `
    -Headers @{Authorization="Bearer $token"}
```

### Listar FAQs:
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/faqs" `
    -Method Get `
    -Headers @{Authorization="Bearer $token"}
```

---

## 📱 OPÇÃO 4: Testar WhatsApp (REAL)

### Passo 1: Configurar Credenciais

Edite o arquivo `.env`:
```bash
cd C:\Users\Adilson\.cursor\projetos\chatbot-hoteleiro\backend
notepad .env
```

**Substitua os placeholders:**
```env
OPENAI_API_KEY="sk-sua-chave-real-aqui"
TWILIO_ACCOUNT_SID="ACsua-conta-real"
TWILIO_AUTH_TOKEN="seu-token-real"
TWILIO_WHATSAPP_NUMBER="+14155238886"
```

### Passo 2: Expor servidor com ngrok

**Baixar ngrok:** https://ngrok.com/download

```powershell
# Instalar ngrok
choco install ngrok

# Ou baixar e executar
.\ngrok.exe http 3000
```

**Copie a URL gerada:**
```
https://abc123.ngrok.io
```

### Passo 3: Configurar Twilio

1. Acesse: https://console.twilio.com/
2. WhatsApp > Sandbox Settings
3. **When a message comes in:**
   ```
   https://abc123.ngrok.io/api/webhooks/whatsapp
   ```
4. Method: **POST**
5. Save

### Passo 4: Testar

1. Envie para o número do Twilio: `join <seu-código>`
2. Envie: "Olá, gostaria de informações sobre o hotel"
3. **O bot responderá automaticamente!** 🤖

---

## 🗄️ OPÇÃO 5: Ver Banco de Dados

### Abrir Prisma Studio (Interface Visual):
```powershell
cd C:\Users\Adilson\.cursor\projetos\chatbot-hoteleiro\backend
npx prisma studio
```

**Abre automaticamente em:** `http://localhost:5555`

**Você poderá:**
- ✅ Ver todas as tabelas
- ✅ Ver dados inseridos
- ✅ Editar registros
- ✅ Adicionar dados manualmente

---

## 📊 OPÇÃO 6: Monitorar Logs

### Ver logs em tempo real:
```powershell
cd C:\Users\Adilson\.cursor\projetos\chatbot-hoteleiro\backend
Get-Content .\logs\combined.log -Wait -Tail 20
```

**Ou ver apenas erros:**
```powershell
Get-Content .\logs\error.log -Wait -Tail 20
```

---

## 🧪 CENÁRIOS DE TESTE COMPLETOS

### Cenário 1: Criar Hotel + FAQs + Testar Bot

```powershell
# 1. Login
$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body '{"email":"admin@teste.com","password":"123456"}' -ContentType "application/json"
$token = $login.data.token

# 2. Criar Hotel
$hotel = @{
    name = "Hotel Paradise"
    phone = "+5511999999999"
    email = "contato@paradise.com"
    city = "São Paulo"
    state = "SP"
    whatsappNumber = "+5511999999999"
    whatsappEnabled = $true
} | ConvertTo-Json

$hotelResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/hotels" -Method Post -Body $hotel -ContentType "application/json" -Headers @{Authorization="Bearer $token"}

# 3. Criar FAQs
$faqs = @(
    @{
        question = "Qual o horário de check-in?"
        answer = "O check-in pode ser feito a partir das 14h."
        category = "Hospedagem"
        isActive = $true
        order = 1
    },
    @{
        question = "Tem Wi-Fi?"
        answer = "Sim! Wi-Fi gratuito em todos os ambientes. Senha: Paradise2025"
        category = "Comodidades"
        isActive = $true
        order = 2
    },
    @{
        question = "Qual o horário do café da manhã?"
        answer = "O café da manhã é servido das 6h às 10h no restaurante."
        category = "Alimentação"
        isActive = $true
        order = 3
    }
)

foreach ($faq in $faqs) {
    $faqJson = $faq | ConvertTo-Json
    Invoke-RestMethod -Uri "http://localhost:3000/api/faqs" -Method Post -Body $faqJson -ContentType "application/json" -Headers @{Authorization="Bearer $token"}
    Write-Host "✅ FAQ criado: $($faq.question)"
}

Write-Host "`n🎉 Hotel e FAQs configurados! Pronto para receber mensagens!"
```

### Cenário 2: Simular Conversa

```powershell
# Simular mensagem recebida (como se viesse do WhatsApp)
$webhook = @{
    MessageSid = "SM123teste"
    From = "whatsapp:+5511999999999"
    To = "whatsapp:+14155238886"
    Body = "Olá, qual o horário do check-in?"
} | ConvertTo-Json

# NOTA: Este endpoint normalmente é chamado pelo Twilio
# Para testar localmente, você pode criar um endpoint de teste
```

---

## 📚 DOCUMENTAÇÃO DISPONÍVEL

| Arquivo | Descrição |
|---------|-----------|
| `README.md` | Documentação completa do projeto |
| `GUIA_INICIO_RAPIDO.md` | Guia passo a passo para começar |
| `MVP_CONCLUIDO.md` | Resumo do MVP desenvolvido |
| `RELATORIO_TESTES.md` | Relatório detalhado dos testes |
| `ENDPOINTS_DISPONIVEIS.md` | Lista completa de endpoints |
| `COMO_TESTAR.md` | Este arquivo |

---

## ⚠️ TROUBLESHOOTING

### Servidor não inicia?
```powershell
# Matar processos Node
Get-Process -Name node | Stop-Process -Force

# Iniciar novamente
cd backend
npm run dev
```

### Porta 3000 ocupada?
```powershell
# Ver o que está usando a porta
netstat -ano | findstr :3000

# Mudar porta no .env
# PORT=4000
```

### Erro de conexão com banco?
```powershell
# Recriar banco
cd backend
Remove-Item dev.db
npx prisma migrate dev --name init
```

### Token expirado?
```powershell
# Fazer login novamente
$login = Invoke-RestMethod -Uri "http://localhost:3000/api/auth/login" -Method Post -Body '{"email":"admin@teste.com","password":"123456"}' -ContentType "application/json"
$token = $login.data.token
```

---

## 🎯 CHECKLIST DE TESTES

- [x] ✅ Health check funcionando
- [x] ✅ Login retornando token JWT
- [ ] ⬜ Hotel criado
- [ ] ⬜ FAQs criadas
- [ ] ⬜ Credenciais OpenAI configuradas
- [ ] ⬜ Credenciais Twilio configuradas
- [ ] ⬜ Webhook configurado (ngrok + Twilio)
- [ ] ⬜ Mensagem real recebida via WhatsApp
- [ ] ⬜ Bot respondeu automaticamente
- [ ] ⬜ Conversa salva no banco
- [ ] ⬜ Métricas geradas

---

## 🚀 PRÓXIMOS PASSOS

1. **Agora:** Execute `.\testar-api.ps1`
2. **Depois:** Crie hotel e FAQs
3. **Então:** Configure credenciais reais
4. **Finalmente:** Teste com WhatsApp real!

---

**📍 Localização:** `C:\Users\Adilson\.cursor\projetos\chatbot-hoteleiro`  
**🌐 Servidor:** `http://localhost:3000`  
**📊 Status:** ✅ Rodando e funcionando!

**🎉 DIVIRTA-SE TESTANDO!** 🚀

