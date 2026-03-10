// Teste completo da API
import http from 'http';

const BASE_URL = 'http://localhost:4000';

function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 4000,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            data: body ? JSON.parse(body) : null,
          });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

async function runTests() {
  console.log('\n🧪 INICIANDO TESTES DA API\n');

  try {
    // 1. Health check
    console.log('1️⃣ Testando health check...');
    const health = await request('GET', '/health');
    console.log(`   ✅ Status: ${health.status} - ${JSON.stringify(health.data)}\n`);

    // 2. Criar hotel
    console.log('2️⃣ Criando hotel de teste...');
    const hotelData = {
      name: 'Hotel Teste MVP',
      phone: '+5511999999999',
      email: 'contato@hotelteste.com',
      city: 'São Paulo',
      state: 'SP',
      whatsappNumber: '+5511999999999',
      whatsappEnabled: true,
    };

    // Primeiro, criar manualmente no banco
    console.log('   ⏭️  Pulando (precisa de autenticação)\n');

    // 3. Registrar usuário
    console.log('3️⃣ Registrando usuário...');
    const registerData = {
      email: 'admin@hotelteste.com',
      password: '123456',
      name: 'Admin Teste',
    };

    const register = await request('POST', '/api/auth/register', registerData);
    console.log(`   Status: ${register.status}`);

    if (register.status === 201) {
      console.log(`   ✅ Usuário criado!`);
      console.log(`   Token: ${register.data.data.token.substring(0, 20)}...\n`);

      const token = register.data.data.token;

      // 4. Testar autenticação
      console.log('4️⃣ Testando autenticação...');
      const meReq = http.request({
        hostname: 'localhost',
        port: 4000,
        path: '/api/auth/me',
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }, (res) => {
        let body = '';
        res.on('data', (chunk) => (body += chunk));
        res.on('end', () => {
          const data = JSON.parse(body);
          console.log(`   ✅ Status: ${res.statusCode}`);
          console.log(`   Nome: ${data.data.name}`);
          console.log(`   Email: ${data.data.email}\n`);
        });
      });
      meReq.end();

    } else {
      console.log(`   ⚠️  Erro: ${JSON.stringify(register.data)}\n`);
    }

    // 5. Teste de login
    console.log('5️⃣ Testando login...');
    const loginData = {
      email: 'admin@hotelteste.com',
      password: '123456',
    };

    const login = await request('POST', '/api/auth/login', loginData);
    console.log(`   Status: ${login.status}`);

    if (login.status === 200) {
      console.log(`   ✅ Login bem-sucedido!\n`);
    } else {
      console.log(`   ⚠️  Erro: ${JSON.stringify(login.data)}\n`);
    }

    console.log('✅ TESTES CONCLUÍDOS!\n');

  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
  }
}

// Aguardar servidor iniciar
setTimeout(runTests, 2000);

