import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

import { AnnouncementStatus } from '../../../features/announcements/models/announcement.models';

const STATUS_LABELS: Record<AnnouncementStatus, string> = {
  DRAFT: 'Draft',
  PENDING_REVIEW: 'Pending Review',
  SCHEDULED: 'Scheduled',
  LIVE: 'Live',
  ARCHIVED: 'Archived',
};

@Component({
  selector: 'app-status-chip',
  imports: [MatChipsModule],
  template: '<mat-chip class="status-chip" [class]="statusClass">{{ label }}</mat-chip>',
  styleUrl: './status-chip.scss',
})
export class StatusChip {
  @Input({ required: true }) status: AnnouncementStatus = 'DRAFT';

  get label(): string {
    return STATUS_LABELS[this.status];
  }

  get statusClass(): string {
    return `status-${this.status.toLocaleLowerCase().replace('_', '-')}`;
  }
}
