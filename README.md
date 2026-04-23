# Catalogo e Formulario de Onboarding

Landing page com wizard de onboarding para captacao de dados operacionais, servicos, equipe, midia e tecnologia. O fluxo foi reestruturado para producao com backend Node.js, persistencia no Supabase e envio automatico via Evolution API.

## Arquitetura

- `src/`: frontend React/Vite com o layout original
- `server/`: backend Express para validacao, upload, persistencia e disparo do WhatsApp
- `supabase/schema.sql`: schema do banco
- `render.yaml`: definicao de deploy do novo servico Render

## Variaveis de ambiente

Copie `.env.example` para `.env.local` e preencha:

- `PORT`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_STORAGE_BUCKET`
- `EVOLUTION_API_URL`
- `EVOLUTION_API_KEY`
- `EVOLUTION_INSTANCE_NAME`
- `MAX_FILE_SIZE_BYTES`

O destino do WhatsApp e resolvido automaticamente pelo `ownerJid` da instancia configurada em `EVOLUTION_INSTANCE_NAME`. O backend nao usa numero manual para evitar envio para o destino errado.

## Desenvolvimento local

1. Instale dependencias:
   `npm install`
2. Inicie o backend:
   `npm run dev:server`
3. Em outro terminal, inicie o frontend:
   `npm run dev:client`
4. Abra `http://localhost:3000`

## Verificacao

- Typecheck:
  `npm run lint`
- Testes:
  `npm test`
- Build de producao:
  `npm run build`

## Publicacao

O deploy de producao usa um novo web service no Render apontando para este repositório GitHub. O backend serve o frontend buildado e expoe:

- `GET /health`
- `GET /api/health`
- `POST /api/onboarding-submissions`
