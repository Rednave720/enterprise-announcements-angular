import { Component, Input } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';

import { AnnouncementType } from '../../../features/announcements/models/announcement.models';

const TYPE_LABELS: Record<AnnouncementType, string> = {
  COMPANY_UPDATE: 'Company Update',
  POLICY_COMPLIANCE: 'Policy & Compliance',
  HR_BENEFITS: 'HR & Benefits',
  SYSTEM_IT: 'System & IT',
  EVENT_TRAINING: 'Event & Training',
  URGENT_ALERT: 'Urgent Alert',
};

@Component({
  selector: 'app-type-chip',
  imports: [MatChipsModule],
  template: '<mat-chip class="type-chip">{{ label }}</mat-chip>',
  styleUrl: './type-chip.scss',
})
export class TypeChip {
  @Input({ required: true }) type: AnnouncementType = 'COMPANY_UPDATE';

  get label(): string {
    return TYPE_LABELS[this.type];
  }
}
