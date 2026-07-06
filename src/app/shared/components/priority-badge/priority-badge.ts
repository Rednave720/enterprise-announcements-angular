import { Component, Input } from '@angular/core';

import { AnnouncementPriority } from '../../../features/announcements/models/announcement.models';

const PRIORITY_LABELS: Record<AnnouncementPriority, string> = {
  CRITICAL: 'Critical',
  IMPORTANT: 'Important',
  INFORMATIONAL: 'Informational',
};

@Component({
  selector: 'app-priority-badge',
  template: '<span class="priority-badge" [class]="priorityClass"><span aria-hidden="true"></span>{{ label }}</span>',
  styleUrl: './priority-badge.scss',
})
export class PriorityBadge {
  @Input({ required: true }) priority: AnnouncementPriority = 'INFORMATIONAL';

  get label(): string {
    return PRIORITY_LABELS[this.priority];
  }

  get priorityClass(): string {
    return `priority-${this.priority.toLocaleLowerCase()}`;
  }
}
