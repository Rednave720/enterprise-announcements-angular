import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { AnnouncementDetail } from './announcement-detail';

describe('AnnouncementDetail', () => {
  let fixture: ComponentFixture<AnnouncementDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementDetail],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: 'ann-1001' }) } },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AnnouncementDetail);
    fixture.detectChanges();
  });

  it('renders announcement metadata and employee context', () => {
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('Severe weather office closure');
    expect(text).toContain('Current Status');
    expect(text).toContain('Audience Targeting');
    expect(text).toContain('Show in Banner');
    expect(text).toContain('Read Count');
    expect(text).toContain('Total Audience');
    expect(text).toContain('Version History');
  });
});
