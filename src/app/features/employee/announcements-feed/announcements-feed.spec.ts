import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AnnouncementsService } from '../../announcements/services/announcements.service';
import { AnnouncementsFeed } from './announcements-feed';

describe('AnnouncementsFeed', () => {
  let fixture: ComponentFixture<AnnouncementsFeed>;
  let component: AnnouncementsFeed;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementsFeed],
      providers: [provideRouter([])],
    }).compileComponents();
    fixture = TestBed.createComponent(AnnouncementsFeed);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
  });

  it('renders only eligible announcements for the current mock user', () => {
    expect(fixture.nativeElement.querySelectorAll('.announcement-card')).toHaveLength(5);
    expect(fixture.nativeElement.textContent).toContain('Scheduled finance platform maintenance');
    expect(fixture.nativeElement.textContent).not.toContain('Updated hybrid work guidance');
  });

  it('renders an eligible critical banner', () => {
    const banner = fixture.nativeElement.querySelector('.critical-banner');

    expect(banner).not.toBeNull();
    expect(banner.textContent).toContain('Severe weather office closure');
    expect(banner.textContent).toContain('Acknowledge');
  });

  it('filters eligible announcements by priority and type', () => {
    component.priorityControl.setValue('CRITICAL');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.announcement-card')).toHaveLength(1);

    component.priorityControl.setValue('ALL');
    component.typeControl.setValue('SYSTEM_IT');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('.announcement-card')).toHaveLength(1);
    expect(fixture.nativeElement.textContent).toContain('Scheduled finance platform maintenance');
  });

  it('removes dismissed announcements from the eligible feed', async () => {
    const service = TestBed.inject(AnnouncementsService);
    const target = await firstValueFrom(service.getAnnouncementById('ann-1004'));

    component.dismiss(target!);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).not.toContain('Scheduled finance platform maintenance');
    expect(fixture.nativeElement.querySelectorAll('.announcement-card')).toHaveLength(4);
  });

  it('renders a filter empty state when no eligible announcements match', () => {
    component.typeControl.setValue('HR_BENEFITS');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('No announcements match your filters');
  });
});
