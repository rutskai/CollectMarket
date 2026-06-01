import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { FavoritesService } from '../../services/favorite/favorites-service';
import { CartService } from '../../services/cart/cart-service';
import { ModelUser } from '../../models/user';
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/orders/order-service';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {


  public user: ModelUser | null = null;
  public searchTerm: string = '';
  public orderCount: number = 0;

  //Audio
  private audio = new Audio('music/routes_209_&_212.mp3');
  isPlaying = false;

  /**
   * Constructor del componente Header.
   * 
   * @param authService - Servicio de autenticación
   * @param favoritesService - Servicio de gestión de favoritos
   * @param cartService - Servicio de gestión del carrito
   * @param router - Enrutador para navegación
   * @param orderService - Servicio de gestión de pedidos
   * @param cdr - Detector de cambios para actualizaciones manuales
   */
  constructor(
    private authService: AuthService,
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private router: Router, private orderService: OrderService,
    private cdr: ChangeDetectorRef
  ) {
    this.audio.loop = true;
    this.audio.volume = 0.04;
  }

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
        this.loadUserOrders(user.id);


      } else {
        this.favoritesService.clear();
        this.cartService.clear();
        this.orderCount = 0;
      }
    });

  }

  /**
   * Carga los pedidos del usuario desde el servidor.
   * 
   * @param userId - ID del usuario
   */
  private loadUserOrders(userId: number): void {
    this.orderService.getOrders(userId).subscribe({
      next: (orders) => {
        this.orderCount = orders.length
        console.log('Pedidos cargados:', orders);
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
      }
    });
  }

  /**
   * Maneja la búsqueda de cartas.
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

  /**
   * Alterna la reproducción de la música de fondo.
   *
   * Si la música está sonando la pausa.
   * Si está pausada la reproduce.
   */

  toggleMusic(): void {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play();
    }
    this.isPlaying = !this.isPlaying;
  }
}