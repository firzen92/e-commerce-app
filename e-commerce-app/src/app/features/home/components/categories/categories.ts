import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { CATEGORY_CATALOG } from '../../../../core/services';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Categories {
  private readonly categoryCatalog = inject(CATEGORY_CATALOG);

  protected readonly categories = toSignal(this.categoryCatalog.getCategories(), {
    initialValue: []
  });
}
