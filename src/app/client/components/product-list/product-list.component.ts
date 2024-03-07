import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../core/model/producto.model';
import { ProductoService } from '../../../core/services/producto.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  productos: Producto[] = [];
  isAdmin$!: Observable<boolean>;
  isLoggedIn$!: Observable<boolean>;
  usuarioActual: any;
  productosEnCarrito: Map<string, number> = new Map<string, number>(); // Mapa para rastrear la cantidad de productos en el carrito

  constructor(
    private productoService: ProductoService,
    private carritoService: CarritoService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerCarritoDelLocalStorage();
    this.isAdmin$ = this.authService.isAdmin();
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.authService.usuarioActual$.subscribe(usuario => {
      this.usuarioActual = usuario;
    });
  }

  obtenerProductos(): void {
    this.productoService.getProductos().subscribe(productos => {
      this.productos = productos;
    });
  }

  obtenerCarritoDelLocalStorage(): void {
    const carrito = localStorage.getItem('carrito');
    if (carrito) {
      this.productosEnCarrito = new Map(JSON.parse(carrito));
    }
  }

  guardarCarritoEnLocalStorage(): void {
    localStorage.setItem('carrito', JSON.stringify(Array.from(this.productosEnCarrito.entries())));
  }

  agregarAlCarrito(producto: Producto): void {
    const cantidad = 1; // Cantidad predeterminada

    // Verificar si la cantidad en el carrito excede el stock disponible
    if (this.productosEnCarrito.has(producto.id)) {
      const cantidadEnCarrito = this.productosEnCarrito.get(producto.id)!;
      if (cantidadEnCarrito >= producto.stock) {
        this.snackBar.open('No hay suficientes productos en el stock.', 'Cerrar', {
          duration: 3000 // Duración del mensaje de alerta en milisegundos
        });
        return;
      }
    }

    this.productoService.verificarStockSuficiente(producto.id, cantidad).subscribe(suficiente => {
      if (suficiente) {
        this.productoService.agregarAlCarrito(producto, cantidad).subscribe(agregado => {
          if (agregado) {
            console.log('Producto agregado al carrito:', producto);
            // Actualizar el estado de la cantidad en el carrito
            if (this.productosEnCarrito.has(producto.id)) {
              this.productosEnCarrito.set(producto.id, this.productosEnCarrito.get(producto.id)! + cantidad);
            } else {
              this.productosEnCarrito.set(producto.id, cantidad);
            }
            // Guardar el carrito actualizado en el localStorage
            this.guardarCarritoEnLocalStorage();
          } else {
            this.snackBar.open('No hay suficientes productos en el stock.', 'Cerrar', {
              duration: 3000 // Duración del mensaje de alerta en milisegundos
            });
          }
        });
      } else {
        this.snackBar.open('No hay suficientes productos en el stock.', 'Cerrar', {
          duration: 3000 // Duración del mensaje de alerta en milisegundos
        });
      }
    });
  }

  vaciarCarrito(): void {
    this.productosEnCarrito.clear();
    localStorage.removeItem('carrito');
  }
}
