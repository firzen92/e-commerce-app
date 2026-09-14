import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { AUTH_SERVICE, WISHLIST_SERVICE } from '../../services';
import { CartService } from '../../../state/cart.service';

interface NavLink {
  readonly label: string;
  readonly path: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatMenuModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {
  private readonly authService = inject(AUTH_SERVICE);
  private readonly wishlistService = inject(WISHLIST_SERVICE);
  private readonly cartService = inject(CartService);
  private readonly router = inject(Router);

  protected readonly isMobileMenuOpen = signal(false);
  protected readonly currentUser = this.authService.currentUser;
  protected readonly wishlistCount = computed(() => this.wishlistService.items()?.length ?? 0);
  protected readonly cartCount = this.cartService.itemCount;

  protected readonly navLinks: readonly NavLink[] = [
    { label: 'Home', path: '/' },
    { label: 'Shop', path: '/shop' },
    { label: 'Categories', path: '/categories' },
    { label: 'About', path: '/about' }
  ];

  protected toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((isOpen) => !isOpen);
  }

  protected closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  protected signOut(): void {
    this.authService.signOut().subscribe(() => void this.router.navigateByUrl('/'));
  }
}
