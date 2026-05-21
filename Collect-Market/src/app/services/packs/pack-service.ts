import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ModelPack } from '../../models/pack';

@Injectable({
  providedIn: 'root',
})
export class PackService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getPacks(): Observable<ModelPack[]> {
    return this.http.get<ModelPack[]>(`${this.apiUrl}/packs`);
  }

  getPackById(id: number): Observable<ModelPack> {
    return this.http.get<ModelPack>(`${this.apiUrl}/packs/${id}`);
  }
}