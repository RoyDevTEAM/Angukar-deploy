// header.component.ts

import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { CarritoService } from '../../../core/services/carrito.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';
  isMenuOpen: boolean = false; // Variable para controlar si el menú está abierto o cerrado
  productosEnCarrito: number = 0; // Contador de productos en el carrito

  constructor(
    private authService: AuthService,
    private carritoService: CarritoService
  ) {}

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (loggedIn) {
        this.authService.getUserName().subscribe(name => {
          this.userName = name;
        });
      } else {
        this.userName = '';
      }
    });

    // Suscribirse a los cambios en la cantidad de productos en el carrito
    this.carritoService.getProductosEnCarrito().subscribe(productos => {
      this.productosEnCarrito = productos.length;
    });
  }

  logout(): void {
    this.authService.logout().then(() => {
      // Realiza alguna acción después del cierre de sesión, si es necesario
    }).catch(error => {
      console.error('Error al cerrar sesión:', error);
    });
  }

  // Método para abrir o cerrar el menú desplegable
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen; // Cambia el estado del menú (abierto/cerrado)
  }
}
