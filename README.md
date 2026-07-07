# Internal Enterprise Announcements System

An Angular-based internal communications workflow application designed to demonstrate enterprise frontend architecture, targeted publishing, lifecycle management, employee acknowledgement, and SQL-aware systems thinking.

This is a portfolio MVP, not a production communications platform. It intentionally uses typed mock services instead of a backend so the project can focus on business workflow modeling, Angular Material implementation, route-based admin/employee experiences, and clean presentation.

## Why This Project Matters

Large organizations need structured ways to create, target, publish, and track internal communications. A simple announcement can involve business rules: who should see it, when it should go live, whether it needs acknowledgement, and how administrators review prior edits. This project models that workflow in a portfolio-sized way while showing how enterprise frontend applications separate admin operations from employee-facing experiences.

## Business Problem

Internal communication often becomes scattered across email, intranet pages, chat tools, and informal manager updates. This MVP explores a more structured workflow:

- communications managers create and manage announcements
- targeted employees see only relevant active announcements
- critical messages can be promoted into a banner
- acknowledgement-required messages can be tracked through a lightweight status model
- admins can review metadata and version history for audit context

## Roles

### Admin / Communications Manager

Admins create, edit, review, filter, and manage announcement records. Their experience focuses on operational visibility, content governance, targeting, schedule controls, display settings, and audit context.

### Employee

Employees view active announcements targeted to their mock profile. Their experience focuses on scanning current messages, reading details, dismissing eligible items, and acknowledging required communications.

## Core Workflows

- Admin dashboard summary and recently updated announcements
- Announcement management table with search, filters, and pagination
- Create/edit announcement form with reactive validation
- Live employee-preview panel during authoring
- Admin read-only announcement detail page
- Lightweight version-history timeline
- Employee announcement feed with priority/type filters
- Critical banner and acknowledgement workflow
- Employee read and dismiss behavior

## Feature List

- Responsive Angular Material shell with admin and employee workspaces
- Mock role switching between Admin and Employee modes
- SQL-shaped announcement, audience, user-status, user, and version-history models
- Observable service layer for all UI data access
- Status, priority, and type label components
- Audience targeting summaries
- Reactive form validation for authoring rules
- Service-backed create/update behavior
- Employee eligibility and banner rules in the service layer
- Final screenshot-ready admin and employee screens

## Architecture

The project uses standalone Angular components, route-level lazy loading, typed services, and reusable shared UI components. Components consume service observables rather than importing mock arrays directly.

Key frontend areas:

- `src/app/core/layout` - responsive shell, sidebar, topbar, and role switching
- `src/app/core/data` - mock seed data shaped like relational records
- `src/app/core/services` - mock user and reference data services
- `src/app/features/announcements` - typed models and business services
- `src/app/features/admin` - dashboard, table, form, detail, and version history
- `src/app/features/employee` - feed and employee detail workflow
- `src/app/shared/components` - page header, empty state, and label components

## SQL-First Data Design

Although this MVP does not include a database, the mock data is intentionally shaped like tables:

- `Announcement`
- `Audience`
- `UserAnnouncementStatus`
- `VersionHistory`
- `MockUser`
- reference tables for departments, roles, locations, and user groups

This keeps the frontend easy to explain in interviews because the mock service layer could later map cleanly to REST APIs and relational tables.

## Mock-Data Strategy

The app uses professional demo data only. Mock records are designed to show realistic internal communications scenarios such as severe weather closure, information security policy acknowledgement, benefits reminders, IT maintenance, and manager training.

The mock services demonstrate:

- filtering and lifecycle rules
- employee eligibility rules
- banner visibility rules
- read, dismiss, and acknowledgement state
- lightweight version history

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

## Screenshot Walkthrough

Final screenshots are stored under `docs/screenshots/`.

1. `01-admin-dashboard.png` - admin workload summary and recently updated announcements
2. `02-announcements-management-table.png` - searchable/filterable announcement management table
3. `03-create-announcement-form.png` - admin authoring workflow and form sections
4. `04-announcement-preview.png` - live employee-facing preview during authoring
5. `05-admin-announcement-detail.png` - read-only admin detail with metadata and display settings
6. `06-version-history.png` - lightweight change history timeline
7. `07-employee-announcements-feed.png` - targeted employee feed
8. `08-critical-banner-acknowledgement.png` - critical banner and acknowledgement treatment
9. `09-employee-announcement-detail.png` - employee detail/read/acknowledge experience
10. `10-mobile-employee-feed.png` - mobile employee feed layout

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

Install and run:

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

## MVP Limitations

The MVP does not include:

- Production authentication or advanced permissions
- Real backend or PostgreSQL implementation
- MongoDB
- Cloud deployment
- Email, SMS, or push notifications
- Real analytics or charts
- Rich text editing
- File attachments
- Comments, likes, reactions, or social features
- Complex approval workflows
- Template-provided dashboards or sample business domains

## Future Backend Extension

A future technical extension could add a Spring Boot or NestJS REST API, PostgreSQL persistence, authentication, role-based access control, audit logging, and deployment. Those items are intentionally excluded from the current MVP to keep the portfolio project focused and finishable.

## Portfolio Positioning

This project supports Bryan Pierre's positioning as a Digital Systems Analyst / Business-Technologist focused on business systems, digital transformation, enterprise workflows, product thinking, UX awareness, analytics, and technical execution.

It complements the Insurance Claims Management Portal by showing Angular, TypeScript, enterprise frontend structure, workflow modeling, and SQL-aware data planning without turning into another full-stack backend project.
