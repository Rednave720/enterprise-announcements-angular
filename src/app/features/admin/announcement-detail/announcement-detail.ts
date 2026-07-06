import { AsyncPipe, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';

import { ReferenceOption } from '../../../core/models/reference-data.models';
import { ReferenceDataService } from '../../../core/services/reference-data.service';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { PriorityBadge } from '../../../shared/components/priority-badge/priority-badge';
import { StatusChip } from '../../../shared/components/status-chip/status-chip';
import { TypeChip } from '../../../shared/components/type-chip/type-chip';
import { Audience } from '../../announcements/models/announcement.models';
import { AnnouncementsService } from '../../announcements/services/announcements.service';
import { AudienceService } from '../../announcements/services/audience.service';

@Component({
  selector: 'app-announcement-detail',
  imports: [
    AsyncPipe, DatePipe, MatButtonModule, MatIconModule, PageHeader,
    PriorityBadge, RouterLink, StatusChip, TypeChip,
  ],
  templateUrl: './announcement-detail.html',
  styleUrl: './announcement-detail.scss',
})
export class AnnouncementDetail {
  private readonly route = inject(ActivatedRoute);
  private readonly announcementsService = inject(AnnouncementsService);
  private readonly audienceService = inject(AudienceService);
  private readonly referenceDataService = inject(ReferenceDataService);
  readonly announcementId = this.route.snapshot.paramMap.get('id') ?? '';

  readonly detail$ = combineLatest([
    this.announcementsService.getAnnouncementById(this.announcementId),
    this.audienceService.getAudienceForAnnouncement(this.announcementId),
    this.referenceDataService.getDepartments(),
    this.referenceDataService.getRoles(),
    this.referenceDataService.getLocations(),
    this.referenceDataService.getUserGroups(),
  ]).pipe(map(([announcement, audience, departments, roles, locations, groups]) => ({
    announcement,
    audience: this.formatAudience(audience, departments, roles, locations, groups),
  })));

  private formatAudience(
    audience: Audience | undefined,
    departments: readonly ReferenceOption[], roles: readonly ReferenceOption[],
    locations: readonly ReferenceOption[], groups: readonly ReferenceOption[],
  ): string {
    if (!audience) return 'Audience not specified';
    const dimensions = [
      this.namesFor(audience.departmentIds, departments),
      this.namesFor(audience.roleIds, roles),
      this.namesFor(audience.locationIds, locations),
      this.namesFor(audience.userGroupIds, groups),
    ].filter(Boolean);
    return dimensions.length ? dimensions.join(' · ') : 'All employees';
  }

  private namesFor(ids: readonly string[], options: readonly ReferenceOption[]): string {
    return ids.map((id) => options.find((option) => option.id === id)?.name ?? id).join(', ');
  }
}
