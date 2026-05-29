import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { CartService } from '../../services/cart/cart-service';
import { ModelUser } from '../../models/user';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModelCartItem } from '../../models/cart';
import { ImageHelper } from '../../helpers/image-helper';
import { EXPANSION_TRANSLATION, RARITY_TRANSLATION } from '../../helpers/constants';
import { TranslateHelper } from '../../helpers/translate-helper';

/**
 * Componente de la página del carrito de compras.
 * 
 * Muestra todos los items añadidos al carrito del usuario,
 * permite actualizar cantidades, eliminar items y vaciar el carrito.
 */
@Component({
  selector: 'app-shopping-cart-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart-page.html',
  styleUrl: './shopping-cart-page.css',
})
export class ShoppingCartPage implements OnInit {

  user: ModelUser | null = null;
  TranslateHelper = TranslateHelper;
  ImageHelper = ImageHelper;

  /**
   * Constructor del componente ShoppingCartPage.
   * 
   * @param cartService - Servicio de gestión del carrito
   * @param authService - Servicio de autenticación
   */
  constructor(
    private cartService: CartService,
    private authService: AuthService,
  ) {}

  /**
   * Inicializa el componente al cargarse.
   * 
   * Se suscribe al estado del usuario autenticado y carga su carrito.
   */
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.cartService.load(user.id);  // ← carga los datos al entrar
      }
    });
  }

  get cartItems()  { return this.cartService.cartItems(); }
  get totalItems() { return this.cartService.totalItems(); }
  get totalPrice() { return this.cartService.totalPrice(); }

  /**
   * Actualiza la cantidad de un item en el carrito.
   * 
   * @param item - Item del carrito a actualizar
   * @param quantity - Nueva cantidad (si es 0 o menor, elimina el item)
   */
  onUpdateQuantity(item: ModelCartItem, quantity: number): void {
    if (!this.user) return;
    if (quantity <= 0) {
      this.cartService.toggle(this.user.id, item.cardId);
    } else {
      this.cartService.updateQuantity(this.user.id, item.cardId, quantity);
    }
  }

  /**
   * Elimina un item del carrito.
   * 
   * @param item - Item del carrito a eliminar
   */
  onRemoveItem(item: ModelCartItem): void {
    if (!this.user) return;
    this.cartService.toggle(this.user.id, item.cardId);
  }

  /** Vacía completamente el carrito del usuario. */
  onClearCart(): void {
    if (!this.user) return;
    this.cartService.clearCart(this.user.id);
  }

  /**
   * Obtiene la rareza traducida de una carta.
   * 
   * @param item - Item del carrito que contiene la carta
   * @returns Rareza traducida al español
   */
  getTranslatedRarity(item: ModelCartItem): string {
    const rarity = item.card?.rarity;
    return RARITY_TRANSLATION[rarity ?? ''] ?? rarity ?? 'Rareza desconocida';
  }

  /**
   * Obtiene la expansión traducida de una carta.
   * 
   * @param item - Item del carrito que contiene la carta
   * @returns Expansión traducida al español
   */
  getTranslatedExpansion(item: ModelCartItem): string {
    const expansion = item.card?.setName;
    return EXPANSION_TRANSLATION[expansion ?? ''] ?? expansion ?? 'Expansión desconocida';
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