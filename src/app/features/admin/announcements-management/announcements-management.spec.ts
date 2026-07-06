import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AnnouncementsManagement } from './announcements-management';

describe('AnnouncementsManagement', () => {
  let fixture: ComponentFixture<AnnouncementsManagement>;
  let component: AnnouncementsManagement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementsManagement],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(AnnouncementsManagement);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders announcement rows from the service', () => {
    expect(component.dataSource.data).toHaveLength(10);
    expect(fixture.nativeElement.querySelectorAll('tbody tr')).toHaveLength(5);
    expect(fixture.nativeElement.textContent).toContain('Severe weather office closure');
  });

  it('reduces visible data when search and filters change', () => {
    component.searchControl.setValue('benefits enrollment');
    fixture.detectChanges();

    expect(component.dataSource.data).toHaveLength(1);
    expect(component.dataSource.data[0].id).toBe('ann-1003');

    component.statusControl.setValue('LIVE');
    fixture.detectChanges();
    expect(component.dataSource.data).toHaveLength(0);
  });
});
