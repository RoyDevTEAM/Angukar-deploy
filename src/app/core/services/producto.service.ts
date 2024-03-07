import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Producto } from '../model/producto.model';
import { filter, map } from 'rxjs/operators';
import { CarritoService } from './carrito.service'; // Importa el servicio CarritoService

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private productosCollection: AngularFirestoreCollection<Producto>;
  productos: Observable<Producto[]>;

  constructor(
    private firestore: AngularFirestore,
    private carritoService: CarritoService // Inyecta el servicio CarritoService
  ) {
    this.productosCollection = this.firestore.collection<Producto>('productos');
    this.productos = this.productosCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los productos
  getProductos(): Observable<Producto[]> {
    return this.productos;
  }

  // Método para agregar un nuevo producto
  async agregarProducto(producto: Producto): Promise<any> {
    const numProductos = await this.productosCollection.ref.get().then(snapshot => snapshot.size);
    producto.id = (numProductos + 1).toString();
    return this.productosCollection.add(producto);
  }

  // Método para obtener un producto por su ID
  getProductoById(id: string): Observable<Producto | undefined> {
    return this.productosCollection.doc<Producto>(id).valueChanges().pipe(
      map(producto => producto ? { ...producto, id } as Producto : undefined)
    );
  }

  // Método para actualizar un producto
  actualizarProducto(id: string, data: any): Promise<void> {
    return this.productosCollection.doc(id).update(data);
  }

  // Resta la cantidad vendida del stock del producto
  actualizarStock(productoId: string, cantidadVendida: number): void {
    const productoRef = this.productosCollection.doc(productoId);
    this.firestore.firestore.runTransaction(transaction => {
      return transaction.get(productoRef.ref).then(doc => {
        if (doc.exists) {
          const producto = doc.data() as Producto;
          const nuevoStock = producto.stock - cantidadVendida;
          if (nuevoStock >= 0) {
            transaction.update(productoRef.ref, { stock: nuevoStock });
          } else {
            transaction.update(productoRef.ref, { stock: 0 }); // Establece el stock a 0
            alert('El producto se ha agotado.'); // Puedes lanzar una alerta o un mensaje aquí
          }
        } else {
          throw new Error('El producto no existe en la base de datos.');
        }
      });
    }).then(() => {
      console.log('Stock actualizado correctamente.');
    }).catch(error => {
      console.error('Error al actualizar el stock:', error);
    });
  }
  
  // Verifica si hay suficiente stock para agregar al carrito
  verificarStockSuficiente(productoId: string, cantidad: number): Observable<boolean> {
    return this.getProductoById(productoId).pipe(
      filter(producto => !!producto), 
      map(producto => producto!.stock >= cantidad) 
    );
  }
  
  // Agrega un producto al carrito si hay suficiente stock
  agregarAlCarrito(producto: Producto, cantidad: number): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.verificarStockSuficiente(producto.id, cantidad).subscribe(suficiente => {
        if (suficiente) {
          this.carritoService.agregarAlCarrito(producto, cantidad);
          observer.next(true);
        } else {
          observer.next(false);
        }
      });
    });
  }

  // Método para eliminar un producto
  eliminarProducto(id: string): Promise<void> {
    return this.productosCollection.doc(id).delete();
  }
}
