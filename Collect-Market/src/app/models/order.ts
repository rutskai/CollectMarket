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