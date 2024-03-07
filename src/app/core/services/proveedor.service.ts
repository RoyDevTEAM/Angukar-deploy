import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Proveedor } from '../model/proveedor.model';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private proveedoresCollection: AngularFirestoreCollection<Proveedor>;
  proveedores: Observable<Proveedor[]>;

  constructor(private firestore: AngularFirestore) {
    this.proveedoresCollection = this.firestore.collection<Proveedor>('proveedores');
    this.proveedores = this.proveedoresCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los proveedores
  getProveedores(): Observable<Proveedor[]> {
    return this.proveedores;
  }

  // Método para agregar un nuevo proveedor
  async agregarProveedor(proveedor: Proveedor): Promise<any> {
    const numProveedores = await this.proveedoresCollection.ref.get().then(snapshot => snapshot.size);
    proveedor.id = (numProveedores + 1).toString();
    return this.proveedoresCollection.add(proveedor);
  }

  // Método para obtener un proveedor por su ID
  getProveedorById(id: string): Observable<Proveedor | undefined> {
    return this.proveedoresCollection.doc<Proveedor>(id).valueChanges().pipe(
      map(proveedor => proveedor ? { ...proveedor, id } as Proveedor : undefined)
    );
  }

  // Método para actualizar un proveedor
  actualizarProveedor(id: string, data: any): Promise<void> {
    return this.proveedoresCollection.doc(id).update(data);
  }

  // Método para eliminar un proveedor
  eliminarProveedor(id: string): Promise<void> {
    return this.proveedoresCollection.doc(id).delete();
  }
}
