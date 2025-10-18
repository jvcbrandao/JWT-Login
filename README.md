# 🔐 Login JWT - API de Autenticação com Node.js e Express

![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![Express](https://img.shields.io/badge/Express-5.1.0-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-informational)
![Knex](https://img.shields.io/badge/Knex.js-QueryBuilder-orange)
![License](https://img.shields.io/badge/License-MIT-lightgrey)

> API REST para autenticação de usuários utilizando **JWT (JSON Web Token)**, **bcrypt** para hash de senhas, e **PostgreSQL** via **Knex.js**.  
> Criada em Node.js com Express, estruturada para fácil manutenção e escalabilidade.

---

## 📚 Sumário

- [🚀 Tecnologias](#-tecnologias)
- [📦 Estrutura do Projeto](#-estrutura-do-projeto)
- [⚙️ Configuração do Ambiente](#️-configuração-do-ambiente)
- [🧠 Funcionalidades](#-funcionalidades)
- [🛠️ Instalação e Execução](#️-instalação-e-execução)
- [🌐 Rotas da API](#-rotas-da-api)
- [🗃️ Banco de Dados](#️-banco-de-dados)
- [🧩 Boas Práticas Implementadas](#-boas-práticas-implementadas)
- [🧪 Testes (sugestão futura)](#-testes-sugestão-futura)
- [📄 Licença](#-licença)

---

## 🚀 Tecnologias

- **Node.js** – ambiente de execução JavaScript
- **Express** – framework web minimalista
- **Knex.js** – query builder SQL
- **PostgreSQL** – banco de dados relacional
- **dotenv** – gerenciamento de variáveis de ambiente
- **bcrypt** – hash seguro de senhas
- **jsonwebtoken (JWT)** – autenticação baseada em token
- **cors** – controle de acesso entre origens
- **ESLint** – padronização e qualidade de código
- **Nodemon** – recarregamento automático em desenvolvimento

---

## 📦 Estrutura do Projeto

```
login-jwt/
│
├── src/
│   ├── routes/
│   │   └── routes.js        # Rotas e lógica de autenticação
│   └── server.js            # Configuração principal do servidor
│
├── knexfile.js              # Configuração do Knex (PostgreSQL)
├── .env                     # Variáveis de ambiente
├── .gitignore               # Arquivos ignorados pelo Git
├── eslint.config.mjs        # Regras de estilo e lint
├── package.json             # Dependências e scripts
└── README.md
```

---

## ⚙️ Configuração do Ambiente

Crie um arquivo **.env** na raiz do projeto e adicione suas variáveis de ambiente:

```bash
JWT_SECRET='sua_chave_super_secreta'
PORT=3000
DB_HOST=127.0.0.1
DB_USER=postgres
DB_PASS=sua_senha
DB_NAME=usuarios
```

> ⚠️ Nunca exponha seu `.env` em repositórios públicos!

---

## 🧠 Funcionalidades

✅ Cadastro de usuários (`/cadastrar`)  
✅ Login com autenticação JWT (`/login`)  
✅ Rota protegida que requer token (`/perfil`)  
✅ Middleware para validação do token  
✅ Senhas criptografadas com **bcrypt**  
✅ Configuração de CORS  
✅ Estrutura modular e organizada

---

## 🛠️ Instalação e Execução

### 1. Clone o repositório
```bash
git clone https://github.com/jvcbrandao/JWT-Login.git
cd JWT-Login
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure o banco de dados PostgreSQL
Crie um banco chamado `usuarios` (ou o nome definido no `.env`).

Exemplo (via psql):
```sql
CREATE DATABASE usuarios;
```

E uma tabela básica de usuários:
```sql
CREATE TABLE usuarios (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL
);
```

### 4. Inicie o servidor
```bash
npm start
```

Servidor rodará em:  
👉 http://localhost:3000/api

---

## 🌐 Rotas da API

### `GET /api/`
> Verifica se a API está funcionando

**Resposta:**
```json
"Funciona"
```

---

### `POST /api/cadastrar`
> Cria um novo usuário

**Body (JSON):**
```json
{
  "name": "João Vitor",
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta (201):**
```json
{
  "message": "Usuário cadastrado com sucesso!"
}
```

---

### `POST /api/login`
> Faz login e retorna o token JWT

**Body (JSON):**
```json
{
  "email": "joao@email.com",
  "password": "123456"
}
```

**Resposta (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR..."
}
```

---

### `GET /api/perfil`
> Rota protegida – requer autenticação JWT

**Headers:**
```
Authorization: Bearer <seu_token_aqui>
```

**Resposta (200):**
```json
{
  "message": "Se você está aqui, você está logado!",
  "user": {
    "id": 1
  }
}
```

---

## 🗃️ Banco de Dados

O projeto utiliza **Knex.js** para se conectar ao **PostgreSQL**.

Arquivo de configuração:
```js
const db = knex({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
  }
});
```

---

## 🧩 Boas Práticas Implementadas

✔️ Uso de variáveis de ambiente  
✔️ Hash de senha com bcrypt  
✔️ JWT com expiração de 1h  
✔️ Middleware para validação de token  
✔️ Estrutura modular (rotas separadas)  
✔️ ESLint configurado para padronização de código  
✔️ `.gitignore` protegido  
✔️ Comentários claros e código legível

---

## 🧪 Testes (sugestão futura)

Para fortalecer o projeto, adicione testes com **Jest** e **Supertest**:
```bash
npm install --save-dev jest supertest
```
Isso permite testar o fluxo de login, cadastro e rotas protegidas.

---

## 📄 Licença

Este projeto está licenciado sob a licença **MIT** — veja o arquivo [LICENSE](LICENSE) para detalhes.

---

### ✨ Autor

**João Vitor Brandão**  
📧 [GitHub](https://github.com/jvcbrandao)  
💼 Desenvolvedor Node.js | Pós-graduação em ADS focada em JavaScript  
🧠 “Aprender é praticar todos os dias.”
