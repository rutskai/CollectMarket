import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CardsService } from '../../services/cards/cards-service';
import { AuthService } from '../../services/auth/auth-service';
import { ModelCard } from '../../models/card';
import { ImageHelper } from '../../helpers/image-helper';
import { TranslateHelper } from '../../helpers/translate-helper';

@Component({
  selector: 'app-my-cards-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-cards-page.html',
  styleUrl: './my-cards-page.css',
})
export class MyCardsPage implements OnInit {
  
  ImageHelper = ImageHelper;
  TranslateHelper = TranslateHelper;
  
  myCards: ModelCard[] = [];
  loading = true;
  userId: number | null = null;
  
  constructor(
    private cardsService: CardsService,
    private authService: AuthService
  ) {}
  
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id;
      this.loadUserCards();
    } else {
      this.loading = false;
    }
  }
  
  loadUserCards(): void {
    if (!this.userId) return;
    
    this.loading = true;
    this.cardsService.getUserCards(this.userId).subscribe({
      next: (cards) => {
        this.myCards = cards;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar tus cartas:', err);
        this.loading = false;
      }
    });
  }
  
  deleteCard(cardId: number): void {
    if (!confirm('¿Estás seguro de que quieres eliminar esta carta?')) {
      return;
    }
    
    this.cardsService.deleteCard(cardId).subscribe({
      next: () => {
        this.myCards = this.myCards.filter(card => card.id !== cardId);
      },
      error: (err) => {
        console.error('Error al eliminar la carta:', err);
        alert('No se pudo eliminar la carta. Inténtalo de nuevo.');
      }
    });
  }
  
  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}