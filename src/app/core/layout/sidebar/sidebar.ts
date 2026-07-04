import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

import { PortalRole } from '../portal-role';

interface NavigationItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [MatIconModule, MatListModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input({ required: true }) role: PortalRole = 'ADMIN';
  @Output() readonly navigated = new EventEmitter<void>();

  readonly adminNavigation: NavigationItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/admin/dashboard' },
    { label: 'Announcements', icon: 'campaign', route: '/admin/announcements' },
    { label: 'New Announcement', icon: 'edit_note', route: '/admin/announcements/new' },
    { label: 'Employee Preview', icon: 'visibility', route: '/employee/announcements' },
  ];

  readonly employeeNavigation: NavigationItem[] = [
    { label: 'Announcements', icon: 'notifications', route: '/employee/announcements' },
  ];

  constructor(private readonly router: Router) {}

  get navigationItems(): NavigationItem[] {
    return this.role === 'ADMIN' ? this.adminNavigation : this.employeeNavigation;
  }

  isActive(item: NavigationItem): boolean {
    if (item.route === '/admin/announcements/new') {
      return this.router.url === item.route;
    }

    if (item.route === '/admin/announcements') {
      return this.router.url.startsWith(item.route) && this.router.url !== '/admin/announcements/new';
    }

    if (item.route === '/employee/announcements') {
      return this.router.url.startsWith(item.route);
    }

    return this.router.url === item.route;
  }
}
