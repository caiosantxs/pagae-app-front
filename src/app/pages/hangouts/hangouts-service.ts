import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../enviroments/enviroment';
import { Observable } from 'rxjs';
import {
  ExpenseRequestDTO,
  ExpenseShare,
  HangOutRequestDTO,
  HangOutResponseDTO,
  Page,
  UserResponseDTO,
} from './hangout-models';

@Injectable({
  providedIn: 'root',
})
export class HangoutsService {
  private apiUrl = `${environment.apiUrl}/hangouts`;

  constructor(private http: HttpClient) {}

  getUserHangouts(
    page: number = 0,
    size: number = 10
  ): Observable<Page<HangOutResponseDTO>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sort', 'creationDate,desc');

    return this.http.get<Page<HangOutResponseDTO>>(this.apiUrl, { params });
  }

  getHangOutMembers(hangOutId: number): Observable<UserResponseDTO[]> {
    return this.http.get<UserResponseDTO[]>(
      `${this.apiUrl}/${hangOutId}/members`
    );
  }

  getById(id: number): Observable<HangOutResponseDTO> {
    return this.http.get<HangOutResponseDTO>(`${this.apiUrl}/${id}`);
  }

  getExpenseSharesByUserIdAndHangOutId(
    hangoutId: number
  ): Observable<ExpenseShare[]> {
    return this.http.get<any>(`${this.apiUrl}/${hangoutId}/expense-shares`);
  }

  create(hangoutData: HangOutRequestDTO): Observable<HangOutResponseDTO> {
    return this.http.post<HangOutResponseDTO>(this.apiUrl, hangoutData);
  }

  createExpense(hangoutId: number, data: ExpenseRequestDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/${hangoutId}/expenses`, data);
  }

  finalize(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/finalize`, {});
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  settleExpense(expenseId: number, amount: number): Observable<void> {
    // O Backend espera: PaymentRequestDTO com apenas "amount"
    const payload = { amount: amount };

    // A URL mudou no seu último código Java para: /{expenseId}/payments
    return this.http.post<void>(
      `${this.apiUrl}/expenses/${expenseId}/payments`, // <--- Ajuste a URL aqui
      payload
    );
  }
}
