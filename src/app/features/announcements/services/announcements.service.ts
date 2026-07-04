import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map, of } from 'rxjs';
import {
  MOCK_ANNOUNCEMENTS,
  MOCK_VERSION_HISTORY,
} from '../../../core/data/mock-announcement-data';
import { MockUserService } from '../../../core/services/mock-user.service';
import {
  AdminDashboardSummary,
  Announcement,
  AnnouncementFilters,
  AnnouncementStatus,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
  VersionHistory,
} from '../models/announcement.models';
import { AudienceService } from './audience.service';
import { UserAnnouncementStatusService } from './user-announcement-status.service';

const STATUS_TRANSITIONS: Readonly<Record<AnnouncementStatus, readonly AnnouncementStatus[]>> = {
  DRAFT: ['PENDING_REVIEW'],
  PENDING_REVIEW: ['DRAFT', 'SCHEDULED', 'LIVE'],
  SCHEDULED: ['DRAFT', 'LIVE', 'ARCHIVED'],
  LIVE: ['ARCHIVED'],
  ARCHIVED: [],
};

@Injectable({ providedIn: 'root' })
export class AnnouncementsService {
  private readonly audienceService = inject(AudienceService);
  private readonly mockUserService = inject(MockUserService);
  private readonly userStatusService = inject(UserAnnouncementStatusService);
  private readonly announcementsSubject = new BehaviorSubject<readonly Announcement[]>([
    ...MOCK_ANNOUNCEMENTS,
  ]);

  getAllAnnouncements(): Observable<readonly Announcement[]> {
    return this.announcementsSubject.asObservable();
  }

  getAnnouncementById(id: string): Observable<Announcement | undefined> {
    return this.announcementsSubject.pipe(
      map((announcements) => announcements.find((announcement) => announcement.id === id)),
    );
  }

  getAdminDashboardSummary(): Observable<AdminDashboardSummary> {
    return this.announcementsSubject.pipe(map((announcements) => ({
      total: announcements.length,
      draft: this.countStatus(announcements, 'DRAFT'),
      pendingReview: this.countStatus(announcements, 'PENDING_REVIEW'),
      scheduled: this.countStatus(announcements, 'SCHEDULED'),
      live: this.countStatus(announcements, 'LIVE'),
      archived: this.countStatus(announcements, 'ARCHIVED'),
      acknowledgementRequired: announcements.filter((item) => item.acknowledgementRequired).length,
    })));
  }

  getRecentlyUpdatedAnnouncements(limit: number): Observable<readonly Announcement[]> {
    return this.announcementsSubject.pipe(map((announcements) => [...announcements]
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt))
      .slice(0, Math.max(0, limit))));
  }

  getAnnouncementsForUser(userId: string, now = new Date()): Observable<readonly Announcement[]> {
    const user = this.mockUserService.getUserById(userId);
    if (!user) {
      return of([]);
    }

    return combineLatest([
      this.announcementsSubject,
      this.userStatusService.getStatusesForUser(userId),
    ]).pipe(map(([announcements, statuses]) => announcements.filter((announcement) => {
      const userStatus = statuses.find((status) => status.announcementId === announcement.id);
      return this.isEmployeeEligible(announcement, now)
        && this.audienceService.matchesAnnouncement(announcement.id, user)
        && !userStatus?.dismissedAt
        && !userStatus?.doNotShowAgain;
    })));
  }

  getBannerAnnouncementsForUser(userId: string, now = new Date()): Observable<readonly Announcement[]> {
    return this.getAnnouncementsForUser(userId, now).pipe(map((announcements) => announcements.filter((announcement) => {
      const userStatus = this.userStatusService.getUserStatusSnapshot(userId, announcement.id);
      return announcement.showInBanner
        && (announcement.priority === 'CRITICAL' || announcement.acknowledgementRequired)
        && (!announcement.acknowledgementRequired || !userStatus?.acknowledgedAt);
    })));
  }

  getAnnouncementVersions(announcementId: string): Observable<readonly VersionHistory[]> {
    return of(MOCK_VERSION_HISTORY
      .filter((version) => version.announcementId === announcementId)
      .sort((a, b) => Date.parse(b.editedAt) - Date.parse(a.editedAt)));
  }

  createAnnouncement(draft: CreateAnnouncementInput): Observable<Announcement> {
    const now = new Date().toISOString();
    const announcement: Announcement = {
      ...draft,
      id: `ann-${crypto.randomUUID()}`,
      createdAt: now,
      updatedAt: now,
      readCount: 0,
      totalAudience: 0,
    };
    this.announcementsSubject.next([...this.announcementsSubject.value, announcement]);
    return of(announcement);
  }

  updateAnnouncement(id: string, update: UpdateAnnouncementInput): Observable<Announcement> {
    const current = this.announcementsSubject.value.find((announcement) => announcement.id === id);
    if (!current) {
      throw new Error(`Announcement ${id} was not found.`);
    }
    const updated: Announcement = { ...current, ...update, id, updatedAt: new Date().toISOString() };
    this.announcementsSubject.next(
      this.announcementsSubject.value.map((announcement) => announcement.id === id ? updated : announcement),
    );
    return of(updated);
  }

  transitionStatus(id: string, nextStatus: AnnouncementStatus): Observable<Announcement> {
    const current = this.announcementsSubject.value.find((announcement) => announcement.id === id);
    if (!current) {
      throw new Error(`Announcement ${id} was not found.`);
    }
    if (!STATUS_TRANSITIONS[current.status].includes(nextStatus)) {
      throw new Error(`Cannot transition announcement from ${current.status} to ${nextStatus}.`);
    }
    return this.updateAnnouncement(id, { status: nextStatus });
  }

  searchAndFilterAnnouncements(filters: AnnouncementFilters): Observable<readonly Announcement[]> {
    const searchTerm = filters.searchTerm?.trim().toLocaleLowerCase();
    return this.announcementsSubject.pipe(map((announcements) => announcements.filter((announcement) => {
      const matchesSearch = !searchTerm || [announcement.title, announcement.summary, announcement.body]
        .some((value) => value.toLocaleLowerCase().includes(searchTerm));
      return matchesSearch
        && (!filters.statuses?.length || filters.statuses.includes(announcement.status))
        && (!filters.priorities?.length || filters.priorities.includes(announcement.priority))
        && (!filters.types?.length || filters.types.includes(announcement.type));
    })));
  }

  private isEmployeeEligible(announcement: Announcement, now: Date): boolean {
    const nowTime = now.getTime();
    return announcement.status === 'LIVE'
      && announcement.publishAt !== null
      && Date.parse(announcement.publishAt) <= nowTime
      && (announcement.expireAt === null || Date.parse(announcement.expireAt) > nowTime);
  }

  private countStatus(announcements: readonly Announcement[], status: AnnouncementStatus): number {
    return announcements.filter((announcement) => announcement.status === status).length;
  }
}
