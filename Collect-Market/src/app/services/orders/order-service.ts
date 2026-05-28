import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order, OrderPublic } from '../../models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {

  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  /**
   * Crea un nuevo pedido.
   *
   * Envía los datos del pedido al servidor
   * y devuelve el ID, total y estado del pedido creado.
   *
   * @param order Datos del pedido a crear.
   *
   * @returns Observable con el ID, total y estado del pedido.
   */
  createOrder(order: OrderPublic): Observable<{ id: number; total: number; status: string }> {
    return this.http.post<{ id: number; total: number; status: string }>(`${this.apiUrl}/orders`, order);
  }

  /**
   * Obtiene los pedidos de un usuario.
   *
   * @param userId ID del usuario.
   *
   * @returns Observable con la lista de pedidos.
   */
  getOrders(userId: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/${userId}`);
  }
}