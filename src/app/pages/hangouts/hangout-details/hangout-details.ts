import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';

import { HangoutsService } from '../hangouts-service';
import {
  ExpenseRequestDTO,
  ExpenseShare,
  HangOutResponseDTO,
  UserResponseDTO,
} from '../hangout-models';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { LoginService } from '../../auth/login/login-service';

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
    TextareaModule,
    MenuModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
    TooltipModule,
    SelectModule,
  ],
  providers: [ConfirmationService, MessageService],
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
    private router: Router,
    private loginService: LoginService,
  ) {
    this.currentUserId = this.loginService.getUserId();

    this.expenseForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      totalAmount: [null, [Validators.required, Validators.min(0.01)]],
      participantsIds: [[], Validators.required],
      payerId: [this.currentUserId, Validators.required],
    });

    this.editDescriptionForm = this.fb.group({
      description: ['', Validators.required],
    });
  }

  isLeaving: boolean = false;

  showMembers: boolean = false;
  maxPaymentAmount: number = 0;

  hangoutId!: number;
  hangout: HangOutResponseDTO | null = null;

  isLoading = true;
  myShareTotal: number = 0;

  currentUserId: number | null = null;

  menuItems: MenuItem[] = [];

  showExpenseDialog = false;
  expenseForm: FormGroup;
  loadingExpense = false;

  showEditDescriptionDialog = false;
  selectedExpenseForEdit: any = null;
  editDescriptionForm: FormGroup;

  showPaymentDialog = false;
  selectedExpense: any = null;
  paymentAmount: number | null = null;
  loadingPayment = false;

  memberOptions: any[] = [];

  showInviteDialog: boolean = false;
  inviteLink: string = '';

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
      },
    });
  }

  getTotalCost(): number {
    if (!this.hangout?.expenses) return 0;
    return this.hangout.expenses.reduce(
      (acc, curr) => acc + curr.totalAmount,
      0,
    );
  }

  getMyTotalPaid(): number {
    if (!this.hangout?.expenses) return 0;

    let totalPaid = 0;
    this.hangout.expenses.forEach((expense) => {
      const myPayment = expense.payments.find(
        (p) => p.user.id === this.currentUserId,
      );
      if (myPayment) {
        totalPaid += myPayment.amount;
      }
    });
    return totalPaid;
  }

  getMyDebt(expense: any): number {
    if (!this.currentUserId || !expense.shares) return 0;

    const myShare = expense.shares.find(
      (s: any) => s.user.id === this.currentUserId,
    );

    return myShare ? myShare.amountOwed : 0;
  }

  getPayerName(payer: UserResponseDTO): string {
    if (!payer) return 'Ninguém';
    if (payer.id === this.currentUserId) return 'Você';
    return payer.name;
  }

  getIcon(title: string): string {
    const t = (title || '').toLowerCase();
    if (t.includes('mercado') || t.includes('carne'))
      return 'pi pi-shopping-cart';
    if (t.includes('bebida') || t.includes('cerveja')) return 'pi pi-ticket';
    if (t.includes('uber') || t.includes('gasolina')) return 'pi pi-car';
    return 'pi pi-dollar';
  }

  calculateMyShare(hangOutId: number) {
    this.hangoutService
      .getExpenseSharesByUserIdAndHangOutId(hangOutId)
      .subscribe({
        next: (shares: ExpenseShare[]) => {
          this.myShareTotal = shares.reduce(
            (acc, share) => acc + share.amountOwed,
            0,
          );
        },
        error: (err) => {
          if (err.status === 404) {
            this.myShareTotal = 0;
          } else {
            console.error('Erro ao buscar share', err);
          }
        },
      });
  }

  getBalance(): number {
    return this.getMyTotalPaid() - this.myShareTotal;
  }

  openNewExpense() {
    if (this.hangout?.statusHangOut === 'FINALIZADO') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Rolê Finalizado',
        detail: 'Não é possível adicionar despesas a um rolê finalizado.',
      });
      return;
    }
    this.expenseForm.reset();
    this.expenseForm.patchValue({
      payerId: this.currentUserId,
      participantsIds: [],
    });
    this.showExpenseDialog = true;
  }

  saveExpense() {
    if (this.expenseForm.invalid) return;

    this.loadingExpense = true;
    const formValue = this.expenseForm.value;

    const dto: ExpenseRequestDTO = {
      name: formValue.name,
      description: formValue.description,
      totalAmount: formValue.totalAmount,
      participantsIds: formValue.participantsIds,
      payerId: formValue.payerId,
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
      },
    });
  }

  onLeaveHangout() {
    if (this.hangout?.creatorId === this.currentUserId) {
      this.messageService.add({
        summary:
          'Você é o criador do rolê, para sair do rolê você deve excluí-lo',
      });
    }

    this.confirmationService.confirm({
      message:
        'Você tem certeza que quer sair deste rolê? Se você tiver despesas pendentes, a saída será bloqueada.',
      header: 'Sair do Rolê',
      icon: 'pi pi-sign-out',
      acceptLabel: 'Sim, quero sair',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass:
        '!bg-[#FF4545] !border-2 !border-black !text-white !font-black !rounded-xl !p-3 !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:!translate-y-[-2px] hover:!shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:!translate-y-[2px] active:!shadow-none transition-all',
      rejectButtonStyleClass:
        '!bg-white !border-2 !border-black !text-black !font-black !rounded-xl !p-3 hover:!bg-gray-100 transition-all mr-3',

      accept: () => {
        this.isLeaving = true;
        this.hangoutService.leaveHangout(this.hangoutId).subscribe({
          next: () => {
            this.isLeaving = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Tchau!',
              detail: 'Você saiu do rolê com sucesso.',
            });
            this.router.navigate(['/app/hangouts']);
          },
          error: (err) => {
            this.isLeaving = false;
            let errorMsg = 'Não foi possível sair do rolê neste momento.';
            if (err.error && typeof err.error === 'string') {
              errorMsg = err.error;
            } else if (err.error && err.error.message) {
              errorMsg = err.error.message;
            }

            this.messageService.add({
              severity: 'error',
              summary: 'Acesso Negado',
              detail: errorMsg,
              life: 5000,
            });
          },
        });
      },
    });
  }

  openAddDescriptionDialog(expense: any) {
    this.selectedExpenseForEdit = expense;
    this.editDescriptionForm.patchValue({
      description: expense.description || '',
    });
    this.showEditDescriptionDialog = true;
  }

  saveDescription() {
    if (this.editDescriptionForm.invalid || !this.selectedExpenseForEdit)
      return;

    const newDescription = this.editDescriptionForm.value.description;

    this.hangoutService
      .updateExpenseDescription(
        this.hangoutId,
        this.selectedExpenseForEdit.id,
        newDescription,
      )
      .subscribe({
        next: () => {
          this.showEditDescriptionDialog = false;
          this.loadHangout(this.hangoutId);
          this.messageService.add({
            severity: 'success',
            summary: 'Sucesso',
            detail: 'Descrição atualizada com sucesso!',
          });
        },
        error: (err) => {
          console.error('Erro ao atualizar', err);
          const msg =
            err.error && typeof err.error === 'string'
              ? err.error
              : 'Não foi possível atualizar a descrição.';
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: msg,
          });
        },
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
            visible: this.hangout?.statusHangOut === 'ATIVO',
            command: () => {
              this.confirmFinalize();
            },
          },
          {
            label: 'Reabrir Rolê',
            icon: 'pi pi-refresh',
            visible: this.hangout?.statusHangOut === 'FINALIZADO',
            command: () => {
              this.hangoutService.open(this.hangoutId).subscribe(() => {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Sucesso',
                  detail: 'Rolê reaberto!',
                });
                this.loadHangout(this.hangoutId);
              });
            },
          },
          {
            separator: true,
          },
          {
            label: 'Excluir',
            icon: 'pi pi-trash',
            styleClass: 'text-red-500',
            command: () => {
              this.confirmDelete();
            },
          },
        ],
      },
    ];
  }

  confirmFinalize() {
    this.confirmationService.confirm({
      message:
        'Tem certeza que deseja finalizar este rolê? Ninguém poderá adicionar novas despesas.',
      header: 'Finalizar Rolê',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, finalizar',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-success',
      accept: () => {
        if (this.hangoutId) {
          this.hangoutService.finalize(this.hangoutId).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Rolê finalizado!',
            });
            this.loadHangout(this.hangoutId);
          });
        }
      },
    });
  }

  confirmDelete() {
    this.confirmationService.confirm({
      message:
        'Tem certeza que deseja apagar este rolê e todas as despesas? Essa ação não pode ser desfeita.',
      header: 'Excluir Rolê',
      icon: 'pi pi-info-circle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (this.hangoutId) {
          this.hangoutService.delete(this.hangoutId).subscribe(() => {
            this.router.navigate(['/app/hangouts']);
          });
        }
      },
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

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    });
  }

  getDisplayName(payerId: number, payerName: string): string {
    return payerId === this.currentUserId ? 'Você' : payerName;
  }

  openPaymentModal(expense: any) {
    this.selectedExpense = expense;
    this.paymentAmount = null;
    this.maxPaymentAmount = this.getMyDebt(expense);
    this.showPaymentDialog = true;
  }

  confirmPayment() {
    if (!this.selectedExpense || !this.paymentAmount) return;

    this.loadingPayment = true;

    this.hangoutService
      .settleExpense(this.selectedExpense.id, this.paymentAmount)
      .subscribe({
        next: () => {
          this.loadingPayment = false;
          this.showPaymentDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Pago!',
            detail: 'Pagamento registrado.',
          });

          if (this.hangoutId) {
            this.loadHangout(this.hangoutId);
          }
        },
        error: (err) => {
          console.error('Erro no pagamento', err);
          this.loadingPayment = false;
        },
      });
  }

  isPayer(expense: any): boolean {
    return this.currentUserId == expense.payer.id;
  }

  getMyShareAmount(expense: any): number {
    if (!this.currentUserId || !expense.shares) return 0;
    const myShare = expense.shares.find(
      (s: any) => s.user.id === this.currentUserId,
    );
    return myShare ? myShare.amountOwed : 0;
  }

  getReceivables(): {
    debtorName: string;
    expenseName: string;
    amount: number;
  }[] {
    const receivables: any[] = [];
    if (!this.hangout || !this.currentUserId) return receivables;

    this.hangout.expenses.forEach((expense) => {
      if (this.isPayer(expense)) {
        if (expense.shares) {
          expense.shares.forEach((share: any) => {
            if (share.user.id != this.currentUserId && share.amountOwed > 0) {
              receivables.push({
                debtorName: share.user.name,
                expenseName: expense.name,
                amount: share.amountOwed,
              });
            }
          });
        }
      }
    });

    return receivables;
  }

  getReceivableAmount(expense: any): number {
    if (!this.isPayer(expense) || !expense.shares) return 0;

    const totalPending = expense.shares.reduce((acc: number, share: any) => {
      if (share.user.id != this.currentUserId) {
        return acc + share.amountOwed;
      }
      return acc;
    }, 0);

    return totalPending;
  }

  isCreator(): boolean {
    return this.hangout?.creatorId === this.currentUserId;
  }

  isExpenseCreator(expense: any): boolean {
    if (!expense) {
      return false;
    }

    return expense.creator?.id === this.currentUserId;
  }

  deleteExpense(expenseId: number, event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    if (
      !this.isExpenseCreator(
        this.hangout?.expenses.find((e) => e.id === expenseId),
      )
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atenção',
        detail: 'Somente o criador da despesa pode excluí-la.',
      });
      return;
    }

    this.confirmationService.confirm({
      message: 'Essa ação não tem volta. Quer mesmo apagar?',
      header: 'Excluir Despesa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sim, excluir',
      rejectLabel: 'Cancelar',

      acceptButtonStyleClass:
        '!bg-red-500 !border-2 !border-black !text-white !font-black !rounded-xl !p-3 !shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:!translate-y-[-2px] hover:!shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:!translate-y-[2px] active:!shadow-none transition-all',
      rejectButtonStyleClass:
        '!bg-white !border-2 !border-black !text-black !font-black !rounded-xl !p-3 hover:!bg-gray-100 transition-all mr-3',
      accept: () => {
        this.hangoutService.deleteExpense(expenseId).subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Foi pro espaço! 🚀',
              detail: 'Despesa excluída com sucesso.',
            });
            if (this.hangoutId) {
              this.loadHangout(this.hangoutId);
              this.calculateMyShare(this.hangoutId);
            }
          },
          error: (err) => {
            console.error('Erro ao excluir despesa', err);
            this.messageService.add({
              severity: 'error',
              summary: 'Ocorreu um erro',
              detail: 'Falha ao excluir despesa.',
            });
          },
        });
      },
    });
  }

  openInviteModal() {
    if (!this.hangout) return;

    const baseUrl = window.location.origin;
    this.inviteLink = `${baseUrl}/app/join/${this.hangout.id}`;

    this.showInviteDialog = true;
  }

  copyInviteLink() {
    navigator.clipboard
      .writeText(this.inviteLink)
      .then(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Link copiado para a área de transferência!',
        });
        this.showInviteDialog = false;
      })
      .catch((err) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao copiar link',
        });
      });
  }

  getCreatorName(): string {
    const currentHangout = this.hangout;

    if (!currentHangout) return 'Carregando...';

    const creator = currentHangout.members.find(
      (m) => m.id === currentHangout.creatorId,
    );

    return creator ? creator.name : 'Desconhecido';
  }
}
