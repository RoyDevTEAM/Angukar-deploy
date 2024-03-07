import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DetalleVenta } from '../model/detalleVenta.model';

@Injectable({
  providedIn: 'root'
})
export class DetalleVentaService {
  private detallesVentaCollection: AngularFirestoreCollection<DetalleVenta>;
  detallesVenta: Observable<DetalleVenta[]>;

  constructor(private firestore: AngularFirestore) {
    this.detallesVentaCollection = this.firestore.collection<DetalleVenta>('detalle_venta');
    this.detallesVenta = this.detallesVentaCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los detalles de venta
  getDetallesVenta(): Observable<DetalleVenta[]> {
    return this.detallesVenta;
  }

  // Método para agregar un nuevo detalle de venta
  async agregarDetalleVenta(detalleVenta: DetalleVenta): Promise<any> {
    const numDetallesVenta = await this.detallesVentaCollection.ref.get().then(snapshot => snapshot.size);
    detalleVenta.id = (numDetallesVenta + 1).toString();
    return this.detallesVentaCollection.add(detalleVenta);
  }

  // Método para obtener un detalle de venta por su ID
  getDetalleVentaById(id: string): Observable<DetalleVenta | undefined> {
    return this.detallesVentaCollection.doc<DetalleVenta>(id).valueChanges().pipe(
      map(detalleVenta => detalleVenta ? { ...detalleVenta, id } as DetalleVenta : undefined)
    );
  }

  // Método para actualizar un detalle de venta
  actualizarDetalleVenta(id: string, data: any): Promise<void> {
    return this.detallesVentaCollection.doc(id).update(data);
  }

  // Método para eliminar un detalle de venta
  eliminarDetalleVenta(id: string): Promise<void> {
    return this.detallesVentaCollection.doc(id).delete();
  }
}
