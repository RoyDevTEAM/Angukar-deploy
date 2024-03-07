import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Producto } from '../model/producto.model';

@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private items: { producto: Producto, cantidad: number }[] = [];
  private productosEnCarritoSubject: BehaviorSubject<{ producto: Producto; cantidad: number; }[]> = new BehaviorSubject<{ producto: Producto; cantidad: number; }[]>([]);

  constructor() { }

  // Método para obtener todos los productos en el carrito
  obtenerItems(): { producto: Producto, cantidad: number }[] {
    return this.items;
  }

  // Método para obtener la lista de productos en el carrito como un Observable
  getProductosEnCarrito(): Observable<{ producto: Producto; cantidad: number; }[]> {
    return this.productosEnCarritoSubject.asObservable();
  }

  // Método para agregar un producto al carrito
  agregarAlCarrito(producto: Producto, cantidad: number = 1): void {
    const itemExistente = this.items.find(item => item.producto.id === producto.id);

    if (itemExistente) {
      // Si el producto ya está en el carrito, incrementa la cantidad
      itemExistente.cantidad += cantidad;
    } else {
      // Si el producto no está en el carrito, agrega uno nuevo
      this.items.push({ producto, cantidad });
    }

    // Actualizar el subject de productos en el carrito
    this.productosEnCarritoSubject.next(this.items);
  }

  // Método para eliminar un producto del carrito
  eliminarDelCarrito(producto: Producto): void {
    const index = this.items.findIndex(item => item.producto.id === producto.id);

    if (index !== -1) {
      this.items.splice(index, 1);
      // Actualizar el subject de productos en el carrito
      this.productosEnCarritoSubject.next(this.items);
    }
  }

  // Método para limpiar el carrito
  limpiarCarrito(): void {
    this.items = [];
    // Actualizar el subject de productos en el carrito
    this.productosEnCarritoSubject.next(this.items);
  }
}
