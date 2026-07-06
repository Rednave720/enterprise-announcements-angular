import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, of } from 'rxjs';
import { MOCK_AUDIENCES } from '../../../core/data/mock-announcement-data';
import { MockUser } from '../../../core/models/reference-data.models';
import { Audience, AudienceSelection } from '../models/announcement.models';

@Injectable({ providedIn: 'root' })
export class AudienceService {
  private readonly audiencesSubject = new BehaviorSubject<readonly Audience[]>([...MOCK_AUDIENCES]);

  getAllAudiences(): Observable<readonly Audience[]> {
    return this.audiencesSubject.asObservable();
  }

  getAudienceForAnnouncement(announcementId: string): Observable<Audience | undefined> {
    return this.audiencesSubject.pipe(
      map((audiences) => audiences.find((audience) => audience.announcementId === announcementId)),
    );
  }

  upsertAudience(announcementId: string, selection: AudienceSelection): Observable<Audience> {
    const audiences = this.audiencesSubject.value;
    const existing = audiences.find((audience) => audience.announcementId === announcementId);
    const audience: Audience = {
      id: existing?.id ?? `aud-${crypto.randomUUID()}`,
      announcementId,
      ...selection,
    };
    this.audiencesSubject.next(
      existing
        ? audiences.map((item) => item.id === existing.id ? audience : item)
        : [...audiences, audience],
    );
    return of(audience);
  }

  matchesUser(audience: Audience | undefined, user: MockUser): boolean {
    if (!audience) {
      return false;
    }

    return (
      this.matchesDimension(audience.departmentIds, [user.departmentId]) &&
      this.matchesDimension(audience.roleIds, [user.roleId]) &&
      this.matchesDimension(audience.locationIds, [user.locationId]) &&
      this.matchesDimension(audience.userGroupIds, user.userGroupIds)
    );
  }

  matchesAnnouncement(announcementId: string, user: MockUser): boolean {
    const audience = this.audiencesSubject.value.find((item) => item.announcementId === announcementId);
    return this.matchesUser(audience, user);
  }

  private matchesDimension(targetIds: readonly string[], userIds: readonly string[]): boolean {
    return targetIds.length === 0 || targetIds.some((targetId) => userIds.includes(targetId));
  }
}
