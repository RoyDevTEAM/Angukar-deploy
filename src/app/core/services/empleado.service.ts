import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Empleado } from '../model/empleado.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private empleadosCollection: AngularFirestoreCollection<Empleado>;
  empleados: Observable<Empleado[]>;

  constructor(private firestore: AngularFirestore) {
    this.empleadosCollection = this.firestore.collection<Empleado>('empleados');
    this.empleados = this.empleadosCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los empleados
  getEmpleados(): Observable<Empleado[]> {
    return this.empleados;
  }

  // Método para agregar un nuevo empleado
  async agregarEmpleado(empleado: Empleado): Promise<any> {
    const numEmpleados = await this.empleadosCollection.ref.get().then(snapshot => snapshot.size);
    empleado.id = (numEmpleados + 1).toString();
    return this.empleadosCollection.add(empleado);
  }

  // Método para obtener un empleado por su ID
  getEmpleadoById(id: string): Observable<Empleado | undefined> {
    return this.empleadosCollection.doc<Empleado>(id).valueChanges().pipe(
      map(empleado => empleado ? { ...empleado, id } as Empleado : undefined)
    );
  }

  // Método para actualizar un empleado
  actualizarEmpleado(id: string, data: any): Promise<void> {
    return this.empleadosCollection.doc(id).update(data);
  }

  // Método para eliminar un empleado
  eliminarEmpleado(id: string): Promise<void> {
    return this.empleadosCollection.doc(id).delete();
  }
}
