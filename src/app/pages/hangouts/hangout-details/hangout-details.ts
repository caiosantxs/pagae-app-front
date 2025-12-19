import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast'

import { HangoutsService } from '../hangouts-service';
import { ExpenseRequestDTO, ExpenseShare, HangOutResponseDTO, PaymentResponseDTO } from '../hangout-models';
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
    ToastModule
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

  getPayerName(payments: PaymentResponseDTO[]): string {
    if (!payments || payments.length === 0) return 'Ninguém';
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
}
