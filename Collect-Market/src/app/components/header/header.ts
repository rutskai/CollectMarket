import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { UserService } from '../../services/user/user-service';
import { FavoritesService } from '../../services/favorite/favorites-service';
import { CartService } from '../../services/cart/cart-service';
import { ModelUser } from '../../models/user';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  public user: ModelUser | null = null;

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) {
        this.favoritesService.load(user.id);
        this.cartService.load(user.id);
      } else {
        this.favoritesService.clear();
        this.cartService.clear();
      }
    });
  }
}