import { AfterViewInit, Component, DestroyRef, ViewChild, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { combineLatest, startWith, switchMap } from 'rxjs';

import { ReferenceOption } from '../../../core/models/reference-data.models';
import { ReferenceDataService } from '../../../core/services/reference-data.service';
import { EmptyState } from '../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { PriorityBadge } from '../../../shared/components/priority-badge/priority-badge';
import { StatusChip } from '../../../shared/components/status-chip/status-chip';
import { TypeChip } from '../../../shared/components/type-chip/type-chip';
import {
  Announcement,
  AnnouncementPriority,
  AnnouncementStatus,
  AnnouncementType,
  Audience,
} from '../../announcements/models/announcement.models';
import { AnnouncementsService } from '../../announcements/services/announcements.service';
import { AudienceService } from '../../announcements/services/audience.service';

type FilterValue<T extends string> = T | 'ALL';

@Component({
  selector: 'app-announcements-management',
  imports: [
    DatePipe,
    EmptyState,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTableModule,
    MatTooltipModule,
    PageHeader,
    PriorityBadge,
    ReactiveFormsModule,
    RouterLink,
    StatusChip,
    TypeChip,
  ],
  templateUrl: './announcements-management.html',
  styleUrl: './announcements-management.scss',
})
export class AnnouncementsManagement implements AfterViewInit {
  @ViewChild(MatPaginator) private paginator?: MatPaginator;

  private readonly announcementsService = inject(AnnouncementsService);
  private readonly audienceService = inject(AudienceService);
  private readonly referenceDataService = inject(ReferenceDataService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly audienceLabels = new Map<string, string>();

  readonly displayedColumns = [
    'announcement', 'type', 'priority', 'status', 'audience', 'publishAt', 'updatedAt', 'action',
  ];
  readonly dataSource = new MatTableDataSource<Announcement>();
  readonly searchControl = new FormControl('', { nonNullable: true });
  readonly statusControl = new FormControl<FilterValue<AnnouncementStatus>>('ALL', { nonNullable: true });
  readonly priorityControl = new FormControl<FilterValue<AnnouncementPriority>>('ALL', { nonNullable: true });
  readonly typeControl = new FormControl<FilterValue<AnnouncementType>>('ALL', { nonNullable: true });
  readonly statuses: readonly AnnouncementStatus[] = ['DRAFT', 'PENDING_REVIEW', 'SCHEDULED', 'LIVE', 'ARCHIVED'];
  readonly priorities: readonly AnnouncementPriority[] = ['CRITICAL', 'IMPORTANT', 'INFORMATIONAL'];
  readonly types: readonly AnnouncementType[] = [
    'COMPANY_UPDATE', 'POLICY_COMPLIANCE', 'HR_BENEFITS', 'SYSTEM_IT', 'EVENT_TRAINING', 'URGENT_ALERT',
  ];
  isLoading = true;

  constructor() {
    combineLatest([
      this.searchControl.valueChanges.pipe(startWith(this.searchControl.value)),
      this.statusControl.valueChanges.pipe(startWith(this.statusControl.value)),
      this.priorityControl.valueChanges.pipe(startWith(this.priorityControl.value)),
      this.typeControl.valueChanges.pipe(startWith(this.typeControl.value)),
    ]).pipe(
      switchMap(([searchTerm, status, priority, type]) =>
        this.announcementsService.searchAndFilterAnnouncements({
          searchTerm,
          statuses: status === 'ALL' ? [] : [status],
          priorities: priority === 'ALL' ? [] : [priority],
          types: type === 'ALL' ? [] : [type],
        }),
      ),
      takeUntilDestroyed(this.destroyRef),
    ).subscribe((announcements) => {
      this.dataSource.data = [...announcements];
      this.isLoading = false;
    });

    combineLatest([
      this.audienceService.getAllAudiences(),
      this.referenceDataService.getDepartments(),
      this.referenceDataService.getRoles(),
      this.referenceDataService.getLocations(),
      this.referenceDataService.getUserGroups(),
    ]).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(
      ([audiences, departments, roles, locations, groups]) => {
        audiences.forEach((audience) => this.audienceLabels.set(
          audience.announcementId,
          this.formatAudience(audience, departments, roles, locations, groups),
        ));
      },
    );
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  clearFilters(): void {
    this.searchControl.setValue('');
    this.statusControl.setValue('ALL');
    this.priorityControl.setValue('ALL');
    this.typeControl.setValue('ALL');
  }

  audienceLabel(announcementId: string): string {
    return this.audienceLabels.get(announcementId) ?? 'Audience not specified';
  }

  filterLabel(value: string): string {
    const labels: Record<string, string> = {
      PENDING_REVIEW: 'Pending Review', COMPANY_UPDATE: 'Company Update',
      POLICY_COMPLIANCE: 'Policy & Compliance', HR_BENEFITS: 'HR & Benefits',
      SYSTEM_IT: 'System & IT', EVENT_TRAINING: 'Event & Training', URGENT_ALERT: 'Urgent Alert',
      INFORMATIONAL: 'Informational', IMPORTANT: 'Important', CRITICAL: 'Critical',
      DRAFT: 'Draft', SCHEDULED: 'Scheduled', LIVE: 'Live', ARCHIVED: 'Archived',
    };
    return labels[value] ?? value;
  }

  private formatAudience(
    audience: Audience,
    departments: readonly ReferenceOption[],
    roles: readonly ReferenceOption[],
    locations: readonly ReferenceOption[],
    groups: readonly ReferenceOption[],
  ): string {
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
