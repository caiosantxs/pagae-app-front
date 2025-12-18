import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { HangoutsService } from '../hangouts-service';
import { ExpenseShare, HangOutResponseDTO, PaymentResponseDTO } from '../hangout-models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-hangout-details',
  imports: [ButtonModule, AvatarModule, MenuModule, RouterLink, CommonModule],
  templateUrl: './hangout-details.html',
  styleUrl: './hangout-details.scss',
})
export class HangoutDetails {
  constructor(
    private route: ActivatedRoute,
    private hangoutService: HangoutsService
  ) {}

  hangout: HangOutResponseDTO | null = null;
  isLoading = true;
  myShareTotal: number = 0;

  currentUserId = 1;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const hangoutId = Number(id);
      this.loadHangout(hangoutId);
      this.calculateMyShare(hangoutId);
    }
  }

  loadHangout(id: number) {
    this.isLoading = true;
    this.hangoutService.getById(id).subscribe({
      next: (data) => {
        this.hangout = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar hangout', err);
        this.isLoading = false;
      }
    });
  }

  getTotalCost(): number {
    if (!this.hangout?.expenses) return 0;
    return this.hangout.expenses.reduce((acc, curr) => acc + curr.totalAmount, 0);
  }

  getMyTotalPaid(): number {
    if (!this.hangout?.expenses) return 0;

    let totalPaid = 0;
    this.hangout.expenses.forEach(expense => {
      const myPayment = expense.payments.find(p => p.user.id === this.currentUserId);
      if (myPayment) {
        totalPaid += myPayment.amount;
      }
    });
    return totalPaid;
  }

  getPayerName(payments: PaymentResponseDTO[]): string {
    if (!payments || payments.length === 0) return 'Ninguém';
    // Se fui eu
    if (payments[0].user.id === this.currentUserId) return 'Você';
    return payments[0].user.name;
  }

  getIcon(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('mercado') || t.includes('carne')) return 'pi pi-shopping-cart';
    if (t.includes('bebida') || t.includes('cerveja')) return 'pi pi-ticket';
    if (t.includes('uber') || t.includes('gasolina')) return 'pi pi-car';
    return 'pi pi-dollar';
  }

  calculateMyShare(hangOutId: number) {
    this.hangoutService.getExpenseSharesByUserIdAndHangOutId(hangOutId)
      .subscribe({
        next: (shares: ExpenseShare[]) => {
          this.myShareTotal = shares.reduce((acc, share) => acc + share.amountOwed, 0);
        },
        error: (err) => {
          if (err.status === 404) {
             this.myShareTotal = 0;
          } else {
             console.error('Erro ao buscar share', err);
          }
        }
      });
  }

  getBalance(): number {
    return this.getMyTotalPaid() - this.myShareTotal;
  }

}
