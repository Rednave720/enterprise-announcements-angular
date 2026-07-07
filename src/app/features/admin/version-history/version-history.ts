import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { MockUserService } from '../../../core/services/mock-user.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { PriorityBadge } from '../../../shared/components/priority-badge/priority-badge';
import { StatusChip } from '../../../shared/components/status-chip/status-chip';
import { TypeChip } from '../../../shared/components/type-chip/type-chip';
import { AnnouncementsService } from '../../announcements/services/announcements.service';

@Component({
  selector: 'app-version-history-page',
  imports: [
    AsyncPipe, DatePipe, EmptyState, MatButtonModule, MatIconModule, PageHeader,
    PriorityBadge, RouterLink, StatusChip, TypeChip,
  ],
  templateUrl: './version-history.html',
  styleUrl: './version-history.scss',
})
export class VersionHistoryPage {
  private readonly route = inject(ActivatedRoute);
  private readonly announcementsService = inject(AnnouncementsService);
  private readonly mockUserService = inject(MockUserService);
  readonly announcementId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly history$ = combineLatest([
    this.announcementsService.getAnnouncementById(this.announcementId),
    this.announcementsService.getAnnouncementVersions(this.announcementId),
  ]).pipe(map(([announcement, versions]) => ({
    announcement,
    versions: versions.map((version) => ({
      ...version,
      editedByName: this.userName(version.editedBy),
    })),
  })));

  private userName(userId: string): string {
    return this.mockUserService.getUserById(userId)?.displayName ?? userId;
  }
}
