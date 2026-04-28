export interface ModelCard {
  id: number;
  name: string;
  setName?: string;
  rarity?: string;
  type?: string;
  imageUrl?: string;
  price: number;
  stock: number;
  description?: string;
  createdAt: string;
  updatedAt?: string; 
}