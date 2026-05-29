import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth/auth-service';
import { UserService } from '../../services/user/user-service';
import { ModelUser } from '../../models/user';
declare var $: any;

/**
 * Componente de la página de personalización de usuario.
 * 
 * Permite al usuario modificar su nombre, cambiar su foto de perfil
 * y actualizar su contraseña.
 */
@Component({
  selector: 'app-user-personalization-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './user-personalization-page.html',
  styleUrl: './user-personalization-page.css',
})
export class UserPersonalizationPage implements OnInit {


  user: ModelUser | null = null;

  // Nombre
  newName = '';
  nameSuccess = '';
  nameError = '';

  // Avatar
  selectedFile: File | null = null;
  avatarPreview: string | null = null;
  avatarSuccess = '';
  avatarError = '';

  // Contraseña
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  passwordSuccess = '';
  passwordError = '';

  /**
   * Constructor del componente UserPersonalizationPage.
   * 
   * @param authService - Servicio de autenticación
   * @param userService - Servicio de gestión de usuarios
   * @param cdr - Detector de cambios para actualizaciones manuales
   */
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  /**
   * Inicializa el componente al cargarse.
   * 
   * Configura el vídeo de fondo y se suscribe al estado del usuario autenticado.
   */
  ngOnInit(): void {
    $('#personalization').vide({mp4: 'video/pickachu_runtime'}, {poster: 'video/pickachu_runtime.png'});
    this.authService.user$.subscribe(user => {
      this.user = user;
      if (user) this.newName = user.name;
      this.cdr.detectChanges();
    });
  }

  /**
   * Guarda el nuevo nombre del usuario.
   */
  onSaveName(): void {
    if (!this.user || !this.newName.trim()) return;
    this.nameError = '';
    this.nameSuccess = '';

    this.userService.updateName(this.user.id, this.newName).subscribe({
      next: (res) => {
        this.nameSuccess = 'Nombre actualizado correctamente.';
        const updated = { ...this.user!, name: this.newName };
        this.authService.setUser(updated);
        this.cdr.detectChanges();
      },
      error: () => {
        this.nameError = 'Error al actualizar el nombre.';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Maneja la selección de un archivo para el avatar.
   * 
   * @param event - Evento de cambio del input de archivo
   */
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;
    this.selectedFile = input.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      this.avatarPreview = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(this.selectedFile);
  }

  /**
   * Guarda el nuevo avatar del usuario.
   */
  onSaveAvatar(): void {
    if (!this.user || !this.selectedFile) return;
    this.avatarError = '';
    this.avatarSuccess = '';

    this.userService.updateAvatar(this.user.id, this.selectedFile).subscribe({
      next: (res) => {
        this.avatarSuccess = 'Foto de perfil actualizada.';
        const updated = { ...this.user!, avatarUrl: res.avatarUrl };
        this.authService.setUser(updated);
        this.cdr.detectChanges();
      },
      error: () => {
        this.avatarError = 'Error al subir la imagen.';
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Guarda la nueva contraseña del usuario.
   * 
   * Valida que la contraseña actual sea correcta
   * y que la nueva contraseña coincida con su confirmación.
   */
  onSavePassword(): void {
    if (!this.user) return;
    this.passwordError = '';
    this.passwordSuccess = '';

    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.passwordError = 'Rellena todos los campos.';
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.passwordError = 'Las contraseñas nuevas no coinciden.';
      return;
    }

    this.authService.changePassword(this.user.id, this.currentPassword, this.newPassword, this.confirmPassword).subscribe({
      next: () => {
        this.passwordSuccess = 'Contraseña actualizada correctamente.';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.passwordError = err.error || 'Error al cambiar la contraseña.';
        this.cdr.detectChanges();
      }
    });
  }
}