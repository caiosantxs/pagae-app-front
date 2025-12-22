import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast'

import { HangoutsService } from '../hangouts-service';
import { ExpenseRequestDTO, ExpenseShare, HangOutResponseDTO, PaymentResponseDTO, UserResponseDTO } from '../hangout-models';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';

@Component({
  selector: 'app-hangout-details',
  imports: [
    ButtonModule,
    AvatarModule,
    MenuModule,
    RouterLink,
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    InputNumberModule,
    MultiSelectModule,
    InputTextModule,
    MenuModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule
  ],
  providers:[ConfirmationService, MessageService],
  templateUrl: './hangout-details.html',
  styleUrl: './hangout-details.scss',
})
export class HangoutDetails {
  constructor(
    private route: ActivatedRoute,
    private hangoutService: HangoutsService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      totalAmount: [null, [Validators.required, Validators.min(0.01)]],
      participantsIds: [[], Validators.required]
    });
  }

  hangoutId!: number;
  hangout: HangOutResponseDTO | null = null;

  isLoading = true;
  myShareTotal: number = 0;

  currentUserId = 1;

  menuItems: MenuItem[] = [];

  showExpenseDialog = false;
  expenseForm: FormGroup;
  loadingExpense = false;

  showPaymentDialog = false;
  selectedExpense: any = null; // Guarda a despesa clicada
  paymentAmount: number | null = null;
  loadingPayment = false;

  memberOptions: any[] = [];

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.hangoutId = Number(id);

      this.loadHangout(this.hangoutId);
      this.calculateMyShare(this.hangoutId);
    }
  }

  loadHangout(id: number) {
    this.isLoading = true;
    this.hangoutService.getById(id).subscribe({
      next: (data) => {
        this.hangout = data;
        this.memberOptions = data.members || [];
        this.updateMenuOptions();

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

  getMyDebt(expense: any): number {
  // Proteção contra nulos
  if (!this.currentUserId || !expense.shares) return 0;

  // AJUSTE AQUI: s.user.id em vez de s.userId
  const myShare = expense.shares.find((s: any) => s.user.id === this.currentUserId);

  return myShare ? myShare.amountOwed : 0;
}

  getPayerName(payer: UserResponseDTO): string {
    if (!payer) return 'Ninguém';
    if (payer.id === this.currentUserId) return 'Você';
    return payer.name;
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

  openNewExpense() {
    this.expenseForm.reset();
    this.showExpenseDialog = true;
  }

  saveExpense() {
    if (this.expenseForm.invalid) return;

    this.loadingExpense = true;
    const formValue = this.expenseForm.value;

    const dto: ExpenseRequestDTO = {
      description: formValue.description,
      totalAmount: formValue.totalAmount,
      participantsIds: formValue.participantsIds
    };

    this.hangoutService.createExpense(this.hangoutId, dto).subscribe({
      next: () => {
        this.showExpenseDialog = false;
        this.loadingExpense = false;
        this.loadHangout(this.hangoutId);
        this.calculateMyShare(this.hangoutId);
      },
      error: (err) => {
        console.error('Erro ao salvar despesa', err);
        this.loadingExpense = false;
      }
    });
  }

updateMenuOptions() {
    this.menuItems = [
      {
        label: 'Ações do Rolê',
        items: [
          {
            label: 'Finalizar Rolê',
            icon: 'pi pi-check-circle',
            visible: this.hangout?.statusHangOut === 'ATIVO', // Só mostra se estiver ativo
            command: () => {
              this.confirmFinalize();
            }
          },
          {
            label: 'Reabrir Rolê', // Opcional: caso queira desfazer
            icon: 'pi pi-refresh',
            visible: this.hangout?.statusHangOut === 'FINALIZADO',
            command: () => {
              // Lógica similar ao finalizar, se quiser implementar
            }
          },
          {
            separator: true
          },
          {
            label: 'Excluir',
            icon: 'pi pi-trash',
            styleClass: 'text-red-500', // Deixa o texto vermelho (opcional)
            command: () => {
              this.confirmDelete();
            }
          }
        ]
      }
    ];
  }

  confirmFinalize() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja finalizar este rolê? Ninguém poderá adicionar novas despesas.',
      header: 'Finalizar Rolê',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, finalizar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        if (this.hangoutId) {
          this.hangoutService.finalize(this.hangoutId).subscribe(() => {
             this.messageService.add({severity:'success', summary:'Sucesso', detail:'Rolê finalizado!'});
             this.loadHangout(this.hangoutId); // Recarrega para atualizar a tela
          });
        }
      }
    });
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message: 'Tem certeza que deseja apagar este rolê e todas as despesas? Essa ação não pode ser desfeita.',
      header: 'Excluir Rolê',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (this.hangoutId) {
          this.hangoutService.delete(this.hangoutId).subscribe(() => {
             // Redireciona para a lista de rolês
             this.router.navigate(['/app/hangouts']);
          });
        }
      }
    });
  }


  formatDateFriendly(dateString: string): string {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return 'Hoje';
    if (isYesterday) return 'Ontem';

    // Se for mais antigo, retorna dia/mês (ex: 15/12)
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }

  // Helper para mostrar "Você" se for o usuário logado
  getDisplayName(payerId: number, payerName: string): string {
    return payerId === this.currentUserId ? 'Você' : payerName;
  }

  openPaymentModal(expense: any) {
    this.selectedExpense = expense;
    this.paymentAmount = null; // Reseta o valor
    this.showPaymentDialog = true;
  }

  confirmPayment() {
  if (!this.selectedExpense || !this.paymentAmount) return;

  this.loadingPayment = true;

  // Chama o service passando apenas o ID da despesa e o Valor digitado
  this.hangoutService.settleExpense(this.selectedExpense.id, this.paymentAmount)
    .subscribe({
      next: () => {
        this.loadingPayment = false;
        this.showPaymentDialog = false;
        this.messageService.add({severity:'success', summary:'Pago!', detail:'Pagamento registrado.'});

        // Atualiza a tela para mostrar o novo saldo
        if (this.hangoutId) {
           this.loadHangout(this.hangoutId);
        }
      },
      error: (err) => {
        console.error('Erro no pagamento', err);
        this.loadingPayment = false;
        // Dica: Trate o erro 400 ou 403 aqui para mostrar mensagem amigável
      }
    });
}
}
