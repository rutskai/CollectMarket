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

/**
 * Componente de la página de cartas del usuario.
 * 
 * Muestra todas las cartas que el usuario ha publicado para la venta,
 * permitiendo eliminar cartas existentes.
 */
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

  /**
   * Constructor del componente.
   * 
   * @param cardsService - Servicio de gestión de cartas
   * @param authService - Servicio de autenticación
   * @param cdr - Detector de cambios para actualizaciones manuales
   * @param router - Enrutador para navegación
   * @param confirmModal - Servicio para controlar el modal de confirmación
   */
  constructor(
    private cardsService: CardsService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    public confirmModal: ConfirmModalService
  ) { }

  /**
   * Inicializa el componente al cargarse.
   * 
   * Obtiene el usuario autenticado y carga sus cartas.
   */
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

  /**
   * Carga las cartas publicadas por el usuario desde el backend.
   */
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

  /**
   * Solicita confirmación para eliminar una carta.
   * 
   * @param cardId - ID de la carta a eliminar
   */
  deleteCard(cardId: number): void {
    this.cardToDelete = cardId;
    this.confirmModal.open();
  }

  /**
   * Elimina la carta tras la confirmación del usuario.
   */
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

  /**
   * Navega a la página de detalle de una carta.
   * 
   * @param cardId - ID de la carta
   */
  goToCard(cardId: number): void {
    this.router.navigate(['/card', cardId]);
  }

  /**
   * Formatea un precio para mostrarlo con dos decimales y el símbolo de euro.
   * 
   * @param price - Precio a formatear
   * @returns String con el precio formateado
   */
  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}