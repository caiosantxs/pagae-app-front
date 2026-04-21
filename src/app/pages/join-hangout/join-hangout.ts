import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { HangoutsService } from '../hangouts/hangouts-service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-join-hangout',
  standalone: true,
  imports: [
    CommonModule,
    ProgressSpinnerModule,
  ],
  templateUrl: './join-hangout.html',
  styleUrl: './join-hangout.scss',
})
export class JoinHangout implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private hangOutService: HangoutsService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.handleError();
      return;
    }

    this.hangOutService.joinHangout(Number(id)).subscribe({
      next: () => {
        this.toastService.success('Você entrou no rolê!', 'Sucesso');
        this.router.navigate(['/app/hangouts', id]);
      },
      error: (err) => {
        console.error(err);
        this.toastService.error('Não foi possível entrar no rolê.', 'Ops!');
        this.router.navigate(['/app/dashboard']);
      }
    });
  }

  handleError() {
    this.router.navigate(['/app/dashboard']);
  }
}
