import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AnnouncementsService } from '../../announcements/services/announcements.service';
import { UserAnnouncementStatusService } from '../../announcements/services/user-announcement-status.service';
import { EmployeeAnnouncementDetail } from './employee-announcement-detail';

describe('EmployeeAnnouncementDetail', () => {
  const setup = async (announcementId: string): Promise<ComponentFixture<EmployeeAnnouncementDetail>> => {
    await TestBed.configureTestingModule({
      imports: [EmployeeAnnouncementDetail],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: announcementId }) } },
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(EmployeeAnnouncementDetail);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    return fixture;
  };

  it('marks an unread eligible announcement as read when detail opens', async () => {
    const fixture = await setup('ann-1004');
    const statusService = TestBed.inject(UserAnnouncementStatusService);

    expect(fixture.nativeElement.textContent).toContain('Scheduled finance platform maintenance');
    expect(statusService.getUserStatusSnapshot('usr-1001', 'ann-1004')?.readAt).not.toBeNull();
  });

  it('records acknowledgement state for a required announcement', async () => {
    const fixture = await setup('ann-1001');
    const component = fixture.componentInstance;
    const announcementsService = TestBed.inject(AnnouncementsService);
    const statusService = TestBed.inject(UserAnnouncementStatusService);
    const announcement = await firstValueFrom(announcementsService.getAnnouncementById('ann-1001'));

    component.acknowledge(announcement!);
    fixture.detectChanges();

    expect(statusService.getUserStatusSnapshot('usr-1001', 'ann-1001')?.acknowledgedAt).not.toBeNull();
    expect(fixture.nativeElement.textContent).toContain('Acknowledgement complete');
  });

  it('dismisses a dismissible announcement and returns to the feed', async () => {
    const fixture = await setup('ann-1004');
    const component = fixture.componentInstance;
    const announcementsService = TestBed.inject(AnnouncementsService);
    const statusService = TestBed.inject(UserAnnouncementStatusService);
    const router = TestBed.inject(Router);
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    const announcement = await firstValueFrom(announcementsService.getAnnouncementById('ann-1004'));

    component.dismiss(announcement!);

    expect(statusService.getUserStatusSnapshot('usr-1001', 'ann-1004')?.doNotShowAgain).toBe(true);
    expect(navigateSpy).toHaveBeenCalledWith(['/employee/announcements']);
  });
});
