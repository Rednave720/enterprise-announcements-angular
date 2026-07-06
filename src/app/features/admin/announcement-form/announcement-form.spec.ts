import { ComponentFixture, TestBed } from '@angular/core/testing';
import { convertToParamMap, ActivatedRoute, provideRouter, Router } from '@angular/router';
import { of } from 'rxjs';

import { Announcement } from '../../announcements/models/announcement.models';
import { AnnouncementsService } from '../../announcements/services/announcements.service';
import { AudienceService } from '../../announcements/services/audience.service';
import { AnnouncementForm } from './announcement-form';

describe('AnnouncementForm', () => {
  const createFixture = async (): Promise<ComponentFixture<AnnouncementForm>> => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementForm],
      providers: [
        provideRouter([]),
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: convertToParamMap({}) } } },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(AnnouncementForm);
    fixture.detectChanges();
    return fixture;
  };

  it('renders in create mode', async () => {
    const fixture = await createFixture();

    expect(fixture.componentInstance.isEditMode).toBe(false);
    expect(fixture.nativeElement.textContent).toContain('Create Announcement');
    expect(fixture.nativeElement.textContent).toContain('Announcement Preview');
  });

  it('validates required title and body fields', async () => {
    const fixture = await createFixture();
    const component = fixture.componentInstance;

    component.form.controls.title.setValue('No');
    component.form.controls.body.setValue('');
    component.submit();

    expect(component.form.controls.title.invalid).toBe(true);
    expect(component.form.controls.body.hasError('required')).toBe(true);
  });

  it('requires a summary when banner display is enabled', async () => {
    const fixture = await createFixture();
    const form = fixture.componentInstance.form;

    form.patchValue({ showInBanner: true, summary: '' });

    expect(form.hasError('bannerSummaryRequired')).toBe(true);
  });

  it('requires a publish date for scheduled announcements', async () => {
    const fixture = await createFixture();
    const form = fixture.componentInstance.form;

    form.patchValue({ status: 'SCHEDULED', publishDate: '' });

    expect(form.hasError('scheduledPublishRequired')).toBe(true);
  });

  it('requires expiration to be after publish date', async () => {
    const fixture = await createFixture();
    const form = fixture.componentInstance.form;

    form.patchValue({ publishDate: '2026-07-20', expireDate: '2026-07-19' });

    expect(form.hasError('invalidDateRange')).toBe(true);
  });

  it('updates the employee preview as form content changes', async () => {
    const fixture = await createFixture();

    fixture.componentInstance.form.patchValue({
      title: 'Quarterly policy reminder',
      summary: 'Review the updated workplace policy.',
      priority: 'IMPORTANT',
    });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.preview-content h3').textContent).toContain(
      'Quarterly policy reminder',
    );
    expect(fixture.nativeElement.querySelector('.preview-summary').textContent).toContain(
      'Review the updated workplace policy.',
    );
  });

  it('saves a valid new announcement through the services', async () => {
    const fixture = await createFixture();
    const component = fixture.componentInstance;
    const announcementsService = TestBed.inject(AnnouncementsService);
    const audienceService = TestBed.inject(AudienceService);
    const router = TestBed.inject(Router);
    const created: Announcement = {
      id: 'ann-created', title: 'Planned system maintenance',
      summary: 'The platform will be unavailable Saturday.',
      body: 'Complete time-sensitive work before the maintenance window.',
      type: 'SYSTEM_IT', priority: 'IMPORTANT', status: 'DRAFT',
      publishAt: null, expireAt: null, showInBanner: false,
      showInNotificationCenter: true, acknowledgementRequired: false,
      createdBy: 'usr-1001', lastEditedBy: 'usr-1001',
      createdAt: '2026-07-06T12:00:00.000Z', updatedAt: '2026-07-06T12:00:00.000Z',
      readCount: 0, totalAudience: 0,
    };
    const createSpy = vi.spyOn(announcementsService, 'createAnnouncement').mockReturnValue(of(created));
    const audienceSpy = vi.spyOn(audienceService, 'upsertAudience').mockReturnValue(of({
      id: 'aud-created', announcementId: created.id,
      departmentIds: [], roleIds: [], locationIds: [], userGroupIds: [],
    }));
    const navigateSpy = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    component.form.patchValue({
      title: created.title,
      summary: created.summary,
      body: created.body,
      type: created.type,
      priority: created.priority,
    });
    component.submit();

    expect(createSpy).toHaveBeenCalledOnce();
    expect(audienceSpy).toHaveBeenCalledWith(created.id, {
      departmentIds: [], roleIds: [], locationIds: [], userGroupIds: [],
    });
    expect(navigateSpy).toHaveBeenCalledWith(['/admin/announcements']);
  });

  it('patches existing announcement and audience values in edit mode', async () => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [AnnouncementForm],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'ann-1001' }) } },
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(AnnouncementForm);
    fixture.detectChanges();

    expect(fixture.componentInstance.isEditMode).toBe(true);
    expect(fixture.componentInstance.form.controls.title.value).toBe('Severe weather office closure');
    expect(fixture.componentInstance.form.controls.locationIds.value).toEqual(['loc-boston']);
    expect(fixture.nativeElement.textContent).toContain('Update Announcement');
  });
});
