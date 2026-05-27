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
import { TYPE_TRANSLATION, RARITY_TRANSLATION,EXPANSION_TRANSLATION} from '../../helpers/constants';
import { TranslateHelper } from '../../helpers/translate-helper';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Card],
  templateUrl: './shop-page.html',
  styleUrls: ['./shop-page.css']
})
export class ShopPage implements OnInit, OnDestroy {  
  TranslateHelper = TranslateHelper;
  maxPrice = 0;

  allSourceCards: ModelCard[] = [];
  allCards: ModelCard[] = [];
  displayCards: ModelCard[] = [];

  currentPage = 1;
  itemsPerPage = 14;
  totalPages = 1;

  typeFilters: Filter[] = [];
  rarityFilters: Filter[] = [];
  expansionFilters: Filter[] = [];
  searchTerm: string = '';

  private searchSubscription: Subscription | null = null;

  constructor(
    private cardsService: CardsService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private searchService: SearchService  
  ) {}

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
  }


  ngOnDestroy(): void {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
  }

  loadCards(): void {
    this.cardsService.getCards().subscribe({
      next: (cards) => {
        this.allSourceCards = cards;
        this.applySearchFilter(cards); 
      },
      error: (err) => console.error('Error cargando cartas:', err)
    });
  }


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

  clearSearch(): void {
    this.searchTerm = '';
    this.searchService.clearSearch(); 
    this.router.navigate(['/shop'], { queryParams: {} });
    this.loadCards();  
  }

  backToShop(): void {
    this.clearSearch();
  }

  updateDisplayCards(): void {
    const pagination = PaginationHelper.paginate(this.allCards, this.currentPage, this.itemsPerPage);
    this.displayCards = pagination.items;
    this.totalPages = pagination.totalPages;
    this.currentPage = pagination.currentPage;
    this.cdr.detectChanges();
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.updateDisplayCards();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  nextPage(): void { this.changePage(this.currentPage + 1); }
  prevPage(): void { this.changePage(this.currentPage - 1); }

  getVisiblePages(): number[] {
    return PaginationHelper.getVisiblePages(this.currentPage, this.totalPages);
  }

  private resetPageAndUpdate(): void {
    this.currentPage = 1;
    this.updateDisplayCards();
  }

  toggleType(filter: Filter): void      { filter.active = !filter.active; this.applyFilters(); }
  toggleRarity(filter: Filter): void    { filter.active = !filter.active; this.applyFilters(); }
  toggleExpansion(filter: Filter): void { filter.active = !filter.active; this.applyFilters(); }

  applyFilters(): void {
    const activeRarities = this.rarityFilters.filter(f => f.active).map(f => f.name);
    const activeTypes    = this.typeFilters.filter(f => f.active).map(f => f.name);
    const activeSets     = this.expansionFilters.filter(f => f.active).map(f => f.name);

    const hasActiveFilters =
      activeRarities.length > 0 ||
      activeTypes.length > 0    ||
      activeSets.length > 0     ||
      this.maxPrice > 0;

    if (!hasActiveFilters) {
      this.allCards = this.allSourceCards;
      this.applySearchFilter(this.allSourceCards); 
      return;
    }

    const filters: ModelFilteredCards = {
      rarities: activeRarities,
      types: activeTypes,
      setNames: activeSets,
      maxPrice: this.maxPrice > 0 ? this.maxPrice : undefined,
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

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}