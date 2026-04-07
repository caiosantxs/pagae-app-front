import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { passwordMatchValidator } from '../../../validators/password-match.validator';
import { LoginService } from '../login/login-service';
import { ToastrService } from 'ngx-toastr';
import { SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-register',
  imports: [
    ButtonModule,
    InputTextModule,
    CommonModule,
    PasswordModule,
    RouterLink,
    FormsModule,
    DividerModule,
    ReactiveFormsModule,
    GoogleSigninButtonModule
  ],
  providers: [LoginService, ToastrService],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit, OnDestroy {
  password: string = '';
  confirmPassword: string = '';

  registerForm!: FormGroup;
  private authSubscription?: Subscription;

  constructor(
    private loginService: LoginService,
    private toastService: ToastrService,
    private router: Router,
    private socialAuthService: SocialAuthService
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)])
    },
    {
      validators: passwordMatchValidator
    }
  );
  }

  ngOnInit() {
    this.authSubscription = this.socialAuthService.authState.subscribe((user) => {
      if (user && user.idToken) {
        this.loginService.loginWithGoogle(user.idToken).subscribe({
          next: () => {
            this.toastService.success('Login com Google realizado com sucesso!');
            this.router.navigate(['/app/dashboard']);
          },
          error: () => {
            this.toastService.error(
              'Login com Google falhou. Tente novamente.',
            );
          },
        });
      }
    });
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
  }

  submit(){
    this.loginService.register(
      this.registerForm.value.name ,
      this.registerForm.value.username,
      this.registerForm.value.email ,
      this.registerForm.value.password
    ).subscribe({
      next: () => {
        this.toastService.success('Sign up successful!');
        this.router.navigate(['/login']);
      },
      error: () => {
        this.toastService.error('Sign up failed. Please check your credentials.')
      }
    });
  }

}

