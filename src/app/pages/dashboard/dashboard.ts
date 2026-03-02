import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardService, DashboardStatsDTO } from './dashboard-service';
import { LoginService } from '../login/login-service';
import { AvatarGroup } from 'primeng/avatargroup';
import { Avatar } from 'primeng/avatar';
import { RouterModule } from '@angular/router';
import { ButtonDirective } from "primeng/button"; // Necessário para o routerLink

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, AvatarGroup, Avatar, RouterModule, ButtonDirective],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

  userName: string = 'Viajante';
  stats$?: Observable<DashboardStatsDTO>;

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
