import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardService, DashboardStatsDTO } from './dashboard-service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

  stats$?: Observable<DashboardStatsDTO>;

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {

    this.stats$ = this.dashboardService.getStats();
    console.log(this.stats$);
  }

}
