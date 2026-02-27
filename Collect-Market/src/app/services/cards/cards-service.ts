import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CardsService {

  private apiUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

   getCards(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cards`);
  }

  getCardById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/cards/${id}`);
  }

  getCardsByRarity(rarity: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cards/rarity/${rarity}`);
  }

  searchCards(term: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/cards/search/${term}`);
  }
  
}
