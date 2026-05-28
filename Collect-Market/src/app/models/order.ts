import { ModelCard } from "./card";
import { ModelUser } from "./user";

export interface OrderItemPublic {
  cardId: number;
  quantity: number;
  unitPrice: number;
}

export interface OrderPublic {
  userId: number;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  cardNumber: string;
  items: OrderItemPublic[];
}

export interface OrderItem {
  id: number;
  orderId: number;
  cardId: number;
  quantity: number;
  unitPrice: number;
  card?: ModelCard;  
}

export interface Order {
  id: number;
  userId: number;
  fullName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  paymentMethod: string;
  cardNumber: string;
  total: number;
  status: string;
  createdAt: string;  
  user?: ModelUser;        
  items: OrderItem[]; 
}

