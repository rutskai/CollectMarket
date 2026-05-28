import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order-confirmation-page',
  imports: [RouterLink],
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