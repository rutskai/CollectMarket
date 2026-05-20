import { ChangeDetectorRef, Component, OnInit, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ModelCard } from '../../models/card';
import { CardsService } from '../../services/cards/cards-service';
import { CartService } from '../../services/cart/cart-service';
import { FavoritesService } from '../../services/favorite/favorites-service';


@Component({
  selector: 'app-detail-card-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-card-page.html',
  styleUrl: './detail-card-page.css',
})
export class DetailCardPage implements OnInit {
  card: ModelCard | null = null;
  loading = true;
  userId: number | null = null;

  isFavorite: Signal<boolean> = computed(() => false);
  isInCart: Signal<boolean> = computed(() => false);

  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cardsService.getCardById(id).subscribe({
      next: (card) => {
        this.card = card;
        this.loading = false;
        if (this.userId) {
          this.isFavorite = this.favoritesService.isFavorite(card.id);
          this.isInCart = this.cartService.isInCart(card.id);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  toggleFavorite(): void {
    if (!this.userId || !this.card) {
      alert('Debes iniciar sesión.');
      return;
    }
    this.favoritesService.toggle(this.userId, this.card.id);
  }

  addToCart(): void {
    if (!this.userId || !this.card) {
      alert('Debes iniciar sesión.');
      return;
    }
    this.cartService.toggle(this.userId, this.card.id);
  }

  get imageUrl(): string {
    if (!this.card?.imageUrl) return 'assets/card-placeholder.png';
    if (
      this.card.imageUrl.endsWith('.png') ||
      this.card.imageUrl.endsWith('.jpg') ||
      this.card.imageUrl.endsWith('.webp')
    )
      return this.card.imageUrl;
    return `${this.card.imageUrl}/high.webp`;
  }

  getRarityClass(rarity?: string): string {
    const map: Record<string, string> = {
      'Ultra Rare': 'badge-ultra',
      Secret: 'badge-secret',
      Rare: 'badge-rare',
      Common: 'badge-common',
    };
    return map[rarity ?? ''] ?? 'badge-common';
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}
