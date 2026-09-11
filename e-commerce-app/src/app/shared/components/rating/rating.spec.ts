import { TestBed } from '@angular/core/testing';
import { Rating } from './rating';

describe('Rating', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Rating] }).compileComponents();
  });

  it('renders the average and review count', async () => {
    const fixture = TestBed.createComponent(Rating);
    fixture.componentRef.setInput('average', 4.8);
    fixture.componentRef.setInput('count', 214);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.rating__average')?.textContent).toContain('4.8');
    expect(compiled.querySelector('.rating__count')?.textContent).toContain('214');
  });

  it('omits the count when none is provided', async () => {
    const fixture = TestBed.createComponent(Rating);
    fixture.componentRef.setInput('average', 4.8);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.rating__count')).toBeNull();
  });
});
