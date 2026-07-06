import { Routes } from '@angular/router';

import { AppShell } from './core/layout/app-shell/app-shell';
import { PlaceholderPage } from './shared/components/placeholder-page/placeholder-page';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'admin/dashboard' },
      {
        path: 'admin/dashboard',
        loadComponent: () => import('./features/admin/dashboard/admin-dashboard')
          .then((module) => module.AdminDashboard),
      },
      {
        path: 'admin/announcements',
        loadComponent: () => import('./features/admin/announcements-management/announcements-management')
          .then((module) => module.AnnouncementsManagement),
      },
      {
        path: 'admin/announcements/new',
        component: PlaceholderPage,
        data: {
          section: 'Announcement management',
          title: 'Create Announcement',
          description: 'Prepare a targeted internal announcement for review or publication.',
          icon: 'edit_note',
          placeholder: 'The reactive create and edit workflow arrives in Phase 4.',
        },
      },
      {
        path: 'admin/announcements/:id/edit',
        component: PlaceholderPage,
        data: {
          section: 'Announcement management',
          title: 'Edit Announcement',
          description: 'Update announcement content, audience, schedule, and display settings.',
          icon: 'edit',
          placeholder: 'The reactive create and edit workflow arrives in Phase 4.',
        },
      },
      {
        path: 'admin/announcements/:id/history',
        component: PlaceholderPage,
        data: {
          section: 'Audit history',
          title: 'Version History',
          description: 'Review a lightweight record of announcement changes.',
          icon: 'history',
          placeholder: 'Version snapshots and change notes arrive after the admin workflow is established.',
        },
      },
      {
        path: 'admin/announcements/:id',
        component: PlaceholderPage,
        data: {
          section: 'Announcement management',
          title: 'Announcement Detail',
          description: 'Review content, audience, publishing configuration, and employee presentation.',
          icon: 'article',
          placeholder: 'Announcement detail and employee preview arrive in Phase 4.',
        },
      },
      {
        path: 'employee/announcements',
        component: PlaceholderPage,
        data: {
          section: 'Employee portal',
          title: 'Employee Announcements',
          description: 'View active internal communications that are relevant to the current employee.',
          icon: 'notifications',
          placeholder: 'The targeted employee feed and critical banner arrive in Phase 5.',
        },
      },
      {
        path: 'employee/announcements/:id',
        component: PlaceholderPage,
        data: {
          section: 'Employee portal',
          title: 'Announcement Detail',
          description: 'Read announcement content and complete any required acknowledgement.',
          icon: 'mark_email_read',
          placeholder: 'Employee read, dismiss, and acknowledgement states arrive in Phase 5.',
        },
      },
      {
        path: '**',
        component: PlaceholderPage,
        data: {
          section: 'Navigation',
          title: 'Page Not Found',
          description: 'The requested portal page does not exist.',
          icon: 'search_off',
          placeholder: 'Use the sidebar navigation to return to an available workspace.',
          notFound: true,
        },
      },
    ],
  },
];
