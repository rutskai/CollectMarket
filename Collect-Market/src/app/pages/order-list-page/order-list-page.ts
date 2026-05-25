import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../services/orders/order-service';
import { AuthService } from '../../services/auth/auth-service';

@Component({
  selector: 'app-order-list-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './order-list-page.html',
  styleUrl: './order-list-page.css'
})
export class OrderListPage implements OnInit {
  orders: any[] = [];
  loading = true;
  error = '';

  constructor(
    private orderService: OrderService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

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

  formatPrice(price: number): string {
    return `${price.toFixed(2)} €`;
  }
}