import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cliente } from '../model/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  private clientesCollection: AngularFirestoreCollection<Cliente>;
  clientes: Observable<Cliente[]>;

  constructor(private firestore: AngularFirestore) {
    this.clientesCollection = this.firestore.collection<Cliente>('clientes');
    this.clientes = this.clientesCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los clientes
  getClientes(): Observable<Cliente[]> {
    return this.clientes;
  }

  // Método para agregar un nuevo cliente
  async agregarCliente(cliente: Cliente): Promise<any> {
    const numClientes = await this.clientesCollection.ref.get().then(snapshot => snapshot.size);
    cliente.id = (numClientes + 1).toString();
    return this.clientesCollection.add(cliente);
  }

  // Método para obtener un cliente por su ID
  getClienteById(id: string): Observable<Cliente | undefined> {
    return this.clientesCollection.doc<Cliente>(id).valueChanges().pipe(
      map(cliente => cliente ? { ...cliente, id } as Cliente : undefined)
    );
  }

  // Método para actualizar un cliente
  actualizarCliente(id: string, data: any): Promise<void> {
    return this.clientesCollection.doc(id).update(data);
  }

  // Método para eliminar un cliente
  eliminarCliente(id: string): Promise<void> {
    return this.clientesCollection.doc(id).delete();
  }
}
