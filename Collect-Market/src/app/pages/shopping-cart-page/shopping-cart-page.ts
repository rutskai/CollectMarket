import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { CartService } from '../../services/cart/cart-service';
import { ModelUser } from '../../models/user';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ModelCartItem } from '../../models/cart';
import { ImageHelper } from '../../helpers/image-helper';

@Component({
  selector: 'app-shopping-cart-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './shopping-cart-page.html',
  styleUrl: './shopping-cart-page.css',
})
export class ShoppingCartPage implements OnInit {

  user: ModelUser | null = null;
  ImageHelper = ImageHelper;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.cartService.load(user.id);  // ← carga los datos al entrar
      }
    });
  }

  get cartItems()  { return this.cartService.cartItems(); }
  get totalItems() { return this.cartService.totalItems(); }
  get totalPrice() { return this.cartService.totalPrice(); }

  onUpdateQuantity(item: ModelCartItem, quantity: number): void {
    if (!this.user) return;
    if (quantity <= 0) {
      this.cartService.toggle(this.user.id, item.cardId);
    } else {
      this.cartService.updateQuantity(this.user.id, item.cardId, quantity);
    }
  }

  onRemoveItem(item: ModelCartItem): void {
    if (!this.user) return;
    this.cartService.toggle(this.user.id, item.cardId);
  }

  onClearCart(): void {
    if (!this.user) return;
    this.cartService.clearCart(this.user.id);
  }

  formatPrice(price: number): string {
    return `€${price.toFixed(2)}`;
  }
}