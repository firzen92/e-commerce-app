import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import { INFO_PAGES, InfoPageKey } from '../../info-pages.data';
import { INFO_ROUTES } from '../../info.routes';
import { InfoPage } from './info-page';

describe('InfoPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InfoPage],
      providers: [provideRouter(routes)]
    }).compileComponents();
  });

  it.each(Object.keys(INFO_PAGES) as InfoPageKey[])('renders the %s page', async (page) => {
    const fixture = TestBed.createComponent(InfoPage);
    fixture.componentRef.setInput('page', page);
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain(INFO_PAGES[page].title);
    expect(compiled.querySelectorAll('.info__section').length).toBe(INFO_PAGES[page].sections.length);
  });

  it('registers a route for each footer link', () => {
    expect(INFO_ROUTES.map((route) => route.path).sort()).toEqual(
      ['careers', 'contact', 'faq', 'privacy', 'shipping']
    );
  });
});
