import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { App } from './app';
import { routes } from './app.routes';
import { AppShell } from './core/layout/app-shell/app-shell';

describe('Internal Enterprise Announcements shell', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('creates the application root', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('redirects the default route to the admin dashboard', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/');

    expect(TestBed.inject(Router).url).toBe('/admin/dashboard');
    expect(harness.routeNativeElement?.textContent).toContain('Admin Dashboard');
  });

  it('switches from the admin workspace to the employee workspace', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/admin/dashboard');

    const shell = harness.routeDebugElement?.componentInstance as AppShell;
    shell.switchRole('EMPLOYEE');
    await harness.fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/employee/announcements');
  });

  it('renders the not-found state inside the shell', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/missing-page');

    expect(harness.routeNativeElement?.textContent).toContain('Page Not Found');
  });
});
