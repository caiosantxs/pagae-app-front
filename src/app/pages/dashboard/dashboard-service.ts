// dashboard-service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ParticipantBadgeDTO {
  label: string;
}

export interface RecentHangoutDTO {
  id: number;
  initial: string;
  title: string;
  date: string;
  status: string;
  total: number;
  hasPendingDebt: boolean;
  participants: ParticipantBadgeDTO[];
}

export interface DashboardStatsDTO {
  totalHangouts: number;
  totalOwed: number;
  totalReceivable: number;
  pendingDebtsCount: number;
  recentHangouts: RecentHangoutDTO[];
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private apiUrl = 'http://localhost:8080/api/dashboard';

  constructor(private http: HttpClient) {}

  getStats(): Observable<DashboardStatsDTO> {
    return this.http.get<DashboardStatsDTO>(`${this.apiUrl}/stats`);
  }
}
