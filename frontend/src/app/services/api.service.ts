import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  // Usa la URL definida en environment.ts
  private baseUrl = environment.apiUrl; 

  constructor() { }

  // Métodos CRUD genéricos
  
  // GET: Obtener lista o recurso
  get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${path}`);
  }

  // POST: Crear nuevo recurso
  post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}/${path}`, body);
  }

  // PUT: Actualizar recurso existente
  put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${path}`, body);
  }

  // DELETE: Eliminar recurso
  delete(path: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${path}`);
  }
}