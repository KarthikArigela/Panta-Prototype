# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Panta is a trucking insurance intake application built with Next.js 16. It implements a multi-stage conditional form that collects business information from trucking companies and maps the data to ACORD insurance forms (125, 127, 129). The form includes knockout logic to screen out uninsurable applicants early.

## Development Commands

```bash
npm run dev      # Start development server on localhost:3001
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Tech Stack

- **Next.js 16** with App Router
- **React 19** with hooks and functional components
- **TypeScript** (strict mode enabled)
- **Tailwind CSS 4** via PostCSS
- **ESLint 9** with Next.js core-web-vitals and TypeScript rules

## Architecture

### Form Flow (5 Stages)

The application is a single-page form (`src/app/page.tsx`) with 5 sequential stages:

1. **Knockout** - Screens applicants with revoked authority or unsatisfactory DOT ratings
2. **Basics** - Legal name, tax structure, tax ID, parking address
3. **Operations** - Hazmat, radius of operation, interstate commerce, fleet size
4. **Safety** - Safety programs, maintenance plans, MVR checks, family drivers
5. **Documents** - File uploads for loss runs, driver list, vehicle list

### Key Patterns

- **Knockout Logic**: The `useEffect` hook in `SmartIntake` monitors `authorityRevoked` and `safetyRatingUnsatisfactory` to immediately block progression
- **Stage Validation**: `canProceed()` function validates required fields per stage before enabling Continue button
- **ACORD Mapping**: `mapToACORD125()` and `mapToACORD127()` transform form data to insurance industry standard format

### Path Alias

TypeScript is configured with `@/*` mapping to `./src/*`

## Brand Colors (CSS Variables)

- Primary: `#0A3F2F` (Forest Green)
- Accent: `#22C55E` (Vibrant Green for CTAs)
- Secondary: `#D4C5A6` (Beige)
- Danger: `#ef4444` (Red for errors/knockout)

## Planned Features (ralph/prd.json)

The `ralph/` directory contains a PRD with 19 user stories for expanding the application:
- Zod validation schemas
- React Hook Form integration with localStorage persistence
- Additional form sections (vehicles, drivers, prior insurance, coverage preferences)
- PDF generation with pdf-lib for ACORD forms
- ZIP package generation with JSZip for complete submission packets
