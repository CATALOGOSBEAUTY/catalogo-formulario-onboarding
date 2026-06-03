# Sistematize Branding Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the legacy BeautySync branding with the supplied Sistematize identity across the full landing page without changing the layout structure.

**Architecture:** Keep the existing React/Vite structure and swap the brand through a dedicated logo component plus palette updates in the shared UI primitives. The onboarding flow remains intact; only brand-bearing surfaces and visual accents change.

**Tech Stack:** React 19, TypeScript, Vite, Tailwind CSS v4, Vitest

---

### Task 1: Lock branding expectations with a render test

**Files:**
- Create: `tests/branding/layout-branding.test.tsx`

- [ ] Add a render test that asserts the header/footer expose `sistematize` branding and no longer render `BeautySync`.
- [ ] Run `npm test -- tests/branding/layout-branding.test.tsx` and verify it fails before the UI changes.

### Task 2: Introduce a faithful Sistematize brand component

**Files:**
- Create: `src/components/branding/SistematizeLogo.tsx`
- Modify: `src/modules/Header/index.tsx`
- Modify: `src/modules/Footer/index.tsx`

- [ ] Add a reusable logo component that matches the supplied symbol, gradient and wordmark treatment.
- [ ] Replace the old header/footer brand surfaces with the new component and updated copy.

### Task 3: Apply the Sistematize palette to the shell and shared UI

**Files:**
- Modify: `src/modules/Layout/index.tsx`
- Modify: `src/components/ui/Button.tsx`
- Modify: `src/components/ui/Input.tsx`
- Modify: `src/components/ui/Select.tsx`
- Modify: `src/components/ui/Textarea.tsx`
- Modify: `src/components/ui/Card.tsx`
- Modify: `src/index.css`

- [ ] Introduce brand color tokens and a subtle branded background treatment.
- [ ] Replace legacy `rose` states in shared UI components with the new palette.

### Task 4: Propagate the new brand accents through the onboarding wizard

**Files:**
- Modify: `src/modules/OnboardingForm/index.tsx`
- Modify: `src/modules/OnboardingForm/components/PersonalInfoForm.tsx`
- Modify: `src/modules/OnboardingForm/components/MediaTechForm.tsx`

- [ ] Update progress, action states and section highlights to align with the Sistematize identity.
- [ ] Preserve form flow and existing structure.

### Task 5: Verify end-to-end safety

**Files:**
- Verify only

- [ ] Run `npm test`.
- [ ] Run `npm run lint`.
- [ ] Run `npm run build`.
