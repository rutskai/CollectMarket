import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
 private apiUrl = 'http://localhost:5000/api/users';
 private loginUrl = 'http://localhost:5000/api/login';

  
   constructor(private http: HttpClient){

   }

   /**
   * Obtiene la lista de todos los usuarios
   * @returns Observable con array de usuarios
   */
    getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

   /**
   * Obtiene un usuario específico por ID
   * @param id - ID del usuario a buscar
   * @returns Observable con los datos del usuario
   */
    getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

 
}
