import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, ViewChild, inject } from '@angular/core';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map, startWith } from 'rxjs';

import { PortalRole } from '../portal-role';
import { Sidebar } from '../sidebar/sidebar';
import { Topbar } from '../topbar/topbar';

@Component({
  selector: 'app-shell',
  imports: [MatSidenavModule, RouterOutlet, Sidebar, Topbar],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
})
export class AppShell {
  @ViewChild('drawer') private drawer?: MatSidenav;

  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);

  readonly isHandset = toSignal(
    this.breakpointObserver.observe('(max-width: 767px)').pipe(map(result => result.matches)),
    { initialValue: false },
  );

  readonly role = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      startWith(null),
      map((): PortalRole => this.router.url.startsWith('/employee') ? 'EMPLOYEE' : 'ADMIN'),
    ),
    { initialValue: this.roleFromUrl() },
  );

  toggleDrawer(): void {
    this.drawer?.toggle();
  }

  closeMobileDrawer(): void {
    if (this.isHandset()) {
      this.drawer?.close();
    }
  }

  switchRole(role: PortalRole): void {
    const destination = role === 'ADMIN' ? '/admin/dashboard' : '/employee/announcements';
    void this.router.navigateByUrl(destination);
    this.closeMobileDrawer();
  }

  private roleFromUrl(): PortalRole {
    return this.router.url.startsWith('/employee') ? 'EMPLOYEE' : 'ADMIN';
  }
}
