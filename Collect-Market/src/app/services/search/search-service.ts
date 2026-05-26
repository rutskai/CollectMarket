import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SearchService {
 
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm = this.searchTermSubject.asObservable();

  /**
   * Actualiza el término de búsqueda y notifica a los suscriptores.
   * 
   * @param term Nuevo término de búsqueda
   */
  setSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }

  /**
   * Obtiene el término de búsqueda actual.
   * 
   * @returns string Término de búsqueda actual
   */
  getSearchTerm(): string {
    return this.searchTermSubject.value;
  }

  /**
   * Limpia el término de búsqueda.
   */
  clearSearch(): void {
    this.searchTermSubject.next('');
  }
}