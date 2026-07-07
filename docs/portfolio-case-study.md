# Internal Enterprise Announcements System Case Study Draft

## Overview

The Internal Enterprise Announcements System is an Angular-based internal communications workflow MVP. It models how an organization could create, target, publish, display, and track employee-facing announcements through a structured admin and employee portal.

## Problem

Enterprise communications can become fragmented across email, chat, intranet posts, and manager updates. Important messages may need targeting, scheduling, banner visibility, acknowledgement, and audit context. This project explores how those workflow needs can be translated into a clean, portfolio-sized Angular application.

## Users

- Admin / Communications Manager: creates, edits, filters, reviews, and tracks announcement records.
- Employee: views targeted active announcements, reads details, dismisses eligible messages, and acknowledges required communications.

## My Role

I defined the MVP scope, data model, business rules, route structure, UI flows, Angular Material interface, validation behavior, service architecture, and portfolio packaging.

## Tech Stack

- Angular 22
- TypeScript
- Angular Material
- Angular CDK
- RxJS
- SCSS
- Vitest
- SQL-shaped mock data

## Core Features

- Responsive admin/employee application shell
- Admin dashboard summary
- Searchable/filterable announcement management table
- Create/edit announcement form with reactive validation
- Live employee preview panel
- Admin announcement detail view
- Lightweight version-history timeline
- Employee announcement feed
- Critical banner and acknowledgement workflow
- Read and dismiss actions through mock status services

## Key Technical Decisions

- Used Angular standalone components and lazy-loaded routes to keep feature areas separated.
- Kept mock data SQL-shaped so the frontend can be explained as a future API/database-backed system.
- Put eligibility, banner, filtering, and status rules in services rather than hardcoding them into templates.
- Used Angular Material for accessible enterprise UI patterns while avoiding template dependency creep.
- Deferred backend, auth, rich text, attachments, notifications, and real analytics to prevent scope creep.

## Business Value

The project demonstrates how business communication rules can become a structured digital workflow. It shows targeted publishing, lifecycle visibility, admin review context, employee acknowledgement, and audit-friendly change history without pretending to be a production platform.

## MVP Constraints

This MVP uses mock services and in-memory state. It does not include production authentication, backend persistence, real notifications, file attachments, analytics, or a rich text editor.

## Future Improvements

- Add a REST API and PostgreSQL database
- Add authenticated admin and employee roles
- Add durable audit logging
- Add notification delivery channels
- Add richer approval workflow rules
- Add deployment and environment configuration

## GitHub / Portfolio Positioning

Position this project as an Angular enterprise frontend workflow build that supports a Business-Technologist portfolio. It complements the full-stack Insurance Claims Management Portal by showing Angular, TypeScript, enterprise UX patterns, service-layer business rules, and SQL-aware systems thinking.
