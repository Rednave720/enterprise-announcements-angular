import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MOCK_AUDIENCES } from '../../../core/data/mock-announcement-data';
import { MockUser } from '../../../core/models/reference-data.models';
import { Audience } from '../models/announcement.models';

@Injectable({ providedIn: 'root' })
export class AudienceService {
  getAllAudiences(): Observable<readonly Audience[]> {
    return of(MOCK_AUDIENCES);
  }

  getAudienceForAnnouncement(announcementId: string): Observable<Audience | undefined> {
    return of(MOCK_AUDIENCES.find((audience) => audience.announcementId === announcementId));
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
    const audience = MOCK_AUDIENCES.find((item) => item.announcementId === announcementId);
    return this.matchesUser(audience, user);
  }

  private matchesDimension(targetIds: readonly string[], userIds: readonly string[]): boolean {
    return targetIds.length === 0 || targetIds.some((targetId) => userIds.includes(targetId));
  }
}
