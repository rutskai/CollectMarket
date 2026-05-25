import { Component } from '@angular/core';

@Component({
  selector: 'app-order-confirmation-page',
  imports: [],
  templateUrl: './order-confirmation-page.html',
  styleUrl: './order-confirmation-page.css',
})
export class OrderConfirmationPage {
  orderNumber: number;

  constructor() {
  
    const navigation = history.state;
    this.orderNumber = navigation?.['orderId'] ?? 0;
  }
}