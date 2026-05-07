import { ModelCard } from './card';

export interface ModelCartItem {
  id: number;
  userId: number;
  cardId: number;
  quantity: number;
  addedAt: string;
  card: ModelCard;
}