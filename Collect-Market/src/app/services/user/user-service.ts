import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModelUser } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = '/api/users';

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de todos los usuarios.
   * 
   * @returns Observable con array de usuarios.
   */
  getUsers(): Observable<ModelUser[]> {
    return this.http.get<ModelUser[]>(this.apiUrl);
  }

  /**
   * Obtiene un usuario específico por ID.
   *
   * @param id ID del usuario a buscar.
   *
   * @returns Observable con los datos del usuario.
   */
  getUserById(id: number): Observable<ModelUser> {
    return this.http.get<ModelUser>(`${this.apiUrl}/${id}`);
  }

  /**
   * Actualiza el nombre de un usuario.
   *
   * @param userId ID del usuario.
   * @param name Nuevo nombre.
   *
   * @returns Observable con la respuesta del servidor.
   */
  updateName(userId: number, name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/name`, null, {
      params: { name }
    });
  }

  /**
   * Actualiza el avatar de un usuario.
   *
   * Envía la imagen como multipart/form-data.
   *
   * @param userId ID del usuario.
   * @param file Archivo de imagen.
   *
   * @returns Observable con la respuesta del servidor.
   */
  updateAvatar(userId: number, file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.put(`${this.apiUrl}/${userId}/avatar`, formData);
  }

  /**
   * Elimina un usuario por ID.
   *
   * @param userId ID del usuario a eliminar.
   *
   * @returns Observable con la respuesta del servidor.
   */
  deleteUser(userId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${userId}`);
  }

  /**
   * Actualiza el email de un usuario.
   *
   * @param userId ID del usuario.
   * @param email Nuevo email.
   *
   * @returns Observable con la respuesta del servidor.
   */
  updateEmail(userId: number, email: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/email`, null, {
      params: { email }
    });
  }

  /**
   * Actualiza la contraseña de un usuario.
   *
   * @param userId ID del usuario.
   * @param password Nueva contraseña.
   *
   * @returns Observable con la respuesta del servidor.
   */
  updatePassword(userId: number, password: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${userId}/password`, null, {
      params: { password }
    });
  }
}