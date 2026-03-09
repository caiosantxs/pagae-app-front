import { Component } from '@angular/core';
import { NavbarComponent } from '../../core/components/navbar/navbar';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  imports: [ButtonModule, RouterLink],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class LandingComponent {

}
