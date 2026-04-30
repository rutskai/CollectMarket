import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { FavoritesService } from '../../services/favorites-service';
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
export class FavoritePage {

    favCards: ModelCard[] = [];
  user: ModelUser | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadFavorites(user.id);
      }
    });
  }

  loadFavorites(userId: number): void {
    this.favoritesService.getFavorites(userId).subscribe(cards => {
      this.favCards = cards;
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
    console.log('Added to cart:', card);
  }

}
