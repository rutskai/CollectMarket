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

  load(userId: number): void {
    this.http.get<ModelCard[]>(`${this.apiUrl}/users/${userId}/favorites`)
      .subscribe(cards => this.favItems.set(cards));
  }

 isFavorite(cardId: number): Signal<boolean> {
  return computed(() => this.favIds().has(cardId));
}

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

  getAll(): ModelCard[] {
    return this.favItems();
  }

  clear(): void {
    this.favItems.set([]);
  }
}