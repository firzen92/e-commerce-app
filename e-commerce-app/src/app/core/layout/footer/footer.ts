import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FooterLinkGroup {
  readonly title: string;
  readonly links: ReadonlyArray<{ label: string; path: string }>;
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Footer {
  protected readonly currentYear = new Date().getFullYear();

  protected readonly linkGroups: readonly FooterLinkGroup[] = [
    {
      title: 'Shop',
      links: [
        { label: 'All Products', path: '/shop' },
        { label: 'Categories', path: '/categories' },
        { label: 'New Arrivals', path: '/shop' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', path: '/contact' },
        { label: 'Shipping & Returns', path: '/shipping' },
        { label: 'FAQ', path: '/faq' }
      ]
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Privacy Policy', path: '/privacy' }
      ]
    }
  ];
}
