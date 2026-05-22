import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelCartItem } from '../../models/cart';

@Injectable({ providedIn: 'root' })
export class CartService {

  private baseUrl = '/api/users';

  readonly cartItems  = signal<ModelCartItem[]>([]);
  readonly totalItems = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );
  readonly totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.card.price * item.quantity, 0)
  );
  readonly cartIds    = computed(() =>
    new Set(this.cartItems().map(i => i.cardId))
  );

  constructor(private http: HttpClient) {}

   /**
   * Carga los items del carrito del usuario desde el servidor.
   *
   * @param userId ID del usuario.
   */
  load(userId: number): void {
    this.http.get<ModelCartItem[]>(`${this.baseUrl}/${userId}/cart`)
      .subscribe(items => this.cartItems.set(items));
  }

   /**
   * Devuelve un Signal que indica si una carta está en el carrito.
   *
   * @param cardId ID de la carta.
   *
   * @returns Signal booleano reactivo.
   */

  isInCart(cardId: number) {
    return computed(() => this.cartIds().has(cardId));
  }

    /**
   * Alterna el estado de una carta en el carrito.
   *
   * Si la carta ya está en el carrito la elimina,
   * si no lo está la añade.
   *
   * @param userId ID del usuario.
   * @param cardId ID de la carta.
   */

  toggle(userId: number, cardId: number): void {
    if (this.cartIds().has(cardId)) {
      this.http.delete<void>(`${this.baseUrl}/${userId}/cart/${cardId}`)
        .subscribe(() => {
          this.cartItems.update(items => items.filter(i => i.cardId !== cardId));
        });
    } else {
      this.http.post<ModelCartItem>(`${this.baseUrl}/${userId}/cart/${cardId}`, {})
        .subscribe(newItem => {
          this.cartItems.update(items => [...items, newItem]);
        });
    }
  }

    /**
   * Actualiza la cantidad de una carta en el carrito.
   *
   * @param userId ID del usuario.
   * @param cardId ID de la carta.
   * @param quantity Nueva cantidad.
   */

  updateQuantity(userId: number, cardId: number, quantity: number): void {
    this.http.put<void>(`${this.baseUrl}/${userId}/cart/${cardId}?quantity=${quantity}`, {})
      .subscribe(() => {
        this.cartItems.update(items =>
          items.map(i => i.cardId === cardId ? { ...i, quantity } : i)
        );
      });
  }

   /**
   * Elimina todos los items del carrito del usuario.
   *
   * Llama al servidor y limpia el estado local.
   *
   * @param userId ID del usuario.
   */

  clearCart(userId: number): void {
    this.http.delete<void>(`${this.baseUrl}/${userId}/cart`)
      .subscribe(() => this.cartItems.set([]));
  }

   /**
   * Limpia el carrito localmente sin llamar al servidor.
   *
   * Se usa al cerrar sesión.
   */

  clear(): void {
    this.cartItems.set([]);
  }
}