import { Component } from '@angular/core';
import { HangOutRequestDTO, UserResponseDTO } from '../hangout-models';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HangoutsService } from '../hangouts-service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InputText, InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { MessageModule } from 'primeng/message';
import { UserService } from '../../users/user-service';
import { MultiSelectModule } from 'primeng/multiselect';

@Component({
  selector: 'app-hangout-creator',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    MessageModule,
    MultiSelectModule
  ],
  templateUrl: './hangout-creator.html',
  styleUrl: './hangout-creator.scss',
})
export class HangoutCreator {
  form: FormGroup;
  loading = false;

  users: UserResponseDTO[] = [];

  constructor(
    private fb: FormBuilder,
    private hangoutService: HangoutsService,
    private router: Router,
    private userService: UserService
  ) {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
      memberIds: [[]]
    });
  }

  ngOnInit() {
    this.userService.getAllUsers().subscribe(data => {
      this.users = data;
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    const data: HangOutRequestDTO = this.form.value;

    this.hangoutService.create(data).subscribe({
      next: () => {

        this.loading = false;
        this.router.navigate(['app/hangouts']);
      },
      error: (err) => {
        console.error('Erro ao criar hangout', err);
        this.loading = false;

      }
    });
  }
}
