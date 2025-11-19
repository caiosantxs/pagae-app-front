import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LoginService } from '../../../pages/login/login-service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './sidebar.html',
})
export class SidebarComponent {

 constructor(
    private loginService: LoginService
  ) {}

  username: string = 'Usuário';
  isSidebarCollapsed: boolean = false;

  items: MenuItem[] = [
    { label: 'Painel', icon: 'pi pi-th-large', routerLink: '/app/dashboard' },
    { label: 'Rolês', icon: 'pi pi-users', routerLink: '/app/content' },
    { label: 'Configurações', icon: 'pi pi-cog', routerLink: '/app/settings' },
  ];

  ngOnInit(): void {
    const savedName = this.loginService.getUsername();
    if (savedName) {
      this.username = savedName;
    }
  }

  onLogout(): void {
    this.loginService.logout();
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

}
