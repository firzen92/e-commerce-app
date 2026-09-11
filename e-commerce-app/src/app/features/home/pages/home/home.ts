import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Hero } from '../../components/hero/hero';
import { FeaturedProducts } from '../../components/featured-products/featured-products';
import { Categories } from '../../components/categories/categories';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [Hero, FeaturedProducts, Categories],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {}
