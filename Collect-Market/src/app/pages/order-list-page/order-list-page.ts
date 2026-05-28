import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/orders/order-service';
import { AuthService } from '../../services/auth/auth-service';
import { Order } from '../../models/order';

/**
 * Componente de la página de listado de pedidos del usuario.
 * 
 * Muestra todos los pedidos realizados por el usuario autenticado,
 * con su estado y detalles básicos.
 */
@Component({
  selector: 'app-order-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-list-page.html',
  styleUrl: './order-list-page.css'
})
export class OrderListPage implements OnInit {

  orders: Order[] = [];
  loading = true;
  error = '';

  /**
   * Constructor del componente OrderListPage.
   * 
   * @param orderService - Servicio de gestión de pedidos
   * @param authService - Servicio de autenticación
   * @param cdr - Detector de cambios para actualizaciones manuales
   */
  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Inicializa el componente al cargarse.
   * 
   * Carga los pedidos del usuario.
   */
  ngOnInit(): void {
    this.loadOrders();
  }

  /**
   * Carga los pedidos del usuario desde el servidor.
   */
  loadOrders(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.error = 'Debes iniciar sesión para ver tus pedidos';
      this.loading = false;
      return;
    }

    this.orderService.getOrders(user.id).subscribe({
      next: (data) => {
        this.orders = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar pedidos:', err);
        this.error = 'Error al cargar tus pedidos. Inténtalo de nuevo.';
        this.loading = false;
      }
    });
  }

  /**
   * Obtiene la clase CSS correspondiente al estado del pedido.
   * 
   * @param status - Estado del pedido
   * @returns Clase CSS para el badge de estado
   */
  getStatusClass(status: string): string {
    switch(status?.toLowerCase()) {
      case 'pending':
      case 'preparing':
        return 'status-preparing';
      case 'shipped':
        return 'status-shipped';
      case 'delivered':
        return 'status-delivered';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  }

  /**
   * Obtiene el texto traducido del estado del pedido.
   * 
   * @param status - Estado del pedido en inglés
   * @returns Estado traducido al español
   */
  getStatusText(status: string): string {
    switch(status?.toLowerCase()) {
      case 'pending':
        return 'Pendiente';
      case 'preparing':
        return 'En preparación';
      case 'shipped':
        return 'Enviado';
      case 'delivered':
        return 'Entregado';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status || 'Desconocido';
    }
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