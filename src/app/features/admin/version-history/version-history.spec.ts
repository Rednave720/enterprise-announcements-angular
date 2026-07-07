import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';

import { VersionHistoryPage } from './version-history';

describe('VersionHistoryPage', () => {
  const setup = async (announcementId: string): Promise<ComponentFixture<VersionHistoryPage>> => {
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      imports: [VersionHistoryPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: announcementId }) } },
        },
      ],
    }).compileComponents();
    const fixture = TestBed.createComponent(VersionHistoryPage);
    fixture.detectChanges();
    return fixture;
  };

  it('renders existing version history records', async () => {
    const fixture = await setup('ann-1002');
    const text = fixture.nativeElement.textContent;

    expect(fixture.nativeElement.querySelectorAll('.timeline-item')).toHaveLength(2);
    expect(text).toContain('Information security policy acknowledgement');
    expect(text).toContain('Added the acknowledgement requirement');
    expect(text).toContain('Prepared the announcement for compliance review');
    expect(text).toContain('Previous Snapshot');
  });

  it('renders an empty state when no version records exist', async () => {
    const fixture = await setup('ann-1004');

    expect(fixture.nativeElement.textContent).toContain('No version history yet');
  });
});
