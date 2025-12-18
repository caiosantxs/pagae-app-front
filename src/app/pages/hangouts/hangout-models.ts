export interface HangOutResponseDTO {
  id: number;
  title: string;
  description: string;
  creatorId: number;
  creationDate: string;
  statusHangOut: 'ATIVO' | 'FINALIZADO';
  expenses: ExpenseResponseDTO[];
  members: string[];
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
}

export interface ExpenseShare{
  id: number,
  expenseId: number,
  user: UserResponseDTO,
  amountOwed: number,
  isPaid: boolean
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

export interface Page<T> {
  content: T[];          // A lista de itens real
  totalElements: number; // Total de itens no banco inteiro
  totalPages: number;    // Total de páginas
  size: number;          // Tamanho da página
  number: number;        // Página atual (começa em 0)
  first: boolean;
  last: boolean;
  empty: boolean;
}

enum StatusHangout{
  INATIVO =  'INATIVO',
  ATIVO = 'ATIVO'
}
