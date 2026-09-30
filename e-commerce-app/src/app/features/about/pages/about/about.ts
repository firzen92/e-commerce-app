import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface AboutValue {
  readonly title: string;
  readonly description: string;
}

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class About {
  protected readonly values: readonly AboutValue[] = [
    {
      title: 'Considered design',
      description: 'Every piece in our collection is chosen for how it looks, feels, and holds up to daily life.'
    },
    {
      title: 'Made to last',
      description: 'We favour durable materials and honest construction over trends that fade after a season.'
    },
    {
      title: 'Simple to shop',
      description: 'Clear pricing, straightforward ordering, and a full history of everything you have bought.'
    }
  ];
}
