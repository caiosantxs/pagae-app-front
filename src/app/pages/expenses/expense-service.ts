import { Injectable } from '@angular/core';
import { environment } from '../../../enviroments/enviroment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Devendo2DTO } from '../hangouts/hangout-models';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private apiUrl = `${environment.apiUrl}/expenses`;

  constructor(private http: HttpClient) {}

  getDescontosMutuos(): Observable<Devendo2DTO[]> {
    return this.http.get<Devendo2DTO[]>(`${this.apiUrl}/descontos`);
  }

  aplicarDesconto(targetUserId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/descontos/aplicar/${targetUserId}`, {}, { responseType: 'text' });
  }
}
