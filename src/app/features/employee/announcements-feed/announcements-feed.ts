import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { RouterLink } from '@angular/router';
import { combineLatest, map, startWith, switchMap } from 'rxjs';

import { MockUserService } from '../../../core/services/mock-user.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { PriorityBadge } from '../../../shared/components/priority-badge/priority-badge';
import { TypeChip } from '../../../shared/components/type-chip/type-chip';
import {
  Announcement,
  AnnouncementPriority,
  AnnouncementType,
  UserAnnouncementStatus,
} from '../../announcements/models/announcement.models';
import { AnnouncementsService } from '../../announcements/services/announcements.service';
import { UserAnnouncementStatusService } from '../../announcements/services/user-announcement-status.service';

type FilterValue<T extends string> = T | 'ALL';

interface EmployeeAnnouncementItem {
  readonly announcement: Announcement;
  readonly status?: UserAnnouncementStatus;
  readonly isUnread: boolean;
}

@Component({
  selector: 'app-announcements-feed',
  imports: [
    AsyncPipe, DatePipe, EmptyState, MatButtonModule, MatFormFieldModule, MatIconModule,
    MatSelectModule, PageHeader, PriorityBadge, ReactiveFormsModule, RouterLink, TypeChip,
  ],
  templateUrl: './announcements-feed.html',
  styleUrl: './announcements-feed.scss',
})
export class AnnouncementsFeed {
  private readonly announcementsService = inject(AnnouncementsService);
  private readonly userStatusService = inject(UserAnnouncementStatusService);
  private readonly mockUserService = inject(MockUserService);

  readonly priorityControl = new FormControl<FilterValue<AnnouncementPriority>>('ALL', { nonNullable: true });
  readonly typeControl = new FormControl<FilterValue<AnnouncementType>>('ALL', { nonNullable: true });
  readonly priorities: readonly AnnouncementPriority[] = ['CRITICAL', 'IMPORTANT', 'INFORMATIONAL'];
  readonly types: readonly AnnouncementType[] = [
    'COMPANY_UPDATE', 'POLICY_COMPLIANCE', 'HR_BENEFITS', 'SYSTEM_IT', 'EVENT_TRAINING', 'URGENT_ALERT',
  ];

  readonly feed$ = this.mockUserService.currentUser$.pipe(switchMap((user) => combineLatest([
    this.announcementsService.getAnnouncementsForUser(user.id),
    this.announcementsService.getBannerAnnouncementsForUser(user.id),
    this.userStatusService.getStatusesForUser(user.id),
    this.priorityControl.valueChanges.pipe(startWith(this.priorityControl.value)),
    this.typeControl.valueChanges.pipe(startWith(this.typeControl.value)),
  ]).pipe(map(([eligible, banners, statuses, priority, type]) => {
    const items = eligible
      .filter((announcement) => priority === 'ALL' || announcement.priority === priority)
      .filter((announcement) => type === 'ALL' || announcement.type === type)
      .sort((a, b) => Date.parse(b.publishAt ?? '') - Date.parse(a.publishAt ?? ''))
      .map((announcement): EmployeeAnnouncementItem => {
        const status = statuses.find((item) => item.announcementId === announcement.id);
        return { announcement, status, isUnread: !status?.readAt };
      });
    return {
      user,
      banners,
      items,
      eligibleCount: eligible.length,
      hasFilters: priority !== 'ALL' || type !== 'ALL',
    };
  }))));

  clearFilters(): void {
    this.priorityControl.setValue('ALL');
    this.typeControl.setValue('ALL');
  }

  dismiss(announcement: Announcement): void {
    const user = this.mockUserService.getCurrentMockUser();
    this.userStatusService.dismissAnnouncement(user.id, announcement.id).subscribe();
  }

  acknowledge(announcement: Announcement): void {
    const user = this.mockUserService.getCurrentMockUser();
    this.userStatusService.acknowledgeAnnouncement(user.id, announcement.id).subscribe();
  }

  isDismissible(announcement: Announcement): boolean {
    return announcement.priority !== 'CRITICAL' && !announcement.acknowledgementRequired;
  }

  label(value: string): string {
    const labels: Record<string, string> = {
      COMPANY_UPDATE: 'Company Update', POLICY_COMPLIANCE: 'Policy & Compliance',
      HR_BENEFITS: 'HR & Benefits', SYSTEM_IT: 'System & IT', EVENT_TRAINING: 'Event & Training',
      URGENT_ALERT: 'Urgent Alert', CRITICAL: 'Critical', IMPORTANT: 'Important',
      INFORMATIONAL: 'Informational',
    };
    return labels[value] ?? value;
  }
}
