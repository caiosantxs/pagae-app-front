import { Component } from '@angular/core';
import { Devendo2DTO } from '../hangouts/hangout-models';
import { ExpenseService } from '../expenses/expense-service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ConfirmDialog, ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-simplificar-dividas',
  imports: [
    CommonModule,
    ConfirmDialogModule,
    ToastModule
  ],
  templateUrl: './simplificar-dividas.html',
  styleUrl: './simplificar-dividas.scss',
  providers: [ConfirmationService, MessageService]
})
export class SimplificarDividas {
  possiveisDescontos: Devendo2DTO[] = [];
  isLoading = false;

  constructor(
    private expenseService: ExpenseService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.carregarDescontos();
  }

  carregarDescontos(): void {
    this.isLoading = true;
    this.expenseService.getDescontosMutuos().subscribe({
      next: (data) => {
        this.possiveisDescontos = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao buscar descontos', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Não foi possível carregar os saldos.' });
        this.isLoading = false;
      }
    });
  }

  confirmarSimplificacao(desconto: Devendo2DTO): void {
    const valorAbatido = Math.min(desconto.quantoDevo, desconto.quantoMeDeve);

    this.confirmationService.confirm({
      message: `Isso vai abater <b>R$ ${valorAbatido.toFixed(2)}</b> das dívidas mútuas entre você e ${desconto.name}. Deseja continuar?`,
      header: 'Confirmar Simplificação',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sim, simplificar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        this.aplicarDesconto(desconto.userId);
      }
    });
  }

  private aplicarDesconto(targetUserId: number): void {
    this.expenseService.aplicarDesconto(targetUserId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Sucesso!', detail: 'Dívidas simplificadas.' });
        this.carregarDescontos();
      },
      error: (err) => {
        console.error('Erro ao aplicar desconto', err);
        this.messageService.add({ severity: 'error', summary: 'Erro', detail: 'Falha ao simplificar dívida.' });
      }
    });
  }
}
