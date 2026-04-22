import { Component } from '@angular/core';
import { ResetPasswordDTO } from '../../../types/login-response.type';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { LoginService } from '../login/login-service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-reset-passord',
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    ButtonModule, 
    InputTextModule, 
    ToastModule,
    RouterLink
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
  providers: [MessageService]
})
export class ResetPassword {
  resetForm: FormGroup;
  token: string | null = null;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private messageService: MessageService
  ) {
    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });
  }

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');

    if (!this.token) {
      this.messageService.add({
        severity: 'error',
        summary: 'Link Inválido',
        detail: 'O token de recuperação não foi encontrado. Solicite um novo link.'
      });
    }
  }

  passwordsMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    
    if (password !== confirmPassword && confirmPassword !== '') {
      control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    return null;
  }

  onSubmit() {
    if (this.resetForm.invalid || !this.token) return;

    this.isLoading = true;
    const dto: ResetPasswordDTO = {
      token: this.token,
      newPassword: this.resetForm.value.password
    };

    this.loginService.resetPassword(dto).subscribe({
      next: () => {
        this.isLoading = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Senha Redefinida! 🚀',
          detail: 'Sua nova senha foi salva. Redirecionando para o login...'
        });
        
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error(err);
        this.messageService.add({
          severity: 'error',
          summary: 'Ops!',
          detail: 'O link expirou ou é inválido. Tente recuperar a senha novamente.'
        });
      }
    });
  }
}
