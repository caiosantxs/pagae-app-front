import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { passwordMatchValidator } from '../../validators/password-match.validator';
import { LoginService } from '../login/login-service';
import { ToastrService } from 'ngx-toastr';


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
    ReactiveFormsModule
  ],
  providers: [LoginService, ToastrService],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  password: string = '';
  confirmPassword: string = '';

  registerForm!: FormGroup;

  constructor(
    private loginService: LoginService,
    private toastService: ToastrService,
    private router: Router
  ) {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      username: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
    },
    {
      validators: passwordMatchValidator
    }
  );
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
