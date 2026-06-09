# Marketing AI Orchestrator

Campaign optimization, multi-channel analytics, content strategy, and ROI attribution for premium marketing operations.

## Overview

A strategic marketing intelligence dashboard that orchestrates multi-channel campaigns, analyzes performance across email, social, search, display, and content marketing channels, and provides AI-powered content scoring and generation.

Built with Next.js 15, React 19, TypeScript, and Tailwind CSS. Demo data simulates 8 active campaigns across 5 marketing channels with complete attribution modeling, content asset scoring, and AI-generated content previews.

## Features

- **Campaign Performance Grid** -- 8 active campaigns with real-time ROAS badges, budget utilization tracking, and conversion rate monitoring
- **Multi-Channel Attribution** -- Data-driven and time-decay attribution models showing revenue distribution across 5 channels
- **Content Asset Library** -- 15 content assets with AI quality scores (78-96), performance metrics, and status tracking
- **AI-Generated Content Previews** -- 5 AI-generated content pieces with keyword extraction, sentiment analysis, and quality scoring
- **Marketing Calendar** -- Visual roadmap showing campaign timelines and progress for all active initiatives
- **Hero Stats** -- At-a-glance metrics: active campaigns, total spend, overall ROAS, and average conversion rate

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: React 19, Tailwind CSS
- **Language**: TypeScript
- **Testing**: Vitest
- **Linting**: ESLint (Next.js config)

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run test` | Run Vitest test suite |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking |

## Project Structure

```
src/
  app/
    layout.tsx          # Root layout with metadata
    page.tsx            # Main dashboard page
    globals.css         # Global styles
  components/
    ui.tsx              # Reusable UI components (Badge, Card, ProgressBar, StatCard, StatusDot)
  lib/
    types.ts            # TypeScript type definitions
    demo-data.ts        # Demo data and computeMetrics function
tests/
  marketing.test.ts     # 10 Vitest test suites
```
