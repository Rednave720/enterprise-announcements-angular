# Internal Enterprise Announcements System

## Project Overview

The Internal Enterprise Announcements System is an Angular portfolio project that models how an organization could create, target, publish, and display internal communications. It is designed as a professional internal portal rather than a social feed or marketing site.

This project complements the Insurance Claims Management Portal by emphasizing Angular, TypeScript, Angular Material, enterprise frontend architecture, workflow design, and SQL-aware data planning.

## Portfolio Positioning

The project supports Bryan Pierre's positioning as a Digital Systems Analyst / Business-Technologist focused on business systems, digital transformation, enterprise workflows, product thinking, UX awareness, analytics, and technical execution.

## Phase Status

Phase 1 established the frontend foundation:

- Angular standalone application
- TypeScript and SCSS
- Angular Material and CDK
- Responsive admin/employee application shell
- Route-based workspace separation
- Mock Admin/Employee role switching
- Shared page-header and placeholder-page components
- Custom Material theme and local design tokens
- Basic route and shell tests

Phase 2 added the data and service foundation:

- SQL-shaped announcement, audience, user-status, version-history, user, and reference-data models
- Ten professional mock announcements spanning the planned statuses, priorities, and types
- Audience targeting with OR logic within dimensions and AND logic across dimensions
- Observable announcement, audience, user-status, mock-user, and reference-data services
- Employee eligibility, banner visibility, dashboard summary, filtering, and lifecycle transition rules
- Focused business-rule tests

Phase 3 adds the first operational admin screens:

- Responsive 3x2 dashboard summary sourced from the announcement service
- Recently updated announcements table
- Searchable and filterable announcement management table
- Client-side pagination and responsive table scrolling
- Distinct status, priority, and type labels
- Audience descriptions built from typed targeting and reference data
- Route-level lazy loading for the Material-heavy admin screens

Phase 4 adds the admin authoring workflow:

- Shared reactive form for create and edit routes
- Content, audience, schedule, and display-setting sections
- Conditional banner, scheduling, date-range, and display-location validation
- Live employee announcement preview
- Service-backed announcement and audience saves
- Lightweight read-only detail page with coherent Edit navigation

Phase 5 adds the employee-facing experience:

- Targeted employee announcement feed sourced from service eligibility rules
- Critical/pinned banner area for urgent or acknowledgement-required messages
- Priority and type filters with clear empty states
- Employee announcement detail view
- Read, dismiss, and acknowledgement actions stored through the user-status service
- Route-level lazy loading for employee screens

Version-history UI, backend integration, and persistence remain intentionally deferred.

## Tech Stack

- Angular 22
- TypeScript 6
- Angular Material
- Angular CDK
- RxJS
- SCSS
- Vitest
- npm

## Routes

### Admin

- `/admin/dashboard`
- `/admin/announcements`
- `/admin/announcements/new`
- `/admin/announcements/:id`
- `/admin/announcements/:id/edit`
- `/admin/announcements/:id/history`

### Employee

- `/employee/announcements`
- `/employee/announcements/:id`

The root route redirects to `/admin/dashboard`. Unknown routes display a not-found state inside the shared portal shell.

## Visual Direction

The shell uses Angular Material patterns inspired by [ng-matero](https://github.com/ng-matero/ng-matero), while restrained card and surface styling takes secondary inspiration from [Modernize Angular Free](https://github.com/adminmart/modernize-angular-free).

Neither template is installed, copied, or used as the application foundation. Template branding, sample pages, authentication, permissions, internationalization, dark mode, charts, and unrelated widgets are excluded.

## Material Icons

The application uses Angular Material's `mat-icon` component with the official Material Icons font stylesheet loaded from Google Fonts in `src/index.html`. No external icon package is installed.

## Local Setup

Use Node 24 LTS. The repository includes an `.nvmrc` file for version managers. Angular 22 officially supports Node 26, but the Homebrew Node runtimes available during Phase 1 aborted Angular production builds at process level. The official Node 24.18 distribution installed through `fnm` completed the same build reliably.

With `fnm`:

```bash
eval "$(fnm env --shell zsh)"
fnm install
fnm use
```

```bash
npm install
npm start
```

Open [http://localhost:4200](http://localhost:4200).

## Validation

```bash
npm run build
npm test -- --watch=false
```

## MVP Exclusions

The MVP does not include:

- Production authentication or advanced permissions
- Real backend or PostgreSQL implementation
- MongoDB
- Cloud deployment
- Email, SMS, or push notifications
- Real analytics or charts
- Rich text editing
- File attachments
- Complex approval workflows
- Template-provided dashboards or sample business domains

## Next Phase

Phase 6 can polish the admin detail/version-history experience, tighten final screenshots, and prepare the project README/case-study materials before considering any backend integration.
