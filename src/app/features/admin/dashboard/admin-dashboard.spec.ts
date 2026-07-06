import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AdminDashboard } from './admin-dashboard';

describe('AdminDashboard', () => {
  let fixture: ComponentFixture<AdminDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboard],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(AdminDashboard);
    fixture.detectChanges();
  });

  it('renders announcement summary counts from the service', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Total Announcements');
    expect(text).toContain('Pending Review');
    expect(text).toContain('Acknowledgement Required');
    expect(fixture.nativeElement.querySelectorAll('.metric-card')).toHaveLength(6);
  });

  it('renders recently updated announcements', () => {
    const rows = fixture.nativeElement.querySelectorAll('tbody tr');

    expect(rows).toHaveLength(5);
    expect(fixture.nativeElement.textContent).toContain('Benefits enrollment reminder');
  });
});
