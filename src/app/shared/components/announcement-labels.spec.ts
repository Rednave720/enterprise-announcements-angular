import { TestBed } from '@angular/core/testing';

import { PriorityBadge } from './priority-badge/priority-badge';
import { StatusChip } from './status-chip/status-chip';
import { TypeChip } from './type-chip/type-chip';

describe('Announcement label components', () => {
  it('renders the semantic status label and class', async () => {
    await TestBed.configureTestingModule({ imports: [StatusChip] }).compileComponents();
    const fixture = TestBed.createComponent(StatusChip);
    fixture.componentRef.setInput('status', 'PENDING_REVIEW');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Pending Review');
    expect(fixture.nativeElement.querySelector('.status-pending-review')).not.toBeNull();
  });

  it('renders priority as a visually distinct badge', async () => {
    await TestBed.configureTestingModule({ imports: [PriorityBadge] }).compileComponents();
    const fixture = TestBed.createComponent(PriorityBadge);
    fixture.componentRef.setInput('priority', 'CRITICAL');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('Critical');
    expect(fixture.nativeElement.querySelector('.priority-critical')).not.toBeNull();
  });

  it('renders type as a neutral outlined chip', async () => {
    await TestBed.configureTestingModule({ imports: [TypeChip] }).compileComponents();
    const fixture = TestBed.createComponent(TypeChip);
    fixture.componentRef.setInput('type', 'SYSTEM_IT');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('System & IT');
    expect(fixture.nativeElement.querySelector('.type-chip')).not.toBeNull();
  });
});
