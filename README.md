# Sistematize Estetica Premium

Landing page com wizard de onboarding para clinicas de estetica de alto padrao, captacao de dados operacionais, servicos, equipe, midia e tecnologia. O fluxo foi reestruturado para producao com backend Node.js, persistencia no Supabase e envio automatico via Evolution API.

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
- `ONBOARDING_REPORT_GROUP_JID`
- `MAX_FILE_SIZE_BYTES`

`EVOLUTION_INSTANCE_NAME` define a conta/instancia Evolution usada como canal de envio. `ONBOARDING_REPORT_GROUP_JID` define o grupo que recebe os relatorios; se nao estiver configurado, o backend usa o WhatsApp comercial preenchido no formulario como fallback. O backend envia somente uma planilha `.xlsx` organizada com dados, servicos e imagens separadas por abas.

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
