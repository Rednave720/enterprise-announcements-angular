import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { MOCK_USER_ANNOUNCEMENT_STATUSES } from '../../../core/data/mock-announcement-data';
import { UserAnnouncementStatus } from '../models/announcement.models';

@Injectable({ providedIn: 'root' })
export class UserAnnouncementStatusService {
  private readonly statusesSubject = new BehaviorSubject<readonly UserAnnouncementStatus[]>([
    ...MOCK_USER_ANNOUNCEMENT_STATUSES,
  ]);

  getUserStatus(userId: string, announcementId: string): Observable<UserAnnouncementStatus | undefined> {
    return this.statusesSubject.pipe(
      map((statuses) => statuses.find(
        (status) => status.userId === userId && status.announcementId === announcementId,
      )),
    );
  }

  getStatusesForUser(userId: string): Observable<readonly UserAnnouncementStatus[]> {
    return this.statusesSubject.pipe(
      map((statuses) => statuses.filter((status) => status.userId === userId)),
    );
  }

  getUserStatusSnapshot(userId: string, announcementId: string): UserAnnouncementStatus | undefined {
    return this.statusesSubject.value.find(
      (status) => status.userId === userId && status.announcementId === announcementId,
    );
  }

  markAsRead(userId: string, announcementId: string): Observable<UserAnnouncementStatus> {
    return this.updateStatus(userId, announcementId, { readAt: new Date().toISOString() });
  }

  dismissAnnouncement(userId: string, announcementId: string): Observable<UserAnnouncementStatus> {
    return this.updateStatus(userId, announcementId, {
      dismissedAt: new Date().toISOString(),
      doNotShowAgain: true,
    });
  }

  acknowledgeAnnouncement(userId: string, announcementId: string): Observable<UserAnnouncementStatus> {
    const acknowledgedAt = new Date().toISOString();
    return this.updateStatus(userId, announcementId, {
      readAt: acknowledgedAt,
      acknowledgedAt,
    });
  }

  private updateStatus(
    userId: string,
    announcementId: string,
    update: Partial<UserAnnouncementStatus>,
  ): Observable<UserAnnouncementStatus> {
    const statuses = this.statusesSubject.value;
    const existing = statuses.find(
      (status) => status.userId === userId && status.announcementId === announcementId,
    );
    const nextStatus: UserAnnouncementStatus = {
      id: existing?.id ?? `uas-${userId}-${announcementId}`,
      userId,
      announcementId,
      readAt: existing?.readAt ?? null,
      dismissedAt: existing?.dismissedAt ?? null,
      acknowledgedAt: existing?.acknowledgedAt ?? null,
      doNotShowAgain: existing?.doNotShowAgain ?? false,
      ...update,
    };

    this.statusesSubject.next(
      existing
        ? statuses.map((status) => status.id === existing.id ? nextStatus : status)
        : [...statuses, nextStatus],
    );

    return of(nextStatus);
  }
}
