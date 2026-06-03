import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs'; 
import { ModelCard } from '../../models/card';
import { Card } from '../../components/card/card';
import { CardsService } from '../../services/cards/cards-service';
import { Filter, ModelFilteredCards } from '../../models/filter';
import { PaginationHelper } from '../../helpers/pagination-helper';
import { SearchService } from '../../services/search/search-service'; 
import { TYPE_TRANSLATION, RARITY_TRANSLATION, EXPANSION_TRANSLATION } from '../../helpers/constants';
import { TranslateHelper } from '../../helpers/translate-helper';

/**
 * Componente de la página de tienda.
 * 
 * Muestra el catálogo de cartas con filtros por tipo, rareza y expansión,
 * paginación y búsqueda integrada.
 */
@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Card],
  templateUrl: './shop-page.html',
  styleUrls: ['./shop-page.css']
})
export class ShopPage implements OnInit, OnDestroy {  

  TranslateHelper = TranslateHelper;


  selectedPrice = 0;
  maxPriceLimit = 0;
  
  allSourceCards: ModelCard[] = [];
  allCards: ModelCard[] = [];
  displayCards: ModelCard[] = [];

  /** paginación */
  currentPage = 1;
  itemsPerPage = 14;
  totalPages = 1;

  typeFilters: Filter[] = [];
  rarityFilters: Filter[] = [];
  expansionFilters: Filter[] = [];
  searchTerm: string = '';
  private searchSubscription: Subscription | null = null;

  /**
   * Constructor del componente ShopPage.
   * 
   * @param cardsService - Servicio de gestión de cartas
   * @param cdr - Detector de cambios para actualizaciones manuales
   * @param route - Servicio para acceder a los parámetros de la ruta
   * @param router - Enrutador para navegación
   * @param searchService - Servicio de búsqueda compartido
   */
  constructor(
    private cardsService: CardsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService  
  ) {}

