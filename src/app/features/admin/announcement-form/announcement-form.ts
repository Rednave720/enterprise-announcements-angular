import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, combineLatest, finalize, map, of, startWith, switchMap, take } from 'rxjs';

import { ReferenceOption } from '../../../core/models/reference-data.models';
import { MockUserService } from '../../../core/services/mock-user.service';
import { ReferenceDataService } from '../../../core/services/reference-data.service';
import { PageHeader } from '../../../shared/components/page-header/page-header';
import { PriorityBadge } from '../../../shared/components/priority-badge/priority-badge';
import { StatusChip } from '../../../shared/components/status-chip/status-chip';
import { TypeChip } from '../../../shared/components/type-chip/type-chip';
import {
  AnnouncementPriority,
  AnnouncementStatus,
  AnnouncementType,
  AudienceSelection,
  CreateAnnouncementInput,
  UpdateAnnouncementInput,
} from '../../announcements/models/announcement.models';
import { AnnouncementsService } from '../../announcements/services/announcements.service';
import { AudienceService } from '../../announcements/services/audience.service';

interface FormReferences {
  readonly departments: readonly ReferenceOption[];
  readonly roles: readonly ReferenceOption[];
  readonly locations: readonly ReferenceOption[];
  readonly groups: readonly ReferenceOption[];
}

function announcementFormValidator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  const errors: ValidationErrors = {};
  if (value.showInBanner && !value.summary?.trim()) {
    errors['bannerSummaryRequired'] = true;
  }
  if (value.status === 'SCHEDULED' && !value.publishDate) {
    errors['scheduledPublishRequired'] = true;
  }
  if (!value.showInBanner && !value.showInNotificationCenter) {
    errors['displayLocationRequired'] = true;
  }
  if (value.publishDate && value.expireDate && value.expireDate <= value.publishDate) {
    errors['invalidDateRange'] = true;
  }
  return Object.keys(errors).length ? errors : null;
}

@Component({
  selector: 'app-announcement-form',
  imports: [
    DatePipe,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    PageHeader,
    PriorityBadge,
    ReactiveFormsModule,
    RouterLink,
    StatusChip,
    TypeChip,
  ],
  templateUrl: './announcement-form.html',
  styleUrl: './announcement-form.scss',
})
export class AnnouncementForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly announcementsService = inject(AnnouncementsService);
  private readonly audienceService = inject(AudienceService);
  private readonly referenceDataService = inject(ReferenceDataService);
  private readonly mockUserService = inject(MockUserService);

  readonly announcementId = this.route.snapshot.paramMap.get('id');
  readonly isEditMode = Boolean(this.announcementId);
  readonly isLoading = signal(this.isEditMode);
  readonly isSaving = signal(false);
  readonly loadError = signal('');
  readonly saveError = signal('');
  readonly submitted = signal(false);

  readonly types: readonly AnnouncementType[] = [
    'COMPANY_UPDATE', 'POLICY_COMPLIANCE', 'HR_BENEFITS', 'SYSTEM_IT', 'EVENT_TRAINING', 'URGENT_ALERT',
  ];
  readonly priorities: readonly AnnouncementPriority[] = ['CRITICAL', 'IMPORTANT', 'INFORMATIONAL'];
  readonly statuses: readonly AnnouncementStatus[] = ['DRAFT', 'PENDING_REVIEW', 'SCHEDULED', 'LIVE', 'ARCHIVED'];

  readonly form = this.formBuilder.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(120)]],
    summary: [''],
    body: ['', Validators.required],
    type: <AnnouncementType>'COMPANY_UPDATE',
    priority: <AnnouncementPriority>'INFORMATIONAL',
    departmentIds: this.formBuilder.nonNullable.control<readonly string[]>([]),
    roleIds: this.formBuilder.nonNullable.control<readonly string[]>([]),
    locationIds: this.formBuilder.nonNullable.control<readonly string[]>([]),
    userGroupIds: this.formBuilder.nonNullable.control<readonly string[]>([]),
    status: <AnnouncementStatus>'DRAFT',
    publishDate: [''],
    expireDate: [''],
    showInBanner: false,
    showInNotificationCenter: true,
    acknowledgementRequired: false,
  }, { validators: announcementFormValidator });

  readonly preview = toSignal(
    this.form.valueChanges.pipe(
      startWith(this.form.getRawValue()),
      map(() => this.form.getRawValue()),
    ),
    { initialValue: this.form.getRawValue() },
  );

  readonly pageTitle = computed(() => this.isEditMode ? 'Edit Announcement' : 'Create Announcement');
  readonly pageDescription = computed(() => this.isEditMode
    ? 'Update content, audience, publishing schedule, and employee display settings.'
    : 'Prepare a targeted internal communication for review, scheduling, or publication.');

  references: FormReferences = { departments: [], roles: [], locations: [], groups: [] };

  ngOnInit(): void {
    combineLatest([
      this.referenceDataService.getDepartments(),
      this.referenceDataService.getRoles(),
      this.referenceDataService.getLocations(),
      this.referenceDataService.getUserGroups(),
    ]).pipe(take(1)).subscribe(([departments, roles, locations, groups]) => {
      this.references = { departments, roles, locations, groups };
    });

    if (!this.announcementId) {
      return;
    }

    combineLatest([
      this.announcementsService.getAnnouncementById(this.announcementId),
      this.audienceService.getAudienceForAnnouncement(this.announcementId),
    ]).pipe(take(1)).subscribe(([announcement, audience]) => {
      if (!announcement) {
        this.loadError.set('The requested announcement could not be found.');
        this.isLoading.set(false);
        return;
      }
      this.form.patchValue({
        title: announcement.title,
        summary: announcement.summary,
        body: announcement.body,
        type: announcement.type,
        priority: announcement.priority,
        status: announcement.status,
        publishDate: this.toDateInput(announcement.publishAt),
        expireDate: this.toDateInput(announcement.expireAt),
        showInBanner: announcement.showInBanner,
        showInNotificationCenter: announcement.showInNotificationCenter,
        acknowledgementRequired: announcement.acknowledgementRequired,
        departmentIds: audience?.departmentIds ?? [],
        roleIds: audience?.roleIds ?? [],
        locationIds: audience?.locationIds ?? [],
        userGroupIds: audience?.userGroupIds ?? [],
      });
      this.isLoading.set(false);
    });
  }

  submit(): void {
    this.submitted.set(true);
    this.saveError.set('');
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();
    if (this.form.invalid || this.isSaving()) {
      return;
    }

    const value = this.form.getRawValue();
    const currentUser = this.mockUserService.getCurrentMockUser();
    const audience: AudienceSelection = {
      departmentIds: value.departmentIds,
      roleIds: value.roleIds,
      locationIds: value.locationIds,
      userGroupIds: value.userGroupIds,
    };
    const common = {
      title: value.title.trim(),
      summary: value.summary.trim(),
      body: value.body.trim(),
      type: value.type,
      priority: value.priority,
      status: value.status,
      publishAt: this.toIsoDate(value.publishDate),
      expireAt: this.toIsoDate(value.expireDate),
      showInBanner: value.showInBanner,
      showInNotificationCenter: value.showInNotificationCenter,
      acknowledgementRequired: value.acknowledgementRequired,
      lastEditedBy: currentUser.id,
    };

    this.isSaving.set(true);
    const save$ = this.announcementId
      ? this.announcementsService.updateAnnouncement(this.announcementId, <UpdateAnnouncementInput>common)
      : this.announcementsService.createAnnouncement(<CreateAnnouncementInput>{ ...common, createdBy: currentUser.id });

    save$.pipe(
      switchMap((announcement) => this.audienceService.upsertAudience(announcement.id, audience)
        .pipe(map(() => announcement))),
      catchError(() => {
        this.saveError.set('The announcement could not be saved. Review the form and try again.');
        return of(null);
      }),
      finalize(() => this.isSaving.set(false)),
    ).subscribe((announcement) => {
      if (announcement) {
        void this.router.navigate(['/admin/announcements']);
      }
    });
  }

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return Boolean(control?.invalid && (control.touched || this.submitted()));
  }

  showFormError(errorName: string): boolean {
    return Boolean(this.form.hasError(errorName) && this.submitted());
  }

  label(value: string): string {
    const labels: Record<string, string> = {
      COMPANY_UPDATE: 'Company Update', POLICY_COMPLIANCE: 'Policy & Compliance',
      HR_BENEFITS: 'HR & Benefits', SYSTEM_IT: 'System & IT', EVENT_TRAINING: 'Event & Training',
      URGENT_ALERT: 'Urgent Alert', CRITICAL: 'Critical', IMPORTANT: 'Important',
      INFORMATIONAL: 'Informational', DRAFT: 'Draft', PENDING_REVIEW: 'Pending Review',
      SCHEDULED: 'Scheduled', LIVE: 'Live', ARCHIVED: 'Archived',
    };
    return labels[value] ?? value;
  }

  private toDateInput(value: string | null): string {
    return value ? value.slice(0, 10) : '';
  }

  private toIsoDate(value: string): string | null {
    return value ? new Date(`${value}T12:00:00`).toISOString() : null;
  }
}
