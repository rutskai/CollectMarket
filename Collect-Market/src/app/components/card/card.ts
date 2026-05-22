import { Component, Input, OnInit, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModelCard } from '../../models/card';
import { AuthService } from '../../services/auth/auth-service';
import { CartService } from '../../services/cart/cart-service';
import { FavoritesService } from '../../services/favorite/favorites-service';
import { Router } from '@angular/router';
import { LoginModal } from '../login-modal/login-modal';
import { LoginModalService } from '../../services/login-modal/login-modal-service';

@Component({
  selector: 'app-card',
  imports: [CommonModule, LoginModal],
  templateUrl: './card.html',
  styleUrl: './card.css',
})
export class Card implements OnInit {

  @Input() card!: ModelCard;

  showLoginModal = false; 
  isFavorite: Signal<boolean> = computed(() => false);
  isInCart: Signal<boolean>   = computed(() => false);

  private userId: number | null = null;

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private cartService: CartService, 
    private router: Router,
     private modalService: LoginModalService
  ) {}


  /**
   * Inicializa los signals de favorito y carrito
   * si el usuario está autenticado.
   */
  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userId = user.id;
      this.isFavorite = this.favoritesService.isFavorite(this.card.id);
      this.isInCart   = this.cartService.isInCart(this.card.id);
    }
  }

    /**
   * Alterna el estado de favorito de la carta.
   *
   * Si el usuario no está autenticado abre el modal de login.
   */
  onToggleFavorite(): void {
  if (!this.userId) { this.modalService.open(); return; }
  this.favoritesService.toggle(this.userId, this.card.id);
}
  /**
   * Alterna el estado de la carta en el carrito.
   *
   * Si el usuario no está autenticado abre el modal de login.
   */

  onAddToCart(): void {
    if (!this.userId) { this.modalService.open(); return; }
    this.cartService.toggle(this.userId, this.card.id);
  }

  /**
   * Navega al detalle de la carta.
   */
goToDetail() {
  this.router.navigate(['/card', this.card.id]);
}

/**
   * Construye la URL de la imagen de la carta.
   *
   * Si no hay imagen devuelve el placeholder.
   * Si la URL no tiene extensión añade /high.webp.
   *
   * @returns URL de la imagen.
   */

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