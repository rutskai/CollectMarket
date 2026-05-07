import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { ModelCard } from '../../models/card';
import { ModelCartItem } from '../../models/cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {

    private baseUrl = '/api/users';
 
  // BehaviorSubject para que cualquier componente pueda suscribirse al carrito
  private cartSubject = new BehaviorSubject<ModelCartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();
 
  constructor(private http: HttpClient) {}
 
  /**
   * Obtiene el carrito completo del usuario
   */
  getCart(userId: number): Observable<ModelCartItem[]> {
    return this.http.get<ModelCartItem[]>(`${this.baseUrl}/${userId}/cart`).pipe(
      tap(items => this.cartSubject.next(items))
    );
  }
 
  /**
   * Añade una carta al carrito (si ya existe, incrementa cantidad)
   */
  addToCart(userId: number, cardId: number): Observable<ModelCartItem> {
    return this.http.post<ModelCartItem>(`${this.baseUrl}/${userId}/cart/${cardId}`, {}).pipe(
      tap(() => this.getCart(userId).subscribe())
    );
  }
 
  /**
   * Actualiza la cantidad de una carta en el carrito
   */
  updateQuantity(userId: number, cardId: number, quantity: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}/${userId}/cart/${cardId}?quantity=${quantity}`, {}
    ).pipe(
      tap(() => this.getCart(userId).subscribe())
    );
  }
 
  /**
   * Elimina una carta del carrito
   */
  removeFromCart(userId: number, cardId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/cart/${cardId}`).pipe(
      tap(() => this.getCart(userId).subscribe())
    );
  }
 
  /**
   * Vacía el carrito completo
   */
  clearCart(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${userId}/cart`).pipe(
      tap(() => this.cartSubject.next([]))
    );
  }
 
  /**
   * Comprueba si una carta está en el carrito
   */
  checkInCart(userId: number, cardId: number): Observable<{ inCart: boolean; quantity: number }> {
    return this.http.get<{ inCart: boolean; quantity: number }>(
      `${this.baseUrl}/${userId}/cart/${cardId}/check`
    );
  }
 
  /**
   * Devuelve el número total de items en el carrito (para el badge del icono)
   */
  getTotalItems(): number {
    return this.cartSubject.value.reduce((acc, item) => acc + item.quantity, 0);
  }
 
  /**
   * Devuelve el precio total del carrito
   */
  getTotalPrice(): number {
    return this.cartSubject.value.reduce(
      (acc, item) => acc + item.card.price * item.quantity, 0
    );
  }
  
}
