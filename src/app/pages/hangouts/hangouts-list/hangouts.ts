import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ExpenseResponseDTO, HangOutResponseDTO } from '../hangout-models';
import { HangoutsService } from '../hangouts-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-hangouts',
  imports: [
    CommonModule,
    ButtonModule,
    AvatarGroupModule,
    AvatarModule,
    RouterLink
  ],
  templateUrl: './hangouts.html',
  styleUrl: './hangouts.scss',
})
export class Hangouts {

  hangouts: HangOutResponseDTO[] = [];
  currentPage = 0;
  pageSize = 9;
  hasMore = true;
  loading = false;

  constructor(private hangOutService: HangoutsService) {}

  ngOnInit() {
    this.loadHangouts();
  }

  loadHangouts() {
    if (this.loading) return;
    this.loading = true;

    this.hangOutService.getUserHangouts(this.currentPage, this.pageSize)
      .subscribe({
        next: (pageData) => {
          this.hangouts = [...this.hangouts, ...pageData.content];

          this.hasMore = !pageData.last;
          this.currentPage++;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
  }

  getInitial(text: string): string {
    return text ? text.charAt(0).toUpperCase() : '?';
  }

  calculateTotal(expenses: ExpenseResponseDTO[]): number {
    if (!expenses || expenses.length === 0) return 0;
    return expenses.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  }

}
