import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModelCard } from '../../models/card';
import { Card } from '../../components/card/card';
import { CardsService } from '../../services/cards/cards-service';
import { Filter, ModelFilteredCards } from '../../models/filter';
import { PaginationHelper } from '../../helpers/pagination-helper';

export type TabType = 'new' | 'packs' | 'cards';

@Component({
  selector: 'app-shop-page',
  standalone: true,
  imports: [CommonModule, FormsModule, Card],
  templateUrl: './shop-page.html',
  styleUrls: ['./shop-page.css']
})
export class ShopPage implements OnInit {

  activeTab: TabType = 'cards';
  maxPrice = 0;

  allSourceCards: ModelCard[] = [];
  allCards: ModelCard[] = [];
  displayCards: ModelCard[] = [];
  newCards: ModelCard[] = [];

  currentPage = 1;
  itemsPerPage = 14;
  totalPages = 1;

  typeFilters: Filter[] = [];
  rarityFilters: Filter[] = [];
  expansionFilters: Filter[] = [];

  constructor(
    private cardsService: CardsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCards();
    this.loadFilterOptions();
  }

  // Cartas

  loadCards(): void {
    this.cardsService.getCards().subscribe({
      next: (cards) => {
        this.allSourceCards = cards;
        this.allCards = cards;
        this.newCards = cards.slice(0, 20);
        this.resetPageAndUpdate();
      },
      error: (err) => console.error('Error cargando cartas:', err)
    });
  }

  // Paginación

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

  // Filtros

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
      this.resetPageAndUpdate();
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
        this.resetPageAndUpdate();
      },
      error: (err) => console.error('Error al filtrar:', err)
    });
  }

  loadFilterOptions(): void {
    this.cardsService.getTypes().subscribe(types => {
      this.typeFilters = types
        .filter(Boolean)
        .map(t => ({ name: t, color: this.typeColor(t), active: false }));
      this.cdr.detectChanges();
    });

    this.cardsService.getRarities().subscribe(rarities => {
      this.rarityFilters = rarities
        .filter(Boolean)
        .map(r => ({ name: r, active: false }));
      this.cdr.detectChanges();
    });

    this.cardsService.getExpansions().subscribe(expansions => {
      this.expansionFilters = expansions
        .filter(Boolean)
        .map(e => ({ name: e, active: false }));
      this.cdr.detectChanges();
    });
  }

  // Helpers

  changeTab(tab: TabType): void {
    this.activeTab = tab;
    this.cdr.detectChanges();
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

  getRarityClass(rarity: string): string {
    const map: Record<string, string> = {
      'Ultra Rare': 'badge-ultra',
      'Secret':     'badge-secret',
      'Rare':       'badge-rare',
      'Common':     'badge-common',
      'New':        'badge-new',
    };
    return map[rarity] ?? 'badge-common';
  }

  getRarityLabel(rarity: string, isNew?: boolean): string {
    if (isNew) return 'NEW';
    const map: Record<string, string> = {
      'Ultra Rare': 'ULTRA',
      'Secret':     'SECRET',
      'Rare':       'RARE',
      'Common':     'COMMON',
    };
    return map[rarity] ?? rarity.toUpperCase();
  }

  formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }
}