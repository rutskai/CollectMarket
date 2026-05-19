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

  load(userId: number): void {
    this.http.get<ModelCartItem[]>(`${this.baseUrl}/${userId}/cart`)
      .subscribe(items => this.cartItems.set(items));
  }

  isInCart(cardId: number) {
    return computed(() => this.cartIds().has(cardId));
  }

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

  updateQuantity(userId: number, cardId: number, quantity: number): void {
    this.http.put<void>(`${this.baseUrl}/${userId}/cart/${cardId}?quantity=${quantity}`, {})
      .subscribe(() => {
        this.cartItems.update(items =>
          items.map(i => i.cardId === cardId ? { ...i, quantity } : i)
        );
      });
  }

  clearCart(userId: number): void {
    this.http.delete<void>(`${this.baseUrl}/${userId}/cart`)
      .subscribe(() => this.cartItems.set([]));
  }

  clear(): void {
    this.cartItems.set([]);
  }
}