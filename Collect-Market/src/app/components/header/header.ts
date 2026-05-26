import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { FavoritesService } from '../../services/favorite/favorites-service';
import { CartService } from '../../services/cart/cart-service';
import { ModelUser } from '../../models/user';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {

  public user: ModelUser | null = null;
  public searchTerm: string = '';

  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private router: Router
  ) {}

  /**
   * Se suscribe al estado del usuario.
   *
   * Si hay usuario autenticado carga sus favoritos y carrito.
   * Si no hay usuario limpia ambos servicios.
   */
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

  /**
   * Maneja la búsqueda de cartas.
   * 
   * Navega a la página de tienda con el parámetro de búsqueda.
   * 
   * @param event Evento del formulario
   */
  onSearch(event: Event): void {
    event.preventDefault();
    
    if (this.searchTerm && this.searchTerm.trim()) {
      const term = this.searchTerm.trim();
      this.router.navigate(['/shop'], { 
        queryParams: { search: term }
      });
      this.searchTerm = '';
    }  
  }
}