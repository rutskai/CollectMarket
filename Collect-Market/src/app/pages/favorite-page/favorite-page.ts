import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { FavoritesService } from '../../services/favorite/favorites-service';
import { ModelUser } from '../../models/user';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';
import { RouterLink } from '@angular/router';

/**
 * Componente de la página de favoritos del usuario.
 * 
 * Muestra todas las cartas que el usuario ha marcado como favoritas,
 * junto con el valor total del conjunto.
 */
@Component({
  selector: 'app-favorite-page',
  imports: [CommonModule, Card, RouterLink],
  templateUrl: './favorite-page.html',
  styleUrl: './favorite-page.css',
})
export class FavoritePage implements OnInit {

  user: ModelUser | null = null;
  get favCards() { return this.favoritesService.getAll(); }

  /**
   * Constructor del componente FavoritePage.
   * 
   * @param favoritesService - Servicio de gestión de favoritos
   * @param authService - Servicio de autenticación
   */
  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
  ) {}

  /**
   * Inicializa el componente al cargarse.
   * 
   * Se suscribe al estado del usuario autenticado.
   */
  ngOnInit(): void {
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  /**
   * Calcula el valor total de todas las cartas favoritas.
   * 
   * @returns Suma de los precios de todas las cartas favoritas
   */
  getTotalValue(): number {
    return this.favCards.reduce((acc, card) => acc + card.price, 0);
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
}