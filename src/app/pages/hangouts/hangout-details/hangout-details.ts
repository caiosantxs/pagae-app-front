import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'app-hangout-details',
  imports: [ButtonModule, AvatarModule, MenuModule, RouterLink, CommonModule],
  templateUrl: './hangout-details.html',
  styleUrl: './hangout-details.scss',
})
export class HangoutDetails {
  constructor(private route: ActivatedRoute) {
  }

  details = {
    title: 'Churrasco da Turma',
    date: '20/11/2024',
    participantsCount: 6,
    totalCost: 470.50,
    userShare: 78.42,
    balance: 0,
    
    expenses: [
      { 
        id: 1, 
        title: 'Mercado (Carne)', 
        payer: 'Você', 
        amount: 350.00, 
        date: 'Hoje', 
        icon: 'pi pi-shopping-cart' 
      },
      { 
        id: 2, 
        title: 'Bebidas', 
        payer: 'Mariana', 
        amount: 120.50, 
        date: 'Hoje', 
        icon: 'pi pi-ticket' 
      }
    ],

    debts: [
      { 
        user: 'Mariana', 
        avatar: 'M', 
        amount: -50.00, 
        status: 'Deve para você', 
        color: 'text-red-500', 
        barColor: 'bg-red-400' 
      },
      { 
        user: 'Você', 
        avatar: 'V', 
        amount: 50.00, 
        status: 'Receber', 
        color: 'text-green-500', 
        barColor: 'bg-green-500' 
      }
    ]
  };
}
