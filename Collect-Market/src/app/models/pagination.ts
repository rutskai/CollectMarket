import { ModelCard } from "./card";

export interface ModelPagination {
    items: ModelCard[];          
  currentPage: number;   
  totalPages: number;     
  totalItems: number;     
  itemsPerPage: number;  
  hasNext: boolean;      
  hasPrev: boolean; 
}