import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CardsService } from '../../services/cards/cards-service';
import { CartService } from '../../services/cart/cart-service';
import { FavoritesService } from '../../services/favorites-service';
import { AuthService } from '../../services/auth/auth-service';
import { Card } from '../../components/card/card';
import { RouterLink } from '@angular/router';
import { ModelCard } from '../../models/card';
declare var $: any;

@Component({
  selector: 'app-home-page',
  imports: [CommonModule, RouterLink, Card],
  templateUrl: './home-page.html',
  styleUrl: './home-page.css',
})
export class HomePage implements OnInit {

  cards: ModelCard[] = [];
  latestCards: ModelCard[] = [];
  favoritesIds = new Set<number>();
  cartIds = new Set<number>();
  userId: number | null = null;

  constructor(
    private cardService: CardsService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    $('#home').vide({ mp4: 'video/poke-center.gif' });
    this.loadCards();

    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      if (user) {
        this.userId = user.id;
        this.loadFavorites();
        this.loadCart();
      }
    }
  }

  loadCards(): void {
    this.cardService.getCards().subscribe({
      next: (data) => {
        const shuffled = [...data].sort(() => 0.6 - Math.random());
        this.cards = shuffled.slice(0, 3);
        this.latestCards = data.slice(0, 5); // últimas 6 cartas
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando cartas:', err)
    });
  }

  loadFavorites(): void {
    if (this.userId === null) return;
    this.favoritesService.getFavorites(this.userId).subscribe(favCards => {
      this.favoritesIds = new Set(favCards.map(c => c.id));
      this.cdr.detectChanges();
    });
  }

  loadCart(): void {
    if (this.userId === null) return;
    this.cartService.getCart(this.userId).subscribe(items => {
      this.cartIds = new Set(items.map(i => i.cardId));
      this.cdr.detectChanges();
    });
  }

  onToggleFavorite(card: ModelCard): void {
    if (!this.authService.isLoggedIn() || this.userId === null) {
      alert('Debes iniciar sesión para agregar a favoritos.');
      return;
    }
    if (this.favoritesIds.has(card.id)) {
      this.favoritesService.removeFavorite(this.userId, card.id).subscribe(() => {
        this.favoritesIds.delete(card.id);
        this.cdr.detectChanges();
      });
    } else {
      this.favoritesService.addFavorite(this.userId, card.id).subscribe(() => {
        this.favoritesIds.add(card.id);
        this.cdr.detectChanges();
      });
    }
  }

  onAddToCart(card: ModelCard): void {
    if (!this.authService.isLoggedIn() || this.userId === null) {
      alert('Debes iniciar sesión para añadir al carrito.');
      return;
    }
    if (this.cartIds.has(card.id)) {
      this.cartService.removeFromCart(this.userId, card.id).subscribe(() => {
        this.cartIds.delete(card.id);
        this.cdr.detectChanges();
      });
    } else {
      this.cartService.addToCart(this.userId, card.id).subscribe(() => {
        this.cartIds.add(card.id);
        this.cdr.detectChanges();
      });
    }
  }

  getImageUrl(card: ModelCard): string {
    if (!card.imageUrl) return 'assets/card-placeholder.png';
    if (card.imageUrl.endsWith('.png') ||
        card.imageUrl.endsWith('.jpg') ||
        card.imageUrl.endsWith('.webp')) {
      return card.imageUrl;
    }
    return `${card.imageUrl}/low.webp`;
  }
}