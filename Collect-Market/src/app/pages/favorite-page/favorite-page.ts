import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { FavoritesService } from '../../services/favorites-service';
import { CartService } from '../../services/cart/cart-service';
import { ModelCard } from '../../models/card';
import { ModelUser } from '../../models/user';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorite-page',
  imports: [CommonModule, Card, RouterLink],
  templateUrl: './favorite-page.html',
  styleUrl: './favorite-page.css',
})
export class FavoritePage implements OnInit {

  favCards: ModelCard[] = [];
  cartIds = new Set<number>();
  user: ModelUser | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadFavorites(user.id);
        this.loadCart(user.id);
      }
    });
  }

  loadFavorites(userId: number): void {
    this.favoritesService.getFavorites(userId).subscribe(cards => {
      this.favCards = cards;
      this.cdr.detectChanges();
    });
  }

  loadCart(userId: number): void {
    this.cartService.getCart(userId).subscribe(items => {
      this.cartIds = new Set(items.map(i => i.cardId));
      this.cdr.detectChanges();
    });
  }

  onToggleFavorite(card: ModelCard): void {
    if (!this.user) return;
    this.favoritesService.removeFavorite(this.user.id, card.id).subscribe(() => {
      this.favCards = this.favCards.filter(c => c.id !== card.id);
      this.cdr.detectChanges();
    });
  }

  onAddToCart(card: ModelCard): void {
    if (!this.user) return;
    if (this.cartIds.has(card.id)) return;
    this.cartService.addToCart(this.user.id, card.id).subscribe(() => {
      this.cartIds.add(card.id);
      this.cdr.detectChanges();
    });
  }

  getTotalValue(): number {
    return this.favCards.reduce((acc, card) => acc + card.price, 0);
  }
}