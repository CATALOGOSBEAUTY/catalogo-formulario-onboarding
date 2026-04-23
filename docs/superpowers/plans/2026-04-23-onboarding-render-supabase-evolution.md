# Onboarding Render Supabase Evolution Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transformar a landing atual em um formulario de producao com backend, persistencia no Supabase, upload de arquivos, envio automatico via Evolution e deploy isolado no Render.

**Architecture:** O projeto sera um monolito Node.js/React. O frontend continua intacto visualmente, enquanto um backend Express assume validacao, storage, persistencia e envio para WhatsApp. O mesmo servico servira o build estatico em producao.

**Tech Stack:** React 19, Vite, TypeScript, Express, Supabase JS, Multer, Zod, Vitest, Supertest, Azure CLI, Render API, Supabase Management API

---

### Task 1: Preparar infraestrutura de codigo do backend

**Files:**
- Create: `server/index.ts`
- Create: `server/app.ts`
- Create: `server/config/env.ts`
- Create: `server/lib/supabase.ts`
- Modify: `package.json`
- Modify: `tsconfig.json`

- [ ] Adicionar dependencias e scripts de backend/teste.
- [ ] Criar bootstrap do Express com healthcheck e serve de arquivos estaticos.
- [ ] Configurar leitura e validacao de envs.
- [ ] Criar cliente server-side do Supabase.

### Task 2: Cobrir o fluxo com testes vermelhos

**Files:**
- Create: `tests/onboarding/formatter.test.ts`
- Create: `tests/onboarding/validation.test.ts`
- Create: `tests/onboarding/route.test.ts`

- [ ] Escrever teste da mensagem WhatsApp esperada para um payload completo.
- [ ] Escrever teste de validacao para payload obrigatorio.
- [ ] Escrever teste do endpoint `POST /api/onboarding-submissions`.
- [ ] Rodar os testes e confirmar falha inicial.

### Task 3: Implementar dominio do onboarding

**Files:**
- Create: `server/modules/onboarding/types.ts`
- Create: `server/modules/onboarding/validation.ts`
- Create: `server/modules/onboarding/message.ts`
- Create: `server/modules/onboarding/service.ts`
- Create: `server/modules/onboarding/routes.ts`

- [ ] Definir tipos normalizados do onboarding.
- [ ] Implementar validacao de campos e arquivos.
- [ ] Implementar formatador da mensagem WhatsApp.
- [ ] Implementar servico de persistencia e envio.
- [ ] Expor rota Express do modulo.

### Task 4: Adaptar o frontend sem mudar layout

**Files:**
- Modify: `src/modules/OnboardingForm/index.tsx`
- Modify: `src/modules/OnboardingForm/types.ts`
- Create: `src/modules/OnboardingForm/api.ts`

- [ ] Remover dependencia de `wa.me`.
- [ ] Enviar `FormData` para o backend.
- [ ] Tratar loading, erro e sucesso mantendo a interface atual.
- [ ] Preservar todos os blocos visuais existentes.

### Task 5: Provisionamento de banco e storage

**Files:**
- Create: `supabase/schema.sql`
- Modify: `.env.example`
- Modify: `README.md`

- [ ] Gerar SQL do schema do novo projeto.
- [ ] Documentar envs obrigatorias.
- [ ] Criar bucket e estrutura de storage no novo projeto Supabase.

### Task 6: Provisionamento cloud

**Files:**
- Create: `render.yaml`
- Create: `scripts/provision-supabase.ps1`
- Create: `scripts/provision-render.ps1`
- Create: `scripts/provision-azure-evolution.ps1`

- [ ] Automatizar consulta/criacao do novo projeto Supabase.
- [ ] Automatizar criacao do novo web service Render.
- [ ] Automatizar provisionamento da nova Evolution no Azure.
- [ ] Documentar os IDs/URLs resultantes.

### Task 7: Verificacao final

**Files:**
- Modify: `README.md`

- [ ] Rodar `npm run test`.
- [ ] Rodar `npm run lint`.
- [ ] Rodar `npm run build`.
- [ ] Executar teste manual local com upload.
- [ ] Publicar no novo Render.
- [ ] Validar healthcheck, banco, storage e envio WhatsApp.
