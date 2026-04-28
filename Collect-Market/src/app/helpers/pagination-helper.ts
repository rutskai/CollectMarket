import { ModelCard } from '../models/card';
import { ModelPagination } from '../models/pagination';

export class PaginationHelper {
  /**
   * Pagina un array de cartas
   * @param cards - Array de cartas a paginar
   * @param currentPage - Página actual (empieza en 1)
   * @param itemsPerPage - Cantidad de cartas por página (default: 12)
   * @returns Objeto ModelPagination con los datos paginados
   */
  static paginate(
    cards: ModelCard[],
    currentPage: number,
    itemsPerPage: number = 12
  ): ModelPagination {
    const totalItems = cards.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    let validPage = currentPage;
    if (validPage < 1) validPage = 1;
    if (validPage > totalPages && totalPages > 0) validPage = totalPages;
    if (totalPages === 0) validPage = 1;
    
    const startIndex = (validPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const itemsForThisPage = cards.slice(startIndex, endIndex);
    
    return {
      items: itemsForThisPage,
      currentPage: validPage,
      totalPages: totalPages,
      totalItems: totalItems,
      itemsPerPage: itemsPerPage,
      hasNext: validPage < totalPages,
      hasPrev: validPage > 1
    };
  }

  /**
   * Obtiene los números de página visibles para la paginación
   * @param currentPage - Página actual
   * @param totalPages - Total de páginas
   * @param maxVisible - Máximo de números visibles (default: 5)
   * @returns Array con los números de página a mostrar
   */
  static getVisiblePages(
    currentPage: number,
    totalPages: number,
    maxVisible: number = 5
  ): number[] {
    if (totalPages <= maxVisible) {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }
    
    const half = Math.floor(maxVisible / 2);
    let start = currentPage - half;
    let end = currentPage + half;
    
    if (start < 1) {
      start = 1;
      end = maxVisible;
    }
    
    if (end > totalPages) {
      end = totalPages;
      start = totalPages - maxVisible + 1;
    }
    
    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  /**
   * Cambia a la página siguiente si existe
   * @param pagination - Objeto de paginación actual
   * @returns Nueva página o la misma si no hay siguiente
   */
  static nextPage(pagination: ModelPagination): number {
    if (pagination.hasNext) {
      return pagination.currentPage + 1;
    }
    return pagination.currentPage;
  }

  /**
   * Cambia a la página anterior si existe
   * @param pagination - Objeto de paginación actual
   * @returns Nueva página o la misma si no hay anterior
   */
  static prevPage(pagination: ModelPagination): number {
    if (pagination.hasPrev) {
      return pagination.currentPage - 1;
    }
    return pagination.currentPage;
  }
}