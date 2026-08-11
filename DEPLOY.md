# Guia de Deploy - Jogos dos Servidores Público / Juína-MT 2026

Este documento fornece instruções passo a passo para fazer deploy da aplicação no GitHub e Vercel.

## Pré-requisitos

Você precisará de:
- Conta no GitHub (https://github.com)
- Conta na Vercel (https://vercel.com)
- Git instalado localmente
- Node.js 18+ e pnpm instalados

## Passo 1: Preparar o Repositório GitHub

### 1.1 Criar um novo repositório no GitHub

1. Acesse https://github.com/new
2. Preencha os dados:
   - **Repository name**: `jogos-servidores-juina-2026`
   - **Description**: `Plataforma de inscrição para os Jogos dos Servidores Público / Juína-MT 2026`
   - **Visibility**: Public (recomendado) ou Private
3. Clique em "Create repository"

### 1.2 Fazer push do código para o GitHub

```bash
cd /home/ubuntu/jogos-servidores-juina-2026

# Adicionar o repositório remoto (substitua YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/jogos-servidores-juina-2026.git

# Fazer push do código
git branch -M main
git push -u origin main
```

## Passo 2: Configurar Variáveis de Ambiente

### 2.1 Variáveis necessárias para Vercel

As seguintes variáveis de ambiente devem ser configuradas na Vercel:

```
DATABASE_URL=postgresql://postgres.<project-ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true
JWT_SECRET=seu_jwt_secret_aleatorio
VITE_APP_ID=seu_app_id_manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_OPEN_ID=seu_owner_open_id
OWNER_NAME=seu_nome
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=sua_api_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=sua_frontend_api_key
VITE_ANALYTICS_ENDPOINT=seu_analytics_endpoint
VITE_ANALYTICS_WEBSITE_ID=seu_website_id
```

## Passo 3: Deploy na Vercel

### 3.1 Conectar o GitHub à Vercel

1. Acesse https://vercel.com/dashboard
2. Clique em "New Project"
3. Selecione "Import Git Repository"
4. Conecte sua conta GitHub se necessário
5. Selecione o repositório `jogos-servidores-juina-2026`

### 3.2 Configurar o projeto na Vercel

1. **Project Name**: `jogos-servidores-juina-2026`
2. **Framework Preset**: Node.js
3. **Root Directory**: `./` (deixar padrão)
4. **Build Command**: `pnpm run build`
5. **Output Directory**: `dist`
6. **Install Command**: `pnpm install`

### 3.3 Adicionar variáveis de ambiente

1. Na seção "Environment Variables", adicione todas as variáveis listadas acima
2. Certifique-se de que as variáveis estão disponíveis para "Production", "Preview" e "Development"

### 3.4 Deploy

1. Clique em "Deploy"
2. Aguarde a conclusão do build
3. Você receberá uma URL pública (ex: `https://jogos-servidores-juina-2026.vercel.app`)

## Passo 4: Configurar Banco de Dados (Supabase PostgreSQL)

O banco já está migrado para PostgreSQL. O projeto usa Drizzle ORM com driver `postgres-js`.

### 4.1 Obter a connection string no Supabase

1. Acesse o painel do Supabase > seu projeto > Settings > Database
2. Copie a **Connection string do pooler** (Transaction mode / port 6543)
3. No pooler, o usuário tem o formato `postgres.<project-ref>` e a senha deve ter `@` codificado como `%40`

### 4.2 Executar migrations (após mudanças no schema)

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## Passo 5: Testar a Aplicação

1. Acesse a URL do Vercel
2. Teste a página inicial
3. Teste o formulário de inscrição
4. Teste o painel administrativo (faça login com OAuth)

## Troubleshooting

### Build falha com erro de database

**Problema**: Build falha porque DATABASE_URL não está definida

**Solução**: Adicione a variável de ambiente `DATABASE_URL` na Vercel e redeploy

### Erro de autenticação OAuth

**Problema**: Erro ao tentar fazer login

**Solução**: Verifique se `VITE_APP_ID` e `OAUTH_SERVER_URL` estão corretos

### Inscrições não aparecem no painel admin

**Problema**: Painel admin mostra "Nenhuma inscrição encontrada"

**Solução**: Verifique se o usuário logado tem role `admin` no banco de dados

## Próximos Passos

1. Configure um domínio customizado na Vercel (Settings > Domains)
2. Configure SSL/TLS (automático na Vercel)
3. Configure backups automáticos do banco de dados
4. Configure monitoramento e alertas

## Suporte

Para mais informações sobre deploy na Vercel, consulte:
- https://vercel.com/docs
- https://vercel.com/docs/frameworks/nextjs

Para questões sobre o projeto, abra uma issue no GitHub.
