export interface HangOutResponseDTO {
  id: number;
  title: string;
  description: string;
  creatorId: number;
  creationDate: string;
  statusHangOut: 'ATIVO' | 'FINALIZADO';
  hasPendingDebts: boolean;
  expenses: ExpenseResponseDTO[];
  members: MemberDTO[];

  recentActivities: PaymentActivityDTO[];
}

export interface HangOutRequestDTO {
  title: string;
  description: string;
}

export interface ExpenseResponseDTO{
  id: number,
  description: string,
  totalAmount: number,
  hangout: HangOutResponseDTO,
  payments: PaymentResponseDTO[]
  creator: UserResponseDTO,
  payer: UserResponseDTO,
  date: string

  shares: ExpenseShare[];
}

export interface ExpenseShare {
  id: number;
  expenseId: number;
  user: UserResponseDTO;
  amountOwed: number;
  isPaid: boolean;
}

export interface PaymentResponseDTO{
  id: number,
  amount: number,
  user: UserResponseDTO
}

export interface UserResponseDTO{
  id: number,
  name: string,
  login: string,
  email: string,
  role: string
}

export interface PaymentActivityDTO {
  id: number;
  payerName: string;
  description: string;
  amount: number;
  date: string;
  payerId: number;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface ExpenseRequestDTO {
  description: string;
  totalAmount: number;
  participantsIds: number[];
  payerId: number;
}

export interface MemberDTO {
  id: number;
  name: string;
}

export interface Devendo2DTO {
  userId: number;
  name: string;
  quantoDevo: number;
  quantoMeDeve: number;
  saldoLiquido: number;
}

enum StatusHangout{
  INATIVO =  'INATIVO',
  ATIVO = 'ATIVO'
}
