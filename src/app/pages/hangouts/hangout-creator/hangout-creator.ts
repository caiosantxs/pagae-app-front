import { Component } from '@angular/core';
import { HangOutRequestDTO } from '../hangout-models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HangoutsService } from '../hangouts-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-hangout-creator',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    MessageModule
  ],
  templateUrl: './hangout-creator.html',
  styleUrl: './hangout-creator.scss',
})
export class HangoutCreator {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private hangoutService: HangoutsService,
    private router: Router
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''] // Opcional no DTO
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // Mostra erros se o usuário tentar salvar vazio
      return;
    }

    this.loading = true;
    const data: HangOutRequestDTO = this.form.value;

    this.hangoutService.create(data).subscribe({
      next: () => {
        // Sucesso: Volta para a lista
        this.loading = false;
        this.router.navigate(['/hangouts']);
      },
      error: (err) => {
        console.error('Erro ao criar hangout', err);
        this.loading = false;
        // Aqui você poderia colocar um Toast/Notification de erro
      }
    });
  }
}