  /**
   * Inicializa el componente al cargarse.
   * 
   * Escucha los parámetros de la ruta para la búsqueda,
   * se suscribe al servicio de búsqueda y carga las opciones de filtros.
   */
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchTerm = params['search'] || '';
      this.loadCards();
    });
    
    this.searchSubscription = this.searchService.searchTerm.subscribe(term => {
      if (term && term !== this.searchTerm) {
        this.searchTerm = term;
        this.router.navigate(['/shop'], { 
          queryParams: { search: term } 
        });
      }
    });
    
    this.loadFilterOptions();
    this.loadMaxPriceLimit();  
  }

  /**
   * Carga el precio máximo de las cartas desde el servidor.
   */
  loadMaxPriceLimit(): void {
    this.cardsService.getMaxPrice().subscribe({
      next: (maxPrice) => {
        this.maxPriceLimit = maxPrice;
         this.selectedPrice = 0;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error cargando precio máximo:', err)
    });
  }

  /**
   * Limpia la suscripción al servicio de búsqueda al destruir el componente.
   */
  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  /**
   * Carga todas las cartas desde el servidor.
   */
  loadCards(): void {
    this.cardsService.getCards().subscribe({
      next: (cards) => {
        this.allSourceCards = cards;
        this.applySearchFilter(cards); 
      },
      error: (err) => console.error('Error cargando cartas:', err)
    });
  }

  /**
   * Aplica el filtro de búsqueda por texto a las cartas.
   * 
   * @param cards - Array de cartas a filtrar
   */
  private applySearchFilter(cards: ModelCard[]): void {
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      this.allCards = cards.filter(card => 
        card.name.toLowerCase().includes(term) ||
        (card.setName && card.setName.toLowerCase().includes(term))
      );
    } else {
      this.allCards = cards;
    }
    
    this.resetPageAndUpdate();
  }

  /**
   * Limpia el término de búsqueda y recarga la tienda.
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.clearSearch(); 
    this.router.navigate(['/shop'], { queryParams: {} });
    this.loadCards();  
  }

  /**
   * Vuelve a la tienda limpiando la búsqueda.
   */
  backToShop(): void {
    this.clearSearch();
  }

  /**
   * Actualiza las cartas mostradas según la página actual.
   */
  updateDisplayCards(): void {
    const pagination = PaginationHelper.paginate(this.allCards, this.currentPage, this.itemsPerPage);
    this.displayCards = pagination.items;
    this.totalPages = pagination.totalPages;
    this.currentPage = pagination.currentPage;
    this.cdr.detectChanges();
  }

  /**
   * Cambia a una página específica.
   * 
   * @param page - Número de página a la que navegar
   */
  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayCards();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** Avanza a la página siguiente. */
  nextPage(): void { this.changePage(this.currentPage + 1); }
  
  /** Retrocede a la página anterior. */
  prevPage(): void { this.changePage(this.currentPage - 1); }

  /**
   * Obtiene los números de página visibles en la paginación.
   * 
   * @returns Array con los números de página a mostrar
   */
  getVisiblePages(): number[] {
    return PaginationHelper.getVisiblePages(this.currentPage, this.totalPages);
  }

  /** Resetea la página a 1 y actualiza las cartas mostradas. */
  private resetPageAndUpdate(): void {
    this.currentPage = 1;
    this.updateDisplayCards();
  }

  /** Alterna el estado activo de un filtro de tipo. */
  toggleType(filter: Filter): void      { filter.active = !filter.active; this.applyFilters(); }
  toggleRarity(filter: Filter): void    { filter.active = !filter.active; this.applyFilters(); }
  toggleExpansion(filter: Filter): void { filter.active = !filter.active; this.applyFilters(); }

  /**
   * Aplica todos los filtros activos (tipo, rareza, expansión, precio).
   */
  applyFilters(): void {
    const activeRarities = this.rarityFilters.filter(f => f.active).map(f => f.name);
    const activeTypes    = this.typeFilters.filter(f => f.active).map(f => f.name);
    const activeSets     = this.expansionFilters.filter(f => f.active).map(f => f.name);

    const hasActiveFilters =
      activeRarities.length > 0 ||
      activeTypes.length > 0    ||
      activeSets.length > 0     ||
      this.selectedPrice > 0;

    if (!hasActiveFilters) {
      this.allCards = this.allSourceCards;
      this.applySearchFilter(this.allSourceCards); 
      this.cdr.detectChanges();
      return;
    }

    const filters: ModelFilteredCards = {
      rarities: activeRarities,
      types: activeTypes,
      setNames: activeSets,
      maxPrice: this.selectedPrice > 0 ? this.selectedPrice : undefined,
    };

    this.cardsService.getFilteredCards(filters).subscribe({
      next: (cards) => {
        this.allCards = cards;
        this.applySearchFilter(this.allCards);  
        this.resetPageAndUpdate();
      },
      error: (err) => console.error('Error al filtrar:', err)
    });
  }

  /**
   * Resetea el filtro de precio a 0 (sin filtro).
   */
  resetPriceFilter(): void {
    this.selectedPrice = 0;
    this.applyFilters();
  }

  /**
   * Carga las opciones de filtros disponibles desde el servidor.
   */
  loadFilterOptions(): void {
    this.cardsService.getTypes().subscribe(types => {
      this.typeFilters = types
        .filter(Boolean)
        .map(t => ({ 
          name: t, 
          color: this.typeColor(t), 
          active: false 
        }));
      this.cdr.detectChanges();
    });

    this.cardsService.getRarities().subscribe(rarities => {
      this.rarityFilters = rarities
        .filter(Boolean)
        .map(r => ({ 
          name: r, 
          active: false 
        }));
      this.cdr.detectChanges();
    });

    this.cardsService.getExpansions().subscribe(expansions => {
      this.expansionFilters = expansions
        .filter(Boolean)
        .map(e => ({ 
          name: e, 
          active: false 
        }));
      this.cdr.detectChanges();
    });
  }

  /**
   * Obtiene el color CSS correspondiente al tipo de carta.
   * 
   * @param type - Tipo de la carta
   * @returns Código de color hexadecimal
   */
  typeColor(type: string): string {
    const colors: Record<string, string> = {
      'Electric': '#f4c430',
      'Fire':     '#e05555',
      'Water':    '#4169e1',
      'Grass':    '#5cb85c',
      'Psychic':  '#9370db',
      'Dark':     '#555555',
    };
    return colors[type] ?? '#aaaaaa';
  }

  /**
   * Formatea un precio para mostrarlo con dos decimales y el símbolo de euro.
   * 
   * @param price - Precio a formatear
   * @returns String con el precio formateado
   */
  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}