import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AnnouncementsService } from './announcements.service';
import { UserAnnouncementStatusService } from './user-announcement-status.service';

describe('AnnouncementsService', () => {
  let service: AnnouncementsService;
  let userStatusService: UserAnnouncementStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AnnouncementsService);
    userStatusService = TestBed.inject(UserAnnouncementStatusService);
  });

  it('calculates the admin dashboard summary from announcement records', async () => {
    const summary = await firstValueFrom(service.getAdminDashboardSummary());

    expect(summary).toEqual({
      total: 10,
      draft: 1,
      pendingReview: 1,
      scheduled: 2,
      live: 5,
      archived: 1,
      acknowledgementRequired: 2,
    });
  });

  it('returns only live, current, audience-matched employee announcements', async () => {
    const announcements = await firstValueFrom(service.getAnnouncementsForUser('usr-1001'));

    expect(announcements.map((announcement) => announcement.id)).toEqual([
      'ann-1001', 'ann-1002', 'ann-1004', 'ann-1007', 'ann-1008',
    ]);
  });

  it('returns critical eligible banners until required acknowledgement is recorded', async () => {
    const before = await firstValueFrom(service.getBannerAnnouncementsForUser('usr-1001'));
    expect(before.map((announcement) => announcement.id)).toEqual(['ann-1001']);

    await firstValueFrom(userStatusService.acknowledgeAnnouncement('usr-1001', 'ann-1001'));
    const after = await firstValueFrom(service.getBannerAnnouncementsForUser('usr-1001'));
    expect(after).toEqual([]);
  });

  it('enforces announcement status transitions', async () => {
    const transitioned = await firstValueFrom(service.transitionStatus('ann-1006', 'PENDING_REVIEW'));
    expect(transitioned.status).toBe('PENDING_REVIEW');

    expect(() => service.transitionStatus('ann-1006', 'ARCHIVED')).toThrowError(
      'Cannot transition announcement from PENDING_REVIEW to ARCHIVED.',
    );
  });
});
