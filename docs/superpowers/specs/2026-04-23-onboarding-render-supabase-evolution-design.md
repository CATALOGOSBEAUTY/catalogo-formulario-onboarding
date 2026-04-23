# Onboarding Render Supabase Evolution Design

## Objetivo

Colocar a landing/formulario de onboarding em producao sem alterar o layout atual, substituindo o fluxo baseado em `wa.me` por um fluxo server-side com persistencia em Supabase, upload de arquivos e disparo automatico via Evolution API.

## Escopo

- Manter a experiencia visual existente.
- Adicionar backend proprio no projeto para processar submissao do formulario.
- Persistir dados estruturados no Supabase.
- Fazer upload das imagens para o Supabase Storage.
- Enviar mensagem automatica para o WhatsApp da empresa usando uma instancia Evolution separada.
- Publicar em um novo servico Render.
- Criar um novo projeto Supabase e uma nova instancia Evolution no Azure, separados dos ambientes ativos.

## Fora de escopo

- Alteracoes cosméticas de layout.
- Painel administrativo para listar submissões.
- Fila assíncrona dedicada com worker separado.

## Arquitetura

O projeto sera convertido em um monolito Node.js simples:

1. O frontend React/Vite continua responsavel apenas pela UI e pelo envio do formulario.
2. Um backend Express passa a expor `POST /api/onboarding-submissions` para validar, armazenar e disparar a mensagem.
3. O backend usa `SUPABASE_SERVICE_ROLE_KEY` para:
   - inserir o registro principal,
   - inserir servicos/profissionais,
   - subir anexos no storage,
   - registrar o status do envio.
4. O backend usa `EVOLUTION_API_URL`, `EVOLUTION_API_KEY` e `EVOLUTION_INSTANCE_NAME` para disparar o WhatsApp automaticamente.
5. O mesmo servico Express tambem serve o frontend buildado em producao no Render.

## Modelo de dados

### `onboarding_submissions`

- `id uuid primary key`
- `full_name text`
- `cpf_cnpj text`
- `email text`
- `commercial_contact text`
- `address_zipcode text`
- `address_street text`
- `address_number text`
- `address_neighborhood text`
- `scheduling_model text`
- `cancellation_fine text`
- `reschedule_details text`
- `upfront_cost text`
- `has_domain boolean`
- `website_url text`
- `hosting_provider text`
- `whatsapp_status text`
- `whatsapp_error text null`
- `submitted_at timestamptz default now()`
- `created_at timestamptz default now()`
- `updated_at timestamptz default now()`

### `onboarding_services`

- `id uuid primary key`
- `submission_id uuid references onboarding_submissions(id) on delete cascade`
- `name text`
- `duration text`
- `value text`
- `position integer`

### `onboarding_professionals`

- `id uuid primary key`
- `submission_id uuid references onboarding_submissions(id) on delete cascade`
- `name text`
- `role text`
- `service_config text`
- `position integer`

### `onboarding_files`

- `id uuid primary key`
- `submission_id uuid references onboarding_submissions(id) on delete cascade`
- `category text`
- `file_name text`
- `storage_path text`
- `content_type text`
- `size_bytes bigint`
- `created_at timestamptz default now()`

## Storage

- Bucket privado: `onboarding-uploads`
- Caminho: `submissions/<submission-id>/<category>/<timestamp>-<safe-file-name>`
- Categorias: `procedures`, `facade`

## Fluxo de submissao

1. Usuario preenche o wizard e envia.
2. Frontend monta `FormData` com campos estruturados e arquivos.
3. Backend valida todos os campos obrigatorios e limites de arquivo.
4. Backend cria a submissao principal com status inicial `received`.
5. Backend sobe arquivos para o Storage e grava metadados.
6. Backend insere servicos e profissionais.
7. Backend monta a mensagem consolidada.
8. Backend envia para a Evolution.
9. Backend atualiza `whatsapp_status` para `sent` ou `failed`.
10. Frontend mostra sucesso real apenas se a persistencia completar; falha de WhatsApp nao perde dados.

## Regras de erro

- Falha de validacao: retorna `400`.
- Falha de upload ou banco: retorna `500` e registra log.
- Falha no WhatsApp: mantem dados persistidos e retorna `202` com aviso operacional, ou `200` com `warning`, dependendo do contrato final do handler.

## Seguranca

- Nenhuma chave sensivel no frontend.
- Backend e o unico a falar com Supabase service role e Evolution.
- Bucket privado.
- Validacao de tipo e tamanho de arquivo.
- Mensagens e logs sem expor segredos.

## Provisionamento

### Supabase

- Criar novo projeto separado.
- Aplicar schema SQL.
- Criar bucket `onboarding-uploads`.
- Capturar `project url`, `anon key`, `service role key`.

### Azure / Evolution

- Criar um novo App Service da Evolution separado do ambiente atual, ou reaproveitar o padrao funcional ja usado pelo usuario com nova aplicacao/infra associada.
- Criar nova instancia WhatsApp dedicada ao projeto.
- Registrar `EVOLUTION_API_URL`, `EVOLUTION_API_KEY`, `EVOLUTION_INSTANCE_NAME`.

### Render

- Criar novo web service.
- Apontar para este projeto.
- Configurar `build command` e `start command`.
- Configurar todas as envs do backend e do frontend.

## Validacao

- Teste automatizado para validacao do payload e montagem da mensagem.
- Teste automatizado do endpoint com dependencias mockadas.
- `npm run lint`
- `npm run test`
- `npm run build`
- Teste manual local com upload real.
- Teste manual publicado no Render verificando banco, storage e disparo na Evolution.
