import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Venta } from '../model/venta.model';


@Injectable({
  providedIn: 'root'
})
export class VentaService {
  private ventasCollection: AngularFirestoreCollection<Venta>;
  ventas: Observable<Venta[]>;

  constructor(private firestore: AngularFirestore) {
    this.ventasCollection = this.firestore.collection<Venta>('venta');
    this.ventas = this.ventasCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todas las ventas
  getVentas(): Observable<Venta[]> {
    return this.ventas;
  }

  // Método para agregar una nueva venta
  async agregarVenta(venta: Venta): Promise<any> {
    const numVentas = await this.ventasCollection.ref.get().then(snapshot => snapshot.size);
    venta.id = (numVentas + 1).toString();
    return this.ventasCollection.add(venta);
  }

  // Método para obtener una venta por su ID
  getVentaById(id: string): Observable<Venta | undefined> {
    return this.ventasCollection.doc<Venta>(id).valueChanges().pipe(
      map(venta => venta ? { ...venta, id } as Venta : undefined)
    );
  }

  // Método para actualizar una venta
  actualizarVenta(id: string, data: any): Promise<void> {
    return this.ventasCollection.doc(id).update(data);
  }

  // Método para eliminar una venta
  eliminarVenta(id: string): Promise<void> {
    return this.ventasCollection.doc(id).delete();
  }
}
