import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { Announcement } from '../../announcements/models/announcement.models';
import { AnnouncementsService } from '../../announcements/services/announcements.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { PriorityBadge } from '../../../shared/components/priority-badge/priority-badge';
import { StatusChip } from '../../../shared/components/status-chip/status-chip';

interface MetricCard {
  readonly label: string;
  readonly value: number;
  readonly icon: string;
  readonly tone: string;
}

@Component({
  selector: 'app-admin-dashboard',
  imports: [
    AsyncPipe,
    DatePipe,
    EmptyState,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTableModule,
    PageHeader,
    PriorityBadge,
    RouterLink,
    StatusChip,
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss',
})
export class AdminDashboard {
  private readonly announcementsService = inject(AnnouncementsService);

  readonly displayedColumns = ['announcement', 'priority', 'status', 'updated', 'action'];
  readonly dashboard$ = combineLatest([
    this.announcementsService.getAdminDashboardSummary(),
    this.announcementsService.getRecentlyUpdatedAnnouncements(5),
  ]).pipe(map(([summary, recent]) => ({
    metrics: <readonly MetricCard[]>[
      { label: 'Total Announcements', value: summary.total, icon: 'campaign', tone: 'primary' },
      { label: 'Draft', value: summary.draft, icon: 'edit_note', tone: 'neutral' },
      { label: 'Pending Review', value: summary.pendingReview, icon: 'rate_review', tone: 'pending' },
      { label: 'Scheduled', value: summary.scheduled, icon: 'schedule', tone: 'scheduled' },
      { label: 'Live', value: summary.live, icon: 'sensors', tone: 'live' },
      { label: 'Acknowledgement Required', value: summary.acknowledgementRequired, icon: 'fact_check', tone: 'attention' },
    ],
    recent,
  })));

  trackAnnouncement(_: number, announcement: Announcement): string {
    return announcement.id;
  }
}
