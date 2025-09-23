# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linting
npm run lint
```

## Architecture Overview

This is a Next.js 14 application with App Router that serves as a dynamic landing page system for multiple fundraising campaigns. The app uses dynamic routing to render different campaign pages based on the URL.

### Key Architectural Components

1. **Dynamic Campaign System**: The app uses Next.js dynamic routes (`app/[campaign]/page.tsx`) to render campaign-specific pages. Each campaign has its own URL path (e.g., `/quranbit`, `/community-pantry`).

2. **Campaign Data Structure**: All campaign configurations are stored in `content/mockCampaigns.ts` as TypeScript objects with the `MockCampaign` interface. This allows easy addition of new campaigns without modifying page components.

3. **Component Architecture**: 
   - UI components are built using shadcn/ui components stored in `components/ui/`
   - The app uses Radix UI primitives with Tailwind CSS for styling
   - Components follow a composable pattern with variants managed by class-variance-authority

4. **Styling System**: 
   - Tailwind CSS v4 with custom configuration
   - Custom CSS animations defined in `app/globals.css`
   - Geist font family for typography
   - Theme system with CSS variables for consistent colors

5. **Routing Flow**:
   - Root page (`/`) automatically redirects to `/quranbit`
   - Each campaign URL renders the same component template with different data
   - 404 handling for non-existent campaigns

### Important Configuration Notes

- TypeScript and ESLint errors are intentionally ignored during build (see `next.config.mjs`)
- Images are unoptimized for simplified deployment
- The app uses Vercel Analytics for tracking
- Path aliases configured: `@/*` maps to the root directory