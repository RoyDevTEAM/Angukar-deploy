import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MetodoPago } from '../model/metodopago.model';

@Injectable({
  providedIn: 'root'
})
export class MetodoPagoService {
  private metodoPagoCollection: AngularFirestoreCollection<MetodoPago>;
  metodosPago: Observable<MetodoPago[]>;

  constructor(private firestore: AngularFirestore) {
    this.metodoPagoCollection = this.firestore.collection<MetodoPago>('metodo_pago');
    this.metodosPago = this.metodoPagoCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los métodos de pago
  getMetodosPago(): Observable<MetodoPago[]> {
    return this.metodosPago;
  }

  // Método para agregar un nuevo método de pago
  async agregarMetodoPago(metodoPago: MetodoPago): Promise<any> {
    const numMetodosPago = await this.metodoPagoCollection.ref.get().then(snapshot => snapshot.size);
    metodoPago.id = (numMetodosPago + 1).toString();
    return this.metodoPagoCollection.add(metodoPago);
  }

  // Método para obtener un método de pago por su ID
  getMetodoPagoById(id: string): Observable<MetodoPago | undefined> {
    return this.metodoPagoCollection.doc<MetodoPago>(id).valueChanges().pipe(
      map(metodoPago => metodoPago ? { ...metodoPago, id } as MetodoPago : undefined)
    );
  }

  // Método para actualizar un método de pago
  actualizarMetodoPago(id: string, data: any): Promise<void> {
    return this.metodoPagoCollection.doc(id).update(data);
  }

  // Método para eliminar un método de pago
  eliminarMetodoPago(id: string): Promise<void> {
    return this.metodoPagoCollection.doc(id).delete();
  }
}
