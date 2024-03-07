import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Rol } from '../model/roles.model';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private rolesCollection: AngularFirestoreCollection<Rol>;
  roles: Observable<Rol[]>;

  constructor(private firestore: AngularFirestore) {
    this.rolesCollection = this.firestore.collection<Rol>('roles');
    this.roles = this.rolesCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los roles
  getRoles(): Observable<Rol[]> {
    return this.roles;
  }

  // Método para agregar un nuevo rol
  async agregarRol(rol: Rol): Promise<any> {
    const numRoles = await this.rolesCollection.ref.get().then(snapshot => snapshot.size);
    rol.id = (numRoles + 1).toString();
    return this.rolesCollection.add(rol);
  }

  // Método para obtener un rol por su ID
  getRolById(id: string): Observable<Rol | undefined> {
    return this.rolesCollection.doc<Rol>(id).valueChanges().pipe(
      map(rol => rol ? { ...rol, id } as Rol : undefined)
    );
  }

  // Método para actualizar un rol
  actualizarRol(id: string, data: any): Promise<void> {
    return this.rolesCollection.doc(id).update(data);
  }

  // Método para eliminar un rol
  eliminarRol(id: string): Promise<void> {
    return this.rolesCollection.doc(id).delete();
  }
}
