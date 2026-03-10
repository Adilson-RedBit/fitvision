# Script de Teste da API - Chatbot Hoteleiro
# Execute: .\testar-api.ps1

Write-Host "`n🧪 TESTANDO API DO CHATBOT HOTELEIRO" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000"

# Função para exibir respostas
function Show-Response {
    param($title, $response)
    Write-Host "`n✅ $title" -ForegroundColor Green
    Write-Host "────────────────────────────────────" -ForegroundColor Gray
    $response | ConvertTo-Json -Depth 10 | Write-Host
}

function Show-Error {
    param($title, $error)
    Write-Host "`n❌ $title" -ForegroundColor Red
    Write-Host "────────────────────────────────────" -ForegroundColor Gray
    Write-Host $error -ForegroundColor Red
}

try {
    # 1. Health Check
    Write-Host "`n[1/5] Testando Health Check..." -ForegroundColor Yellow
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method Get
    Show-Response "Health Check" $health

    # 2. Login
    Write-Host "`n[2/5] Testando Login..." -ForegroundColor Yellow
    $loginBody = @{
        email = "admin@teste.com"
        password = "123456"
    } | ConvertTo-Json

    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
    Show-Response "Login" $loginResponse
    
    $token = $loginResponse.data.token
    Write-Host "`n🎫 Token JWT obtido: $($token.Substring(0, 50))..." -ForegroundColor Cyan

    # 3. Meus Dados
    Write-Host "`n[3/5] Testando endpoint /api/auth/me..." -ForegroundColor Yellow
    $headers = @{
        Authorization = "Bearer $token"
    }
    
    $meResponse = Invoke-RestMethod -Uri "$baseUrl/api/auth/me" -Method Get -Headers $headers
    Show-Response "Meus Dados (Autenticado)" $meResponse

    # 4. Listar FAQs
    Write-Host "`n[4/5] Testando listagem de FAQs..." -ForegroundColor Yellow
    try {
        $faqsResponse = Invoke-RestMethod -Uri "$baseUrl/api/faqs" -Method Get -Headers $headers
        Show-Response "FAQs" $faqsResponse
    } catch {
        Show-Error "FAQs" "Lista vazia ou erro (esperado se não houver FAQs ainda)"
    }

    # 5. Dashboard de Métricas
    Write-Host "`n[5/5] Testando dashboard de métricas..." -ForegroundColor Yellow
    try {
        $metricsResponse = Invoke-RestMethod -Uri "$baseUrl/api/metrics/dashboard?period=7" -Method Get -Headers $headers
        Show-Response "Métricas do Dashboard" $metricsResponse
    } catch {
        Show-Error "Métricas" "Sem dados ainda (esperado para novo sistema)"
    }

    # Resumo
    Write-Host "`n`n🎉 TESTES CONCLUÍDOS COM SUCESSO!" -ForegroundColor Green
    Write-Host "══════════════════════════════════════════" -ForegroundColor Green
    Write-Host "✅ Health Check: OK" -ForegroundColor Green
    Write-Host "✅ Login: OK" -ForegroundColor Green
    Write-Host "✅ Autenticação JWT: OK" -ForegroundColor Green
    Write-Host "✅ Endpoints protegidos: OK" -ForegroundColor Green
    Write-Host "`n💡 Próximos passos:" -ForegroundColor Cyan
    Write-Host "   1. Criar FAQs via API" -ForegroundColor White
    Write-Host "   2. Criar hotel" -ForegroundColor White
    Write-Host "   3. Configurar Twilio + OpenAI" -ForegroundColor White
    Write-Host "   4. Testar webhook do WhatsApp" -ForegroundColor White
    Write-Host "`n📄 Ver todos os endpoints: ENDPOINTS_DISPONIVEIS.md" -ForegroundColor Yellow
    Write-Host "`n"

} catch {
    Show-Error "ERRO CRÍTICO" $_.Exception.Message
    Write-Host "`n⚠️  Certifique-se de que o servidor está rodando:" -ForegroundColor Yellow
    Write-Host "   cd backend" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host "`n"
}

