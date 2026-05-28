import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { CardsService } from '../../services/cards/cards-service';
import { AuthService } from '../../services/auth/auth-service';
import { ModelCard } from '../../models/card';
import { ImageHelper } from '../../helpers/image-helper';
import { TranslateHelper } from '../../helpers/translate-helper';
import { ConfirmModalService } from '../../services/confirm-modal/confirm-modal-service';
import { ConfirmModal } from '../../components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-my-cards-page',
  imports: [CommonModule, RouterLink, ConfirmModal],
  templateUrl: './my-cards-page.html',
  styleUrl: './my-cards-page.css',
})
export class MyCardsPage implements OnInit {

  ImageHelper = ImageHelper;
  TranslateHelper = TranslateHelper;

  myCards: ModelCard[] = [];
  loading = true;
  userId: number | null = null;
  private cardToDelete: number | null = null;

  constructor(
    private cardsService: CardsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public confirmModal: ConfirmModalService
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id;
      this.loadUserCards();
      this.cdr.detectChanges();
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
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar tus cartas:', err);
        this.loading = false;
      }
    });
  }

deleteCard(cardId: number): void {
  this.cardToDelete = cardId;
  this.confirmModal.open();
}

  onConfirmDelete(): void {
  if (this.cardToDelete) {
    this.cardsService.deleteCard(this.cardToDelete).subscribe({
      next: () => {
        this.myCards = this.myCards.filter(card => card.id !== this.cardToDelete);
        this.cardToDelete = null;
        this.confirmModal.close();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        alert('No se pudo eliminar la carta.');
        this.cardToDelete = null;
        this.confirmModal.close();
      }
    });
  }
}


  goToCard(cardId: number): void {
    this.router.navigate(['/card', cardId]);
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}