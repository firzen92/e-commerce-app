import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import { About } from './about';

describe('About', () => {
  it('renders the page heading and a link to the shop', async () => {
    await TestBed.configureTestingModule({
      imports: [About],
      providers: [provideRouter(routes)]
    }).compileComponents();

    const fixture = TestBed.createComponent(About);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Considered furniture');
    expect(compiled.querySelector('a.about__cta')?.getAttribute('href')).toBe('/shop');
  });
});
