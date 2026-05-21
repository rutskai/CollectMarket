import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { CartService } from '../../services/cart/cart-service';

import { OrderPublic } from '../../models/order';
import { OrderService } from '../../services/orders/order-service';

@Component({
  selector: 'app-checkout-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit {

  fullName = '';
  address = '';
  city = '';
  postalCode = '';
  country = '';
  paymentMethod = 'card';
  cardNumber = '';

  loading = false;
  error = '';

  private userId: number | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) this.userId = user.id;
  }

  get cartItems() { return this.cartService.cartItems(); }
  get totalPrice() { return this.cartService.totalPrice(); }

  onSubmit(): void {
    if (!this.userId) return;
    if (!this.fullName || !this.address || !this.city || !this.postalCode || !this.country) {
      this.error = 'Por favor rellena todos los campos.';
      return;
    }
    if (this.paymentMethod === 'card' && !this.cardNumber) {
      this.error = 'Introduce el número de tarjeta.';
      return;
    }

    this.loading = true;
    this.error = '';

    const order: OrderPublic = {
      userId: this.userId,
      fullName: this.fullName,
      address: this.address,
      city: this.city,
      postalCode: this.postalCode,
      country: this.country,
      paymentMethod: this.paymentMethod,
      cardNumber: this.cardNumber,
      items: this.cartItems.map(i => ({
        cardId: i.cardId,
        quantity: i.quantity,
        unitPrice: i.card.price
      }))
    };

    this.orderService.createOrder(order).subscribe({
      next: (res) => {
        this.cartService.clearCart(this.userId!);
        this.router.navigate(['/order-confirmation', res.id]);
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al procesar el pedido. Inténtalo de nuevo.';
      }
    });
  }

  formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }
}