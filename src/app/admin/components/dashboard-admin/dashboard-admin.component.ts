import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';

import { Observable } from 'rxjs';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-admin',
  templateUrl: './dashboard-admin.component.html',
  styleUrls: ['./dashboard-admin.component.css']
})
export class DashboardAdminComponent implements OnInit {
  isSidebarOpen: boolean = false;
  isHandset$!: Observable<boolean>;
  userName: string = '';
  matMenuTrigger: any;

  constructor(
    private authService: AuthService,
    private breakpointObserver: BreakpointObserver
  ) { }

  ngOnInit(): void {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map((result: BreakpointState) => result.matches)
    );

    // Obtener el nombre del usuario al inicializar el componente
    this.authService.getUserName().subscribe(name => {
      this.userName = name;
    });
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  openProfileMenu(): void {
    // Obtener la referencia al menú de perfil
    const profileMenu = this.matMenuTrigger;
  
    // Abrir el menú de perfil
    if (profileMenu && profileMenu.menuOpen) {
      profileMenu.closeMenu(); // Si está abierto, ciérralo
    } else if (profileMenu) {
      profileMenu.openMenu(); // Si está cerrado, ábrelo
    }
  }
  

  logout(): void {
    // Lógica para cerrar sesión
    this.authService.logout().then(() => {
      // Redirigir al usuario al inicio de sesión o a donde corresponda después del cierre de sesión
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }
}
