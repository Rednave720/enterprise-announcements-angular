import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { combineLatest, map, switchMap, take } from 'rxjs';

import { MockUserService } from '../../../core/services/mock-user.service';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { PriorityBadge } from '../../../shared/components/priority-badge/priority-badge';
import { TypeChip } from '../../../shared/components/type-chip/type-chip';
import { Announcement } from '../../announcements/models/announcement.models';
import { AnnouncementsService } from '../../announcements/services/announcements.service';
import { UserAnnouncementStatusService } from '../../announcements/services/user-announcement-status.service';

@Component({
  selector: 'app-employee-announcement-detail',
  imports: [AsyncPipe, DatePipe, MatButtonModule, MatIconModule, PageHeader, PriorityBadge, RouterLink, TypeChip],
  templateUrl: './employee-announcement-detail.html',
  styleUrl: './employee-announcement-detail.scss',
})
export class EmployeeAnnouncementDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly announcementsService = inject(AnnouncementsService);
  private readonly userStatusService = inject(UserAnnouncementStatusService);
  private readonly mockUserService = inject(MockUserService);
  readonly announcementId = this.route.snapshot.paramMap.get('id') ?? '';
  readonly actionMessage = signal('');

  readonly detail$ = this.mockUserService.currentUser$.pipe(
    switchMap((user) => combineLatest([
      this.announcementsService.getAnnouncementsForUser(user.id),
      this.userStatusService.getUserStatus(user.id, this.announcementId),
    ]).pipe(
      map(([announcements, status]) => ({
        user,
        announcement: announcements.find((item) => item.id === this.announcementId),
        status,
      })),
    )),
  );

  ngOnInit(): void {
    this.detail$.pipe(take(1)).subscribe(({ user, announcement, status }) => {
      if (announcement && !status?.readAt) {
        this.userStatusService.markAsRead(user.id, announcement.id).subscribe();
      }
    });
  }

  acknowledge(announcement: Announcement): void {
    const user = this.mockUserService.getCurrentMockUser();
    this.userStatusService.acknowledgeAnnouncement(user.id, announcement.id).subscribe(() => {
      this.actionMessage.set('Acknowledgement recorded.');
    });
  }

  dismiss(announcement: Announcement): void {
    const user = this.mockUserService.getCurrentMockUser();
    this.userStatusService.dismissAnnouncement(user.id, announcement.id).subscribe(() => {
      void this.router.navigate(['/employee/announcements']);
    });
  }

  isDismissible(announcement: Announcement): boolean {
    return announcement.priority !== 'CRITICAL' && !announcement.acknowledgementRequired;
  }
}
