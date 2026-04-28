import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModelCard } from '../../models/card';
import { ModelFilteredCards } from '../../models/filter';

@Injectable({
  providedIn: 'root',
})
export class CardsService {

  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

   getCards(): Observable<ModelCard[]> {
    return this.http.get<ModelCard[]>(`${this.apiUrl}/cards`);
  }

  getCardById(id: number): Observable<ModelCard> {
    return this.http.get<ModelCard>(`${this.apiUrl}/cards/${id}`);
  }

  getCardsByRarity(rarity: string): Observable<ModelCard[]> {
    return this.http.get<ModelCard[]>(`${this.apiUrl}/cards/rarity/${rarity}`);
  }

  searchCards(term: string): Observable<ModelCard[]> {
    return this.http.get<ModelCard[]>(`${this.apiUrl}/cards/search/${term}`);
  }

    getFilteredCards(filters: ModelFilteredCards): Observable<ModelCard[]> {
    let params = new HttpParams();

    filters.rarities?.forEach(r => params = params.append('rarity', r));
    filters.types?.forEach(t    => params = params.append('type', t));
    filters.setNames?.forEach(s => params = params.append('setName', s));

    if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice);

    return this.http.get<ModelCard[]>(`${this.apiUrl}/cards/filter`, { params });
  }

  getTypes(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/cards/types`);
  }
  getRarities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cards/rarities`);
  }
  getExpansions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cards/expansions`);
  }
  
}
