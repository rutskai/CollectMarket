import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderPublic } from '../../models/order';


@Injectable({ providedIn: 'root' })
export class OrderService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  createOrder(order: OrderPublic): Observable<{ id: number; total: number; status: string }> {
    return this.http.post<{ id: number; total: number; status: string }>(`${this.apiUrl}/orders`, order);
  }

  getOrders(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/orders/${userId}`);
  }
}