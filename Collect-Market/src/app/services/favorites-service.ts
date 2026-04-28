import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModelCard } from '../models/card';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {

  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  // GET - Todas las cartas favoritas del usuario
  getFavorites(userId: number): Observable<ModelCard[]> {
    return this.http.get<ModelCard[]>(`${this.apiUrl}/users/${userId}/favorites`);
  }

  // POST - Añadir favorito
  addFavorite(userId: number, cardId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/users/${userId}/favorites/${cardId}`, {});
  }

  // DELETE - Quitar favorito
  removeFavorite(userId: number, cardId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}/favorites/${cardId}`);
  }

  // GET - Comprobar si una carta es favorita
  isFavorite(userId: number, cardId: number): Observable<{ isFavorite: boolean }> {
    return this.http.get<{ isFavorite: boolean }>(`${this.apiUrl}/users/${userId}/favorites/${cardId}/check`);
  }

  
}
