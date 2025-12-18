import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';
import { HangOutResponseDTO, Page, User } from './hangout-models';

@Injectable({
  providedIn: 'root',
})
export class HangoutsService {
  private apiUrl = `${environment.apiUrl}/hangouts`; 

  constructor(private http: HttpClient) {}

  getUserHangouts(page: number = 0, size: number =  10): Observable<Page<HangOutResponseDTO>>{
    let params = new HttpParams()
    .set('page', page.toString())
    .set('size', size.toString())
    .set('sort', 'creationDate,desc');

    return this.http.get<Page<HangOutResponseDTO>>(this.apiUrl, { params });
  }

  getHangOutMembers(hangOutId: number): Observable<User[]>{
    return this.http.get<User[]>(`${this.apiUrl}/${hangOutId}/members`);
  }

}
