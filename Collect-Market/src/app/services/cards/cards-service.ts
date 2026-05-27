import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModelCard, ModelCardPublic } from '../../models/card';
import { ModelFilteredCards } from '../../models/filter';

@Injectable({
  providedIn: 'root',
})
export class CardsService {

  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

   /**
   * Obtiene todas las cartas disponibles.
   *
   * @returns Observable con la lista de cartas.
   */
   getCards(): Observable<ModelCard[]> {
    return this.http.get<ModelCard[]>(`${this.apiUrl}/cards`);
  }

  /**
   * Obtiene una carta por su ID.
   *
   * @param id ID de la carta.
   *
   * @returns Observable con los datos de la carta.
   */
  getCardById(id: number): Observable<ModelCard> {
    return this.http.get<ModelCard>(`${this.apiUrl}/cards/${id}`);
  }

   /**
   * Obtiene cartas filtradas por rareza.
   *
   * @param rarity Rareza de las cartas.
   *
   * @returns Observable con las cartas encontradas.
   */
  getCardsByRarity(rarity: string): Observable<ModelCard[]> {
    return this.http.get<ModelCard[]>(`${this.apiUrl}/cards/rarity/${rarity}`);
  }

  /**
   * Busca cartas por nombre o expansión.
   *
   * @param term Texto de búsqueda.
   *
   * @returns Observable con las cartas coincidentes.
   */
  searchCards(term: string): Observable<ModelCard[]> {
    return this.http.get<ModelCard[]>(`${this.apiUrl}/cards/search/${term}`);
  }

  /**
   * Filtra cartas usando múltiples criterios. Estos son:
   *
   * - rarezas
   * - tipos
   * - nombres del set
   * - precio mínimo
   * - precio máximo
   *
   * @param filters Objeto con los filtros a aplicar.
   *
   * @returns Observable con las cartas filtradas.
   */

    getFilteredCards(filters: ModelFilteredCards): Observable<ModelCard[]> {
    let params = new HttpParams();

    filters.rarities?.forEach(r => params = params.append('rarity', r));
    filters.types?.forEach(t    => params = params.append('type', t));
    filters.setNames?.forEach(s => params = params.append('setName', s));

    if (filters.minPrice != null) params = params.set('minPrice', filters.minPrice);
    if (filters.maxPrice != null) params = params.set('maxPrice', filters.maxPrice);

    return this.http.get<ModelCard[]>(`${this.apiUrl}/cards/filter`, { params });
  }

   /**
   * Obtiene todos los tipos de cartas disponibles.
   *
   * @returns Observable con la lista de tipos.
   */

  getTypes(): Observable<string[]> {
  return this.http.get<string[]>(`${this.apiUrl}/cards/types`);
  }

    /**
   * Obtiene todas las rarezas disponibles.
   *
   * @returns Observable con la lista de rarezas.
   */
  getRarities(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cards/rarities`);
  }

  /**
   * Obtiene todas las expansiones disponibles.
   *
   * @returns Observable con la lista de expansiones.
   */
  getExpansions(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/cards/expansions`);
  }

  /**
   * Crea una nueva carta (para vender).
   *
   * @param card Datos de la carta a crear.
   *
   * @returns Observable con el ID, nombre y mensaje de la carta creada.
   */
  createCard(card: ModelCardPublic): Observable<{ id: number; name: string; message: string }> {
    return this.http.post<{ id: number; name: string; message: string }>(
      `${this.apiUrl}/cards`, 
      card
    );
  }

  /**
   * Obtiene las cartas a la venta de un usuario específico.
   *
   * @param userId ID del usuario vendedor.
   *
   * @returns Observable con la lista de cartas del usuario.
   */
  getUserCards(userId: number): Observable<ModelCard[]> {
    return this.http.get<ModelCard[]>(`${this.apiUrl}/cards/user/${userId}`);
  }

  /**
   * Elimina una carta (solo el propietario puede ).
   *
   * @param cardId ID de la carta a eliminar.
   *
   * @returns Observable con mensaje de confirmación.
   */
  deleteCard(cardId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/cards/${cardId}`);
  }
  
}
