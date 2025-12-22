import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserResponseDTO } from '../hangouts/hangout-models';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = `${environment.apiUrl}/user`;

  constructor(
    private http: HttpClient,
  ) { }

  getAllUsers(): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/users`);
  }

  searchUsers(term: string): Observable<UserResponseDTO[]> {

  const params = new HttpParams().set('query', term);

  return this.http.get<UserResponseDTO[]>(`${this.apiUrl}/search`, { params });
}
}
