# Guia de Deploy - MeuBolso

## Passo 1: Preparar o repositório Git

```bash
cd c:\Users\aluno\Documents\MeuBolso

# Iniciar repositório (se não existir)
git init
git add .
git commit -m "Initial commit: Full MeuBolso app with remote DB support"

# Adicionar remote do GitHub
git remote add origin https://github.com/PauloLisboa7/MeuBolso.git

# Fazer push
git branch -M main
git push -u origin main
```

## Passo 2: Criar banco PostgreSQL no Railway

1. Acesse: https://railway.app
2. Faça login (ou crie conta com GitHub)
3. Clique em "New Project"
4. Selecione "Provision PostgreSQL"
5. Copie a string `DATABASE_URL` que aparecerá em "Variables"
6. Guarde essa URL - você vai usar ela no próximo passo

Exemplo de URL (não use essa):
```
postgresql://user:password@containers-us-west-12.railway.app:6543/railway
```

## Passo 3: Criar e configurar o backend no Railway

1. No mesmo projeto Railway, clique em "New Service"
2. Selecione "GitHub Repo"
3. Conecte sua conta GitHub
4. Escolha o repositório `MeuBolso`
5. Configure:
   - **Root Directory**: `backend`
   - **Start Command**: `npm start`

6. Vá em "Variables" e adicione:
   ```
   DB_CLIENT=pg
   DATABASE_URL=<cole a URL do PostgreSQL aqui>
   ```

7. Clique em "Deploy"
8. Aguarde ~2-3 minutos
9. Copie a URL gerada (algo como: `https://meubolso-production.up.railway.app`)

## Passo 4: Deploy do frontend no Vercel

1. Acesse: https://vercel.com
2. Faça login (ou crie conta com GitHub)
3. Clique em "Add New Project"
4. Selecione o repositório `MeuBolso`
5. Configure:
   - **Framework**: "Other"
   - **Root Directory**: `./frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Em "Environment Variables", adicione:
   ```
   VITE_API_URL=https://meubolso-production.up.railway.app/api
   ```
   (substitua pela URL do Railway do passo anterior)

7. Clique em "Deploy"
8. Aguarde ~1-2 minutos
9. Sua URL Vercel aparecerá (algo como: `https://meubolso.vercel.app`)

## Passo 5: Testar

1. Acesse `https://meubolso.vercel.app`
2. Tente criar uma transação
3. Atualize a página - a transação deve persistir na BD remota

## Resumo das URLs finais

- **Frontend**: `https://meubolso.vercel.app`
- **Backend**: `https://meubolso-production.up.railway.app`
- **BD PostgreSQL**: Hospedada no Railway

## Troubleshooting

Se não funcionar:
1. Verifique se o `DATABASE_URL` está correto no Railway
2. Verifique se o `VITE_API_URL` está correto no Vercel
3. Abra DevTools no navegador (F12) e veja se tem erro na aba "Network"
4. Verifique logs no Railway: Dashboard > Backend > Logs
5. Verifique logs no Vercel: Dashboard > Deployments > Logs

## Alternativa: Usar Render em vez de Railway

Se preferir Render.com:
1. Acesse https://render.com
2. Crie duas "Web Services":
   - Uma para o PostgreSQL (banco)
   - Uma para o backend (Node.js)
3. Conecte o repositório GitHub
4. Configure variáveis iguais aos passos acima
5. O processo é similar ao Railway
