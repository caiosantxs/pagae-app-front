import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { LoginService } from './login-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  imports: [
    RouterLink,
    FormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    DividerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginForm!: FormGroup;
  password?: string;

  currentUserId: number | null = null;

  constructor(
    private loginService: LoginService,
    private toastService: ToastrService,
    private router: Router,
  ) {
    this.loginForm = new FormGroup({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      username: new FormControl('', [Validators.required]),
    });
  }

  onDestroy() {
    this.loginForm.reset();
  }

  submit() {
    this.loginService
      .login(this.loginForm.value.username, this.loginForm.value.password)
      .subscribe({
        next: () => {
          this.currentUserId = this.loginService.getUserId();
          this.toastService.success('Login realizado com sucesso!');

          const redirectUrl = sessionStorage.getItem('redirectUrl');

          if (redirectUrl) {
            sessionStorage.removeItem('redirectUrl');
            // CORREÇÃO AQUI: Use navigateByUrl para strings completas
            this.router.navigateByUrl(redirectUrl);
          } else {
            this.router.navigate(['/app/dashboard']);
          }
          this.loginForm.reset();
        },
        error: () => {
          this.toastService.error(
            'Login falhou. Verifique suas credenciais e tente novamente.',
          );
        },
      });
  }
}
