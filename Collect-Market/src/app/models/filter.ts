export interface ModelFilteredCards {
   rarities?: string[];
  types?: string[];
  setNames?: string[];
  minPrice?: number;
  maxPrice?: number; 
}

export interface Filter {
  name: string;
  active: boolean;
  color?: string;
}