import { ChangeDetectorRef, Component, OnInit, Signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ModelCard } from '../../models/card';
import { CardsService } from '../../services/cards/cards-service';
import { CartService } from '../../services/cart/cart-service';
import { FavoritesService } from '../../services/favorite/favorites-service';
import { AuthService } from '../../services/auth/auth-service';
import { ImageHelper } from '../../helpers/image-helper';
import { EXPANSION_TRANSLATION, RARITY_TRANSLATION, TYPE_TRANSLATION } from '../../helpers/constants';
import { UserService } from '../../services/user/user-service';
import { TranslateHelper } from '../../helpers/translate-helper';

/**
 * Componente de la página de detalle de una carta.
 * 
 * Muestra toda la información de una carta específica,
 * incluyendo el vendedor, y permite añadirla a favoritos o al carrito.
 */
@Component({
  selector: 'app-detail-card-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './detail-card-page.html',
  styleUrl: './detail-card-page.css',
})
export class DetailCardPage implements OnInit {

  TranslateHelper = TranslateHelper; 
  ImageHelper = ImageHelper;
  card: ModelCard | null = null;
  loading = true;
  userId: number | null = null;
  sellerName: string | null = null; 
  isFavorite: Signal<boolean> = computed(() => false);
  isInCart: Signal<boolean> = computed(() => false);

  /**
   * Constructor del componente DetailCardPage.
   * 
   * @param route - Servicio para acceder a los parámetros de la ruta
   * @param cardsService - Servicio de gestión de cartas
   * @param cartService - Servicio de gestión del carrito
   * @param favoritesService - Servicio de gestión de favoritos
   * @param authService - Servicio de autenticación
   * @param cdr - Detector de cambios para actualizaciones manuales
   * @param userService - Servicio de gestión de usuarios
   */
  constructor(
    private route: ActivatedRoute,
    private cardsService: CardsService,
    private cartService: CartService,
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private userService: UserService,
  ) {}

  /**
   * Inicializa el componente al cargarse.
   * 
   * Obtiene el ID de la carta desde la ruta, carga sus datos,
   * y si hay usuario autenticado carga también el estado de favorito y carrito.
   */
  ngOnInit(): void {
    this.userId = this.authService.getCurrentUser()?.id ?? null;

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.cardsService.getCardById(id).subscribe({
      next: (card) => {
        this.card = card;
        this.loading = false;
        
        if (card.sellerId) {
          this.userService.getUserById(card.sellerId).subscribe({
            next: (user) => {
              this.sellerName = user?.name || 'Vendedor desconocido';
              this.cdr.detectChanges();
            },
            error: () => {
              this.sellerName = 'Vendedor desconocido';
            }
          });
        } else {
          this.sellerName = 'CollectMarket';
        }
        
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

  /**
   * Alterna el estado de favorito de la carta.
   * 
   * Si el usuario no está autenticado muestra una alerta.
   */
  toggleFavorite(): void {
    if (!this.userId || !this.card) {
      alert('Debes iniciar sesión.');
      return;
    }
    this.favoritesService.toggle(this.userId, this.card.id);
  }

  /**
   * Añade o elimina la carta del carrito.
   * 
   * Si el usuario no está autenticado muestra una alerta.
   */
  addToCart(): void {
    if (!this.userId || !this.card) {
      alert('Debes iniciar sesión.');
      return;
    }
    this.cartService.toggle(this.userId, this.card.id);
  }

  /**
   * Obtiene la clase CSS correspondiente a la rareza de la carta.
   * 
   * @param rarity - Rareza de la carta
   * @returns Clase CSS para el badge
   */
  getRarityClass(rarity?: string): string {
    const map: Record<string, string> = {
      'Ultra Rare': 'badge-ultra',
      Secret: 'badge-secret',
      Rare: 'badge-rare',
      Common: 'badge-common',
    };
    return map[rarity ?? ''] ?? 'badge-common';
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