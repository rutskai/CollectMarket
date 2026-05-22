import { Injectable, signal } from '@angular/core';
/**
 * Servicio que gestiona la visibilidad
 * del modal de inicio de sesión.
 *
 * Usado cuando un usuario no autenticado
 * intenta añadir al carrito o a favoritos.
 */
@Injectable({
  providedIn: 'root',
})
export class LoginModalService {
  showLogin = signal(false);

    /**
   * Abre el modal de inicio de sesión.
   */
  open()  { this.showLogin.set(true); }

  /**
   * Cierra el modal de inicio de sesión.
   */
  close() { this.showLogin.set(false); }  
}
