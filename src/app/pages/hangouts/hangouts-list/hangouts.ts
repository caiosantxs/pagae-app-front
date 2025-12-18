import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { ExpenseResponseDTO, HangOutResponseDTO } from '../hangout-models';
import { HangoutsService } from '../hangouts-service';

@Component({
  selector: 'app-hangouts',
  imports: [
    CommonModule,
    ButtonModule,
    AvatarGroupModule,
    AvatarModule
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

    // Assumindo que seu service retorna um Observable<Page<HangOutResponseDTO>>
    this.hangOutService.getUserHangouts(this.currentPage, this.pageSize)
      .subscribe({
        next: (pageData) => {
          // Concatena os novos itens aos existentes
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

  // --- Métodos Auxiliares para tratar os dados do Back-end na View ---

  /**
   * Pega a primeira letra de uma string.
   * Ex: "Churrasco" -> "C", "Gabriel" -> "G"
   */
  getInitial(text: string): string {
    return text ? text.charAt(0).toUpperCase() : '?';
  }

  /**
   * Calcula o total somando a lista de expenses que veio do Java.
   */
  calculateTotal(expenses: ExpenseResponseDTO[]): number {
    if (!expenses || expenses.length === 0) return 0;
    // Assumindo que o objeto expense tem a propriedade 'amount' ou 'value'
    return expenses.reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  }
}
