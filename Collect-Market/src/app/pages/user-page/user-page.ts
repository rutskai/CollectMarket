import { Component } from '@angular/core';
import { AuthService } from '../../services/auth/auth-service';
import { ModelUser } from '../../models/user';
import { Router, RouterLink } from '@angular/router';
declare var $: any;

/**
 * Componente de la página de perfil de usuario.
 * 
 * Muestra la información del usuario autenticado
 * y permite cerrar sesión.
 */
@Component({
  selector: 'app-user-page',
  imports: [RouterLink],
  templateUrl: './user-page.html',
  styleUrl: './user-page.css',
})
export class UserPage {

  user: ModelUser | null = null;

  /**
   * Constructor del componente UserPage.
   * 
   * @param authService - Servicio de autenticación
   * @param router - Enrutador para navegación
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Inicializa el componente al cargarse.
   * 
   * Configura el vídeo de fondo y se suscribe al estado del usuario autenticado.
   */
  ngOnInit(): void {
    $('#user').vide({mp4: 'video/pickachu_runtime'}, {poster: 'video/pickachu_runtime.png'});
    this.authService.user$.subscribe(user => {
      this.user = user;
    });
  }

  /**
   * Cierra la sesión del usuario actual.
   * 
   * Limpia los datos de autenticación y redirige a la página de inicio.
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}