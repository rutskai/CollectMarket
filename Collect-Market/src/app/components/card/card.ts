import { Component, Input, OnInit, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelCard } from '../../models/card';
import { AuthService } from '../../services/auth/auth-service';
import { CartService } from '../../services/cart/cart-service';
import { FavoritesService } from '../../services/favorite/favorites-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card',
  imports: [CommonModule],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card implements OnInit {

  @Input() card!: ModelCard;

  isFavorite: Signal<boolean> = computed(() => false);
  isInCart: Signal<boolean>   = computed(() => false);

  private userId: number | null = null;

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private cartService: CartService, private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id;
      this.isFavorite = this.favoritesService.isFavorite(this.card.id);
      this.isInCart   = this.cartService.isInCart(this.card.id);
    }
  }

  onToggleFavorite(): void {
    if (!this.userId) { alert('Debes iniciar sesión.'); return; }
    this.favoritesService.toggle(this.userId, this.card.id);
  }

  onAddToCart(): void {
    if (!this.userId) { alert('Debes iniciar sesión.'); return; }
    this.cartService.toggle(this.userId, this.card.id);
  }

 
goToDetail() {
  this.router.navigate(['/card', this.card.id]);
}

  get imageUrl(): string {
    if (!this.card.imageUrl) return 'assets/card-placeholder.png';
    if (
      this.card.imageUrl.endsWith('.png') ||
      this.card.imageUrl.endsWith('.jpg') ||
      this.card.imageUrl.endsWith('.webp')
    ) return this.card.imageUrl;
    return `${this.card.imageUrl}/high.webp`;
  }
}