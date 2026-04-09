import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ForgotPasswordDTO } from '../../../types/login-response.type';
import { LoginService } from '../login/login-service';

@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonModule, 
    InputTextModule, 
    ToastModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
  providers: [MessageService]
})
export class ForgotPassword {
  forgotForm: FormGroup;
  isLoading: boolean = false;
  emailSent: boolean = false; // Controla se mostramos o form ou a mensagem de sucesso

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private messageService: MessageService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit() {
    if (this.forgotForm.invalid) return;

    this.isLoading = true;
    const dto: ForgotPasswordDTO = {
      email: this.forgotForm.value.email
    };

    this.loginService.forgotPassword(dto).subscribe({
      next: () => {
        this.isLoading = false;
        this.emailSent = true; // Muda a tela para a mensagem de sucesso
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Ops!',
          detail: 'Houve um problema ao tentar enviar o e-mail. Tente novamente mais tarde.'
        });
      }
    });
  }
}
