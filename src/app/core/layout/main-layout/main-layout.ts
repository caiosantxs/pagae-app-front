import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from "../navbar/navbar";
import { LoginService } from '../../../pages/login/login-service';

@Component({
  selector: 'app-main-layout',
  imports: [
    RouterOutlet,
    Navbar
],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayoutComponent {
  constructor(
    private loginService: LoginService
  ) {}

  logout(){
    this.loginService.logout();
  }
}
