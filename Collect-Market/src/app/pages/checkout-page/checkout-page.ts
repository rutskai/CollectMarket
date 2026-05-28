import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { CartService } from '../../services/cart/cart-service';
import { OrderService } from '../../services/orders/order-service';

/**
 * Componente de la página de finalización de compra (checkout).
 * 
 * Muestra un formulario para que el usuario ingrese sus datos de envío y pago,
 * procesa el pedido y lo envía al backend.
 */
@Component({
  selector: 'app-checkout-page',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout-page.html',
  styleUrl: './checkout-page.css',
})
export class CheckoutPage implements OnInit {

  /**
   * Formulario reactivo del checkout.
   * 
   * Campos:
   * - fullName: nombre completo (requerido)
   * - address: dirección (requerido)
   * - city: ciudad (requerido)
   * - postalCode: código postal (requerido, formato 4-5 dígitos)
   * - country: país (requerido)
   * - paymentMethod: método de pago (requerido, default 'card')
   * - cardNumber: número de tarjeta (validación condicional)
   */
  checkoutForm = new FormGroup({
    fullName: new FormControl('', [Validators.required]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{4,5}$/)]),
    country: new FormControl('', [Validators.required]),
    paymentMethod: new FormControl('card', [Validators.required]),
    cardNumber: new FormControl('', [Validators.pattern(/^\d{4} \d{4} \d{4} \d{4}$/)]),
  });

  /** Indica si se está procesando el pedido. */
  loading = false;
  /** Mensaje de error en caso de fallo. */
  error = '';
  /** ID del usuario autenticado. */
  private userId: number | null = null;

  /**
   * Constructor del componente CheckoutPage.
   * 
   * @param authService - Servicio de autenticación
   * @param cartService - Servicio de gestión del carrito
   * @param orderService - Servicio de gestión de pedidos
   * @param router - Enrutador para navegación
   */
  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private orderService: OrderService,
    private router: Router
  ) { }

  /**
   * Inicializa el componente al cargarse.
   * 
   * Obtiene el usuario autenticado y configura la validación condicional
   * del campo de número de tarjeta según el método de pago seleccionado.
   */
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

  /** Devuelve los items del carrito. */
  get cartItems() { return this.cartService.cartItems(); }
  /** Devuelve el precio total del carrito. */
  get totalPrice() { return this.cartService.totalPrice(); }
  /** Devuelve el método de pago seleccionado. */
  get paymentMethod() { return this.checkoutForm.get('paymentMethod')?.value; }

  /**
   * Formatea el número de tarjeta añadiendo espacios cada 4 dígitos.
   * 
   * @param event - Evento de entrada del input
   */
  onCardInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    this.checkoutForm.get('cardNumber')?.setValue(val, { emitEvent: false });
  }

  /**
   * Procesa el envío del formulario y crea el pedido.
   * 
   * Valida el formulario, crea el objeto de pedido con los items del carrito,
   * lo envía al backend y redirige a la página de confirmación.
   */
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

  /**
   * Formatea un precio para mostrarlo con dos decimales y el símbolo de euro.
   * 
   * @param price - Precio a formatear
   * @returns String con el precio formateado
   */
  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }

  /**
   * Comprueba si un campo del formulario es inválido y ha sido tocado.
   * 
   * @param field - Nombre del campo
   * @returns true si el campo es inválido y ha sido tocado
   */
  isInvalid(field: string): boolean {
    const control = this.checkoutForm.get(field);
    return !!(control?.invalid && control?.touched);
  }
}