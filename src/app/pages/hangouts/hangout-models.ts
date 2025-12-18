export interface HangOutResponseDTO {
  id: number;
  title: string;
  description: string;
  creatorId: number;
  creationDate: string; // Java manda LocalDate como string ISO '2025-12-05'
  statusHangOut: 'ATIVO' | 'FINALIZADO'; // Nome exato do campo no Java Record
  expenses: ExpenseResponseDTO[];
  members: string[]; // Lista de nomes (strings)
}
export interface ExpenseResponseDTO{
  id: number,
  description: string,
  totalAmount: number,
  hangout: HangOutResponseDTO,
  payments: Payment[]
}

export interface ExpenseShare{
  id: number,
  expenseId: number,
  user: User,
  amountOwed: number,
  isPaid: boolean
}

export interface Payment{
  id: number,
  amount: number,
  user: User
}

export interface User{
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
