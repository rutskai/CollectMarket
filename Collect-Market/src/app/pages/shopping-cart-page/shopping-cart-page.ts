import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { CartService } from '../../services/cart/cart-service';
import { ModelUser } from '../../models/user';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModelCartItem } from '../../models/cart';

@Component({
  selector: 'app-shopping-cart-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart-page.html',
  styleUrl: './shopping-cart-page.css',
})
export class ShoppingCartPage implements OnInit {

  cartItems: ModelCartItem[] = [];
  user: ModelUser | null = null;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.loadCart(user.id);
      }
    });
  }

  loadCart(userId: number): void {
    this.cartService.getCart(userId).subscribe(items => {
      this.cartItems = items;
      this.cdr.detectChanges();
    });
  }

  onUpdateQuantity(item: ModelCartItem, quantity: number): void {
    if (!this.user) return;
    this.cartService.updateQuantity(this.user.id, item.cardId, quantity).subscribe(() => {
      if (quantity <= 0) {
        this.cartItems = this.cartItems.filter(i => i.cardId !== item.cardId);
      } else {
        item.quantity = quantity;
      }
      this.cdr.detectChanges();
    });
  }

  onRemoveItem(item: ModelCartItem): void {
    if (!this.user) return;
    this.cartService.removeFromCart(this.user.id, item.cardId).subscribe(() => {
      this.cartItems = this.cartItems.filter(i => i.cardId !== item.cardId);
      this.cdr.detectChanges();
    });
  }

  onClearCart(): void {
    if (!this.user) return;
    this.cartService.clearCart(this.user.id).subscribe(() => {
      this.cartItems = [];
      this.cdr.detectChanges();
    });
  }

  getTotalItems(): number {
    return this.cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }

  getTotalPrice(): number {
    return this.cartItems.reduce((acc, item) => acc + item.card.price * item.quantity, 0);
  }

  formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }
}