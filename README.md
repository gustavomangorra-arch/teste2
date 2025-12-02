# GenesiX Monorepo

Este repositório contém o código-fonte unificado do frontend e do backend da plataforma GenesiX. A estrutura é um **monorepo**, com o frontend e o backend separados em suas respectivas pastas.

## Estrutura do Projeto

-   `frontend/`: Contém o código-fonte do aplicativo web (React, Vite, Tailwind CSS).
-   `backend/`: Contém o código-fonte da API (Node.js, Express, PostgreSQL).

## Tecnologias Utilizadas

| Componente | Tecnologias Principais |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Shadcn/ui |
| **Backend** | Node.js, Express, PostgreSQL, Sequelize |

## Pré-requisitos

Para rodar o projeto localmente, você precisará ter instalado:

1.  **Node.js** (versão 18+ recomendada)
2.  **pnpm** (Gerenciador de pacotes, usado no `frontend/`)
3.  **PostgreSQL** (Servidor de banco de dados)

## Configuração

### 1. Backend (`backend/`)

1.  **Variáveis de Ambiente:** Crie um arquivo `.env` na pasta `backend/` (o arquivo `.env` já foi criado com as configurações padrão).
    ```bash
    cp backend/.env.example backend/.env
    ```
    O arquivo `.env` deve conter as seguintes variáveis (ajuste conforme sua configuração local do PostgreSQL):

    ```env
    # Variáveis de Ambiente para o Backend (Node.js/Express)

    # Configuração do Servidor
    PORT=3001
    NODE_ENV=development
    SECRET_KEY=sua_chave_secreta_aqui # Mude para uma chave forte em produção

    # Configuração do Frontend (para CORS)
    FRONTEND_URL=http://localhost:3000

    # Configuração do Banco de Dados (PostgreSQL)
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=genesix_db
    DB_USER=postgres
    DB_PASSWORD=postgres
    ```

2.  **Instalar Dependências:**
    ```bash
    cd backend
    npm install
    ```

3.  **Configurar Banco de Dados:**
    O backend utiliza PostgreSQL. Você precisará criar o banco de dados e sincronizar os modelos.
    ```bash
    # Crie o banco de dados 'genesix_db' no seu servidor PostgreSQL
    # Exemplo: psql -U postgres -c "CREATE DATABASE genesix_db;"

    # Sincronizar modelos (cria as tabelas no banco)
    npm run db:sync:force
    
    # Opcional: Rodar seeders para dados iniciais
    # npm run seed
    ```

4.  **Iniciar o Backend:**
    ```bash
    npm run dev
    # O servidor estará rodando em http://localhost:3001
    ```

### 2. Frontend (`frontend/`)

1.  **Instalar Dependências:** O projeto utiliza `pnpm` como gerenciador de pacotes.
    ```bash
    cd frontend
    pnpm install
    ```

2.  **Iniciar o Frontend:**
    ```bash
    pnpm run dev
    # O frontend estará rodando em http://localhost:3000
    ```
    **Nota:** O arquivo `vite.config.js` já está configurado com um proxy para redirecionar todas as chamadas para `/api` (ex: `/api/auth/login`) para o backend rodando em `http://localhost:3001`.

## Como Fazer o Deploy

Para o deploy, você pode simplesmente fazer o upload de todo o conteúdo deste diretório raiz (`genesix_project/`) para o seu repositório GitHub.

**Importante:** Certifique-se de configurar as variáveis de ambiente (`PORT`, `NODE_ENV`, `SECRET_KEY`, `FRONTEND_URL`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`) no seu ambiente de hospedagem (ex: Vercel, Netlify, Heroku, AWS, etc.) para que o backend possa se conectar ao banco de dados e o frontend possa se comunicar corretamente.

O frontend foi configurado para buscar a API em um caminho relativo (`/api`), o que é ideal para deploy em plataformas que suportam proxy reverso ou para quando o frontend e o backend são servidos pelo mesmo domínio.

---
*Este arquivo foi gerado automaticamente como parte do processo de unificação do código-fonte.*
