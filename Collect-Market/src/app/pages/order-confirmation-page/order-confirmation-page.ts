import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Componente de la página de confirmación de pedido.
 * 
 * Se muestra después de completar una compra exitosa,
 * mostrando el número de pedido generado.
 */
@Component({
  selector: 'app-order-confirmation-page',
  imports: [RouterLink],
  templateUrl: './order-confirmation-page.html',
  styleUrl: './order-confirmation-page.css',
})
export class OrderConfirmationPage {

  orderNumber: number;

  /**
   * Constructor del componente OrderConfirmationPage.
   * 
   * Recupera el ID del pedido desde la navegación.
   */
  constructor() {
    const navigation = history.state;
    this.orderNumber = navigation?.['orderId'] ?? 0;
  }
}