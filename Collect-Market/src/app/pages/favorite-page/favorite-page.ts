import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { FavoritesService } from '../../services/favorite/favorites-service';
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

  user: ModelUser | null = null;

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  // Lee directamente del Signal del servicio
  get favCards() { return this.favoritesService.getAll(); }

  getTotalValue(): number {
    return this.favCards.reduce((acc, card) => acc + card.price, 0);
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}