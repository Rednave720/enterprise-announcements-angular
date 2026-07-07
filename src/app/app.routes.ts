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
        loadComponent: () => import('./features/admin/announcement-form/announcement-form')
          .then((module) => module.AnnouncementForm),
      },
      {
        path: 'admin/announcements/:id/edit',
        loadComponent: () => import('./features/admin/announcement-form/announcement-form')
          .then((module) => module.AnnouncementForm),
      },
      {
        path: 'admin/announcements/:id/history',
        loadComponent: () => import('./features/admin/version-history/version-history')
          .then((module) => module.VersionHistoryPage),
      },
      {
        path: 'admin/announcements/:id',
        loadComponent: () => import('./features/admin/announcement-detail/announcement-detail')
          .then((module) => module.AnnouncementDetail),
      },
      {
        path: 'employee/announcements',
        loadComponent: () => import('./features/employee/announcements-feed/announcements-feed')
          .then((module) => module.AnnouncementsFeed),
      },
      {
        path: 'employee/announcements/:id',
        loadComponent: () => import('./features/employee/announcement-detail/employee-announcement-detail')
          .then((module) => module.EmployeeAnnouncementDetail),
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
