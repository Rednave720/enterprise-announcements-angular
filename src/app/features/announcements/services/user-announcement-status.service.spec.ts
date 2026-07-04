import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { UserAnnouncementStatusService } from './user-announcement-status.service';

describe('UserAnnouncementStatusService', () => {
  let service: UserAnnouncementStatusService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserAnnouncementStatusService);
  });

  it('records read, dismissed, and acknowledged employee actions', async () => {
    const read = await firstValueFrom(service.markAsRead('usr-1003', 'ann-1002'));
    expect(read.readAt).not.toBeNull();

    const dismissed = await firstValueFrom(service.dismissAnnouncement('usr-1003', 'ann-1002'));
    expect(dismissed.dismissedAt).not.toBeNull();
    expect(dismissed.doNotShowAgain).toBe(true);

    const acknowledged = await firstValueFrom(service.acknowledgeAnnouncement('usr-1003', 'ann-1002'));
    expect(acknowledged.acknowledgedAt).not.toBeNull();
    expect(acknowledged.readAt).not.toBeNull();
  });
});
