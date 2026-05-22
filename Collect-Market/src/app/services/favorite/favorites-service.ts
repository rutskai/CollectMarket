import { Injectable, signal, computed, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ModelCard } from '../../models/card';

@Injectable({ providedIn: 'root' })
export class FavoritesService {

  private apiUrl = '/api';
  private favItems = signal<ModelCard[]>([]);

  readonly favIds = computed(() =>
    new Set(this.favItems().map(c => c.id))
  );

  constructor(private http: HttpClient) {}

  /**
   * Carga las cartas favoritas del usuario desde el servidor.
   *
   * @param userId ID del usuario.
   */
  load(userId: number): void {
    this.http.get<ModelCard[]>(`${this.apiUrl}/users/${userId}/favorites`)
      .subscribe(cards => this.favItems.set(cards));
  }

  /**
   * Devuelve un Signal que indica si una carta es favorita.
   *
   * @param cardId ID de la carta.
   *
   * @returns Signal booleano reactivo.
   */
  isFavorite(cardId: number): Signal<boolean> {
    return computed(() => this.favIds().has(cardId));
  }

  /**
   * Alterna el estado de favorito de una carta.
   *
   * Si la carta ya es favorita la elimina,
   * si no lo es la añade.
   *
   * @param userId ID del usuario.
   * @param cardId ID de la carta.
   */
  toggle(userId: number, cardId: number): void {
    if (this.favIds().has(cardId)) {
      this.http.delete<void>(`${this.apiUrl}/users/${userId}/favorites/${cardId}`)
        .subscribe(() => {
          this.favItems.update(cards => cards.filter(c => c.id !== cardId));
        });
    } else {
      this.http.get<ModelCard>(`${this.apiUrl}/cards/${cardId}`)
        .subscribe(card => {
          this.http.post<void>(`${this.apiUrl}/users/${userId}/favorites/${cardId}`, {})
            .subscribe(() => {
              this.favItems.update(cards => [...cards, card]);
            });
        });
    }
  }

  /**
   * Devuelve todas las cartas favoritas actuales.
   *
   * @returns Array de cartas favoritas.
   */
  getAll(): ModelCard[] {
    return this.favItems();
  }

  /**
   * Limpia la lista de favoritos local.
   *
   * Se usa al cerrar sesión.
   */
  clear(): void {
    this.favItems.set([]);
  }
}
