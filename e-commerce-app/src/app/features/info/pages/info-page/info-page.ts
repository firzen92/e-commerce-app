import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INFO_PAGES, InfoPageKey } from '../../info-pages.data';

@Component({
  selector: 'app-info-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './info-page.html',
  styleUrl: './info-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InfoPage {
  /** Bound from the route's `data.page` via withComponentInputBinding(). */
  readonly page = input.required<InfoPageKey>();

  protected readonly content = computed(() => INFO_PAGES[this.page()]);
}
