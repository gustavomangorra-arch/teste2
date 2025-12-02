# 🚀 GenesiX Backend

**Backend completo para a plataforma GenesiX** - Sistema de criação e gestão de produtos digitais com metodologia estruturada.

[![Node.js](https://img.shields.io/badge/Node.js-18+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18+-blue.svg)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-blue.svg)](https://postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Auth-orange.svg)](https://jwt.io/)

---

## 📋 Índice

1. [Características](#características)
2. [Tecnologias](#tecnologias)
3. [Instalação](#instalação)
4. [Configuração](#configuração)
5. [Uso](#uso)
6. [APIs](#apis)
7. [Estrutura do Projeto](#estrutura-do-projeto)
8. [Deploy](#deploy)
9. [Contribuição](#contribuição)

---

## ✨ Características

### 🔐 **Autenticação Robusta**
- JWT com refresh tokens automáticos
- OAuth integrado (Google, GitHub, LinkedIn)
- Sistema de recuperação de senha
- Rate limiting e proteção contra ataques

### 👥 **Gestão de Usuários**
- Perfis detalhados com áreas de atuação
- Sistema de busca e estatísticas
- Upload de avatars
- Configurações personalizáveis

### 📄 **Documentos Estruturados**
- CRUD completo por etapas do GenesiX
- Versionamento automático
- Sistema de aprovação
- Suporte a múltiplos formatos (JSON, Markdown, HTML)

### 🤝 **Colaboração Avançada**
- Convites por email com tokens seguros
- Roles hierárquicos (owner > admin > editor > viewer)
- Permissões granulares
- Gestão de projetos colaborativos

### ⚙️ **Configurações Flexíveis**
- Temas e idiomas
- Notificações personalizáveis
- Auto-save configurável
- Export/import de configurações

---

## 🛠️ Tecnologias

| Categoria | Tecnologia | Versão | Descrição |
|-----------|------------|--------|-----------|
| **Runtime** | Node.js | 18+ | Ambiente de execução JavaScript |
| **Framework** | Express.js | 4.18+ | Framework web minimalista |
| **Banco de Dados** | PostgreSQL | 14+ | Banco relacional robusto |
| **ORM** | Sequelize | 6.35+ | Object-Relational Mapping |
| **Autenticação** | Passport.js | 0.7+ | Middleware de autenticação |
| **Tokens** | jsonwebtoken | 9.0+ | Geração e validação de JWT |
| **Validação** | express-validator | 7.0+ | Validação de dados de entrada |
| **Segurança** | Helmet | 7.1+ | Headers de segurança |
| **CORS** | cors | 2.8+ | Cross-Origin Resource Sharing |
| **Rate Limiting** | express-rate-limit | 7.1+ | Controle de taxa de requisições |
| **Hash** | bcryptjs | 2.4+ | Hash de senhas |
| **Logs** | morgan | 1.10+ | Logging de requisições HTTP |

---

## 🚀 Instalação

### Pré-requisitos
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://postgresql.org/download/))
- **npm** ou **yarn**

### 1. Clone o Repositório
```bash
git clone https://github.com/seu-usuario/genesix-backend.git
cd genesix-backend
```

### 2. Instale as Dependências
```bash
npm install
```

### 3. Configure o Banco de Dados
```bash
# Criar banco de dados
createdb genesix

# Ou via psql
psql -U postgres
CREATE DATABASE genesix;
\q
```

### 4. Configure as Variáveis de Ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Banco de dados
DATABASE_URL=postgresql://postgres:password@localhost:5432/genesix
DB_HOST=localhost
DB_PORT=5432
DB_NAME=genesix
DB_USER=postgres
DB_PASSWORD=sua_senha

# JWT
JWT_SECRET=seu_jwt_secret_muito_seguro_aqui
JWT_REFRESH_SECRET=seu_refresh_secret_muito_seguro_aqui
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# OAuth (opcional)
GOOGLE_CLIENT_ID=seu_google_client_id
GOOGLE_CLIENT_SECRET=seu_google_client_secret
GITHUB_CLIENT_ID=seu_github_client_id
GITHUB_CLIENT_SECRET=seu_github_client_secret
LINKEDIN_CLIENT_ID=seu_linkedin_client_id
LINKEDIN_CLIENT_SECRET=seu_linkedin_client_secret

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

### 5. Execute as Migrações
```bash
# Sincronizar modelos com o banco
npm run db:sync

# Ou criar tabelas manualmente se necessário
npm run db:create-tables
```

### 6. Inicie o Servidor
```bash
# Desenvolvimento
npm run dev

# Produção
npm start
```

O servidor estará rodando em `http://localhost:3001`

---

## ⚙️ Configuração

### Configuração do OAuth

#### Google OAuth
1. Acesse o [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Ative a API do Google+
4. Crie credenciais OAuth 2.0
5. Configure as URLs de redirecionamento:
   - `http://localhost:3001/api/auth/google/callback` (desenvolvimento)
   - `https://seudominio.com/api/auth/google/callback` (produção)

#### GitHub OAuth
1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Crie uma nova OAuth App
3. Configure as URLs:
   - Homepage URL: `http://localhost:3000`
   - Authorization callback URL: `http://localhost:3001/api/auth/github/callback`

#### LinkedIn OAuth
1. Acesse [LinkedIn Developer Portal](https://developer.linkedin.com/)
2. Crie uma nova aplicação
3. Configure as URLs de redirecionamento
4. Solicite permissões para `r_liteprofile` e `r_emailaddress`

### Configuração de Email (Opcional)
Para funcionalidades de email (recuperação de senha, convites):

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
```

---

## 🎯 Uso

### Scripts Disponíveis

```bash
# Desenvolvimento com hot reload
npm run dev

# Produção
npm start

# Testes
npm test

# Linting
npm run lint

# Sincronizar banco de dados
npm run db:sync

# Verificar saúde do servidor
curl http://localhost:3001/health
```

### Testando a API

#### Health Check
```bash
curl http://localhost:3001/health
```

#### Registro de Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@exemplo.com",
    "senha": "minhasenha123"
  }'
```

#### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@exemplo.com",
    "senha": "minhasenha123"
  }'
```

#### Requisição Autenticada
```bash
curl -X GET http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

---

## 📚 APIs

### Endpoints Principais

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| `POST` | `/api/auth/register` | Cadastrar usuário | ❌ |
| `POST` | `/api/auth/login` | Login | ❌ |
| `GET` | `/api/auth/me` | Dados do usuário | ✅ |
| `POST` | `/api/auth/logout` | Logout | ✅ |
| `GET` | `/api/users/:id` | Perfil do usuário | ✅ |
| `PUT` | `/api/users/:id` | Atualizar usuário | ✅ |
| `GET` | `/api/documents` | Listar documentos | ✅ |
| `POST` | `/api/documents` | Criar documento | ✅ |
| `GET` | `/api/collaborators/:project_id` | Listar colaboradores | ✅ |
| `POST` | `/api/collaborators` | Convidar colaborador | ✅ |
| `GET` | `/api/settings` | Configurações | ✅ |
| `PUT` | `/api/settings` | Atualizar configurações | ✅ |

### Documentação Completa
Consulte a [documentação completa das APIs](./API_DOCUMENTATION.md) para detalhes sobre todos os endpoints, parâmetros e exemplos de uso.

---

## 📁 Estrutura do Projeto

```
genesix_backend/
├── src/
│   ├── config/
│   │   ├── database.js          # Configuração do banco
│   │   └── passport.js          # Configuração OAuth
│   ├── middleware/
│   │   └── auth.js              # Middleware de autenticação
│   ├── models/
│   │   ├── index.js             # Associações dos modelos
│   │   ├── User.js              # Modelo de usuário
│   │   ├── UserProfile.js       # Perfil do usuário
│   │   ├── Project.js           # Projetos
│   │   ├── Document.js          # Documentos
│   │   ├── Collaborator.js      # Colaboradores
│   │   └── Settings.js          # Configurações
│   ├── routes/
│   │   ├── auth.js              # Rotas de autenticação
│   │   ├── users.js             # Rotas de usuários
│   │   ├── documents.js         # Rotas de documentos
│   │   ├── collaborators.js     # Rotas de colaboradores
│   │   └── settings.js          # Rotas de configurações
│   ├── utils/
│   │   ├── helpers.js           # Funções auxiliares
│   │   └── validators.js        # Validadores customizados
│   └── server.js                # Servidor principal
├── .env.example                 # Exemplo de variáveis de ambiente
├── .gitignore                   # Arquivos ignorados pelo Git
├── package.json                 # Dependências e scripts
├── README.md                    # Este arquivo
└── API_DOCUMENTATION.md         # Documentação das APIs
```

---

## 🚀 Deploy

### Deploy no Heroku

1. **Instale o Heroku CLI**
```bash
npm install -g heroku
```

2. **Faça login no Heroku**
```bash
heroku login
```

3. **Crie uma aplicação**
```bash
heroku create genesix-backend
```

4. **Configure o banco PostgreSQL**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

5. **Configure as variáveis de ambiente**
```bash
heroku config:set JWT_SECRET=seu_jwt_secret_muito_seguro
heroku config:set JWT_REFRESH_SECRET=seu_refresh_secret
heroku config:set FRONTEND_URL=https://seu-frontend.vercel.app
# ... outras variáveis
```

6. **Deploy**
```bash
git push heroku main
```

### Deploy no Railway

1. **Conecte seu repositório no [Railway](https://railway.app/)**
2. **Configure as variáveis de ambiente no dashboard**
3. **O deploy será automático a cada push**

### Deploy no DigitalOcean App Platform

1. **Conecte seu repositório no [DigitalOcean](https://cloud.digitalocean.com/apps)**
2. **Configure o banco PostgreSQL**
3. **Configure as variáveis de ambiente**
4. **Deploy automático configurado**

### Docker (Opcional)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY src/ ./src/
COPY .env ./

EXPOSE 3001

CMD ["npm", "start"]
```

```bash
# Build
docker build -t genesix-backend .

# Run
docker run -p 3001:3001 --env-file .env genesix-backend
```

---

## 🔒 Segurança

### Medidas Implementadas

- **Helmet.js** - Headers de segurança
- **CORS** configurado adequadamente
- **Rate Limiting** por IP e usuário
- **Validação rigorosa** de entrada
- **Sanitização** de dados
- **JWT** com refresh tokens
- **Bcrypt** para hash de senhas
- **SQL Injection** prevenido pelo Sequelize
- **XSS** prevenido por sanitização

### Auditoria de Segurança
```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente
npm audit fix
```

---

## 📊 Monitoramento

### Logs
Os logs são estruturados e incluem:
- Requisições HTTP (Morgan)
- Erros de aplicação
- Tentativas de autenticação
- Operações de banco de dados

### Métricas
- Tempo de resposta das APIs
- Taxa de erro por endpoint
- Uso de memória e CPU
- Conexões ativas do banco

### Health Check
```bash
curl http://localhost:3001/health
```

Resposta:
```json
{
  "status": "OK",
  "timestamp": "2025-01-01T00:00:00.000Z",
  "uptime": 3600.123,
  "database": "connected",
  "memory": {
    "used": "45.2 MB",
    "total": "128 MB"
  }
}
```

---

## 🤝 Contribuição

### Como Contribuir

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. **Commit** suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade'`)
4. **Push** para a branch (`git push origin feature/nova-funcionalidade`)
5. **Abra** um Pull Request

### Diretrizes

- Siga o padrão de código existente
- Adicione testes para novas funcionalidades
- Atualize a documentação quando necessário
- Use commits semânticos
- Mantenha o código limpo e bem comentado

### Reportar Bugs

Use as [Issues do GitHub](https://github.com/seu-usuario/genesix-backend/issues) para reportar bugs, incluindo:

- Descrição detalhada do problema
- Passos para reproduzir
- Comportamento esperado vs atual
- Screenshots (se aplicável)
- Informações do ambiente

---

## 📄 Licença

Este projeto está licenciado sob a **MIT License** - veja o arquivo [LICENSE](LICENSE) para detalhes.

---

## 👥 Equipe

- **Desenvolvedor Principal:** [Seu Nome](https://github.com/seu-usuario)
- **Arquitetura:** Manus AI
- **Design de APIs:** Equipe GenesiX

---

## 🙏 Agradecimentos

- [Express.js](https://expressjs.com/) - Framework web
- [Sequelize](https://sequelize.org/) - ORM para Node.js
- [Passport.js](http://passportjs.org/) - Autenticação
- [PostgreSQL](https://postgresql.org/) - Banco de dados
- Comunidade open source

---

## 📞 Suporte

- **Documentação:** [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
- **Issues:** [GitHub Issues](https://github.com/seu-usuario/genesix-backend/issues)
- **Email:** suporte@genesix.com
- **Discord:** [Servidor da Comunidade](https://discord.gg/genesix)

---

**Desenvolvido com ❤️ para a comunidade de criadores de produtos digitais**

[![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red.svg)](https://github.com/seu-usuario/genesix-backend)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/seu-usuario/genesix-backend/pulls)
