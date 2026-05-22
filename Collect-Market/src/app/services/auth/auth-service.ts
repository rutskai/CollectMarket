import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ModelUser } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private loginUrl = '/api/login';
  private registerUrl = '/api/register';

  private userSubject = new BehaviorSubject<ModelUser | null>(this.getStoredUser());
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) { }

  /**
   * Recupera el usuario almacenado en localStorage.
   *
   * @returns Usuario almacenado o null si no existe.
   */
  private getStoredUser(): ModelUser | null {
    try {
      const user = localStorage.getItem('currentUser');
      if (!user || user === 'undefined') return null;
      return JSON.parse(user);
    } catch {
      return null;
    }
  }

  /**
   * Realiza login con email y contraseña
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Observable con response { token, user, success }
   */
  login(email: string, password: string): Observable<any> {
    return this.http.post(this.loginUrl, { email, password });
  }

   /**
   * Almacena el usuario en localStorage
   * y actualiza el Subject.
   *
   * @param user Usuario a almacenar.
   */

  setUser(user: ModelUser): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    this.userSubject.next(user);
  }

  /**
  * Cierra sesión eliminando el token del localStorage
  */

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    this.userSubject.next(null);
  }

  /**
  * Verifica si el usuario está logueado (tiene token válido)
  * @returns true si existe token en localStorage, false si no
  */

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  /**
   * Obtiene el token JWT almacenado en localStorage
   * @returns Token string o null si no existe
   */

  getToken(): string | null {
    return localStorage.getItem('token');
  }

   /**
   * Almacena el token JWT en localStorage.
   *
   * @param token Token JWT a almacenar.
   */

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

   /**
   * Obtiene el usuario actualmente autenticado.
   *
   * @returns Usuario actual o null si no está autenticado.
   */

  getCurrentUser(): ModelUser | null {
  return this.userSubject.value;
}

  /**
 * Registra un nuevo usuario
 * @param name - Nombre del usuario
 * @param email - Email del usuario
 * @param password - Contraseña
 * @param confirmPassword - Confirmación de contraseña
 * @returns Observable con response { success, user }
 */

  register(name: string, email: string, password: string, confirmPassword: string): Observable<any> {
    return this.http.post(this.registerUrl, {
      name,
      email,
      password,
      confirmPassword
    });
  }

    /**
 * Cambia la contraseña
 * @param userId - Id
 * @param currentPassword - Contraseña actual
 * @param newPassword - Nueva contraseña
 * @param confirmPassword - Confirmación de contraseña
 * @returns Observable con response { success, user }
 */

  changePassword(userId: number, currentPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
  return this.http.put(`/api/users/${userId}/password`, {
    currentPassword,
    newPassword,
    confirmPassword
  });
}

}
