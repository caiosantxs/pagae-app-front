import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardService, DashboardStatsDTO } from './dashboard-service';
import { LoginService } from '../login/login-service';
import { AvatarGroup } from 'primeng/avatargroup';
import { Avatar } from 'primeng/avatar';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, AvatarGroup, Avatar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  userName: string = 'Viajante';
  stats$?: Observable<DashboardStatsDTO>;

  recentHangouts = [
    {
      initial: 'd',
      title: 'dasda',
      date: '05/12/2025',
      status: 'ATIVO',
      total: 0,
      participants: [{label: 'A'}]
    },
    {
      initial: 'C',
      title: 'Churrasco da Turma',
      date: '20/11/2024',
      status: 'ATIVO',
      total: 840.50,
      participants: [{label: 'A'}, {label: 'B'}, {label: 'C'}, {label: 'D'}]
    },
    {
      initial: 'V',
      title: 'Viagem Cabo Frio',
      date: '12/10/2024',
      status: 'FINALIZADO',
      total: 2450.00,
      participants: [{label: 'X'}, {label: 'Y'}, {label: 'Z'}]
    }
  ];

  constructor(
    private dashboardService: DashboardService,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {

    const storedName = this.loginService.getUsername();
    if (storedName) {
      this.userName = storedName.split(' ')[0];
    }

    this.stats$ = this.dashboardService.getStats();
  }
}
