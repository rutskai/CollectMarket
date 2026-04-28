import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ModelUser } from '../../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = '/api/users';


  
   constructor(private http: HttpClient){

   }

   /**
   * Obtiene la lista de todos los usuarios
   * @returns Observable con array de usuarios
   */
    getUsers(): Observable<ModelUser[]> {
    return this.http.get<ModelUser[]>(this.apiUrl);
  }

   /**
   * Obtiene un usuario específico por ID
   * @param id - ID del usuario a buscar
   * @returns Observable con los datos del usuario
   */
    getUserById(id: number): Observable<ModelUser> {
    return this.http.get<ModelUser>(`${this.apiUrl}/${id}`);
  }

 
}
