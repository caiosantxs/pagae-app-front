import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { AvatarGroupModule } from 'primeng/avatargroup';

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
  hangouts = [
    {
      initial: 'd',
      title: 'dasda',
      date: '05/12/2025',
      status: 'ATIVO',
      total: 0,
      participants: [{label: 'A'}]
    },
    {
      initial: 'C',
      title: 'Churrasco da Turma',
      date: '20/11/2024',
      status: 'ATIVO',
      total: 840.50,
      participants: [{label: 'A'}, {label: 'B'}, {label: 'C'}, {label: 'D'}]
    },
    {
      initial: 'V',
      title: 'Viagem Cabo Frio',
      date: '12/10/2024',
      status: 'FINALIZADO',
      total: 2450.00,
      participants: [{label: 'X'}, {label: 'Y'}, {label: 'Z'}]
    }
  ];
}
