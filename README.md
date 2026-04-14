# MeuBolso - Controle Financeiro Pessoal

Projeto inicial de um site para controle financeiro pessoal.

## Estrutura do projeto

- `backend/` - API Node.js com Express e Knex (suporta SQLite, PostgreSQL e MySQL)
- `frontend/` - Aplicação React com Vite

## Funcionalidades iniciais

- Cadastro de transações (despesas e receitas)
- Categorias gerenciáveis
- Metas financeiras com acompanhamento de progresso
- Visualização mensal de saldo e transações
- Dashboard simples com indicadores e gráficos

## Instruções de uso

1. Backend

```bash
cd backend
npm install
npm run dev
```

2. Frontend

```bash
cd frontend
npm install
npm run dev
```

A aplicação frontend usa a variável de ambiente `VITE_API_URL` para localizar a API.
Por padrão, ela usa `http://localhost:4000/api` quando não houver variável configurada.

### Configuração do backend remoto

- Para rodar com banco remoto, copie `backend/.env.example` para `backend/.env`.
- Defina `DB_CLIENT=pg` para PostgreSQL ou `DB_CLIENT=mysql2` para MySQL.
- Use `DATABASE_URL` ou as variáveis separadas `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`.
- O backend agora inicializa tabelas automaticamente quando o banco estiver vazio.

### Deploy no Vercel

- Para publicar apenas o frontend, crie um projeto Vercel apontando para a pasta `frontend`.
- Use `npm run build` como comando de build e `dist` como diretório de saída.
- No Vercel, adicione uma variável `VITE_API_URL` apontando para o URL do backend em produção.

> Observação: este backend usa SQLite local (`backend/db/finance.db`). O Vercel não é ideal para hospedar um backend com banco de dados local, porque os arquivos são efêmeros.
> Para o backend, prefira um serviço como Render, Railway ou Fly que suporte persistência de arquivos ou migre para um banco de dados remoto.

## Rotas de exemplo

- `GET /api/transactions` - Lista todas as transações
- `GET /api/transactions/monthly/:year/:month` - Lista transações por mês
- `POST /api/transactions` - Cria uma transação
- `GET /api/categories` - Lista categorias
- `POST /api/categories` - Cria categoria
- `GET /api/goals` - Lista metas financeiras
- `POST /api/goals` - Cria meta
