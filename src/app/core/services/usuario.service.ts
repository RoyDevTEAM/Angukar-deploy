import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Usuario } from '../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private usuariosCollection: AngularFirestoreCollection<Usuario>;
  usuarios: Observable<Usuario[]>;

  constructor(private firestore: AngularFirestore) {
    this.usuariosCollection = this.firestore.collection<Usuario>('usuarios');
    this.usuarios = this.usuariosCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todos los usuarios
  getUsuarios(): Observable<Usuario[]> {
    return this.usuarios;
  }

  // Método para agregar un nuevo usuario
  async agregarUsuario(usuario: Usuario): Promise<any> {
    const numUsuarios = await this.usuariosCollection.ref.get().then(snapshot => snapshot.size);
    usuario.id = (numUsuarios + 1).toString();
    return this.usuariosCollection.add(usuario);
  }

  // Método para obtener un usuario por su ID
  getUsuarioById(id: string): Observable<Usuario | undefined> {
    return this.usuariosCollection.doc<Usuario>(id).valueChanges().pipe(
      map(usuario => usuario ? { ...usuario, id } as Usuario : undefined)
    );
  }

  // Método para actualizar un usuario
  actualizarUsuario(id: string, data: any): Promise<void> {
    return this.usuariosCollection.doc(id).update(data);
  }

  // Método para eliminar un usuario
  eliminarUsuario(id: string): Promise<void> {
    return this.usuariosCollection.doc(id).delete();
  }
}
