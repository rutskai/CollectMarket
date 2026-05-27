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
   sellerId?: number;
  createdAt: string;
  updatedAt?: string; 
}

export interface ModelCardPublic {
  name: string;
  setName?: string;
  rarity?: string;
  type?: string;
  imageUrl?: string;
  price: number;
  stock: number;
  description?: string;
   sellerId?: number;
}