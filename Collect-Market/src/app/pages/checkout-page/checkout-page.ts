import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { CartService } from '../../services/cart/cart-service';
import { OrderService } from '../../services/orders/order-service';

@Component({
  selector: 'app-checkout-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit {

  checkoutForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{4,5}$/)]),
    country: new FormControl('', [Validators.required]),
    paymentMethod: new FormControl('card', [Validators.required]),
    cardNumber: new FormControl('', [Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]),
  });

  loading = false;
  error = '';
  private userId: number | null = null;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) this.userId = user.id;

    // Si cambia el método de pago, actualiza validación de tarjeta
    this.checkoutForm.get('paymentMethod')?.valueChanges.subscribe(method => {
      const cardControl = this.checkoutForm.get('cardNumber');
      if (method === 'card') {
        cardControl?.setValidators([Validators.required, Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]);
      } else {
        cardControl?.clearValidators();
      }
      cardControl?.updateValueAndValidity();
    });
  }

  get cartItems() { return this.cartService.cartItems(); }
  get totalPrice() { return this.cartService.totalPrice(); }
  get paymentMethod() { return this.checkoutForm.get('paymentMethod')?.value; }

  // Formatea el número de tarjeta con espacios
  onCardInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    this.checkoutForm.get('cardNumber')?.setValue(val, { emitEvent: false });
  }

  onSubmit(): void {
    if (!this.userId || this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const order = {
      userId: this.userId,
      fullName: this.checkoutForm.value.fullName!,
      address: this.checkoutForm.value.address!,
      city: this.checkoutForm.value.city!,
      postalCode: this.checkoutForm.value.postalCode!,
      country: this.checkoutForm.value.country!,
      paymentMethod: this.checkoutForm.value.paymentMethod!,
      cardNumber: this.checkoutForm.value.cardNumber ?? '',
      items: this.cartItems.map(i => ({
        cardId: i.cardId,
        quantity: i.quantity,
        unitPrice: i.card.price
      }))
    };

    this.orderService.createOrder(order).subscribe({
      next: (res) => {  
        this.cartService.clearCart(this.userId!);
        this.router.navigate(['/order-confirmation-page'], { state: { orderId: res.id } });
      },
      error: () => {
        this.loading = false;
        this.error = 'Error al procesar el pedido. Inténtalo de nuevo.';
      }
    });
  }

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }

  isInvalid(field: string): boolean {
    const control = this.checkoutForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}