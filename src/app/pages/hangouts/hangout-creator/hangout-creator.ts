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
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-hangout-creator',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    InputTextModule,
    ButtonModule,
    MessageModule,
    MultiSelectModule,
    AutoCompleteModule
  ],
  templateUrl: './hangout-creator.html',
  styleUrl: './hangout-creator.scss',
})
export class HangoutCreator {
  form: FormGroup;
  loading = false;

  filteredUsers: UserResponseDTO[] = [];

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


  onSubmit() {
    if (this.form.invalid) return;

    const formValue = this.form.value;

    const selectedMembers = formValue.memberIds as UserResponseDTO[];
    const idsOnly = selectedMembers.map(u => u.id);

    const payload = {
      title: formValue.title,
      description: formValue.description,
      memberIds: idsOnly
    };

    this.hangoutService.create(payload).subscribe({
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

  filterUsers(event: any) {
    const query = event.query;
    this.userService.searchUsers(query).subscribe(data => {
      this.filteredUsers = data;
    });
  }
}
