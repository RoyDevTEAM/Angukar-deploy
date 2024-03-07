import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Categoria } from '../model/categoria.model';

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {
  private categoriasCollection: AngularFirestoreCollection<Categoria>;
  categorias: Observable<Categoria[]>;

  constructor(private firestore: AngularFirestore) {
    this.categoriasCollection = this.firestore.collection<Categoria>('categorias');
    this.categorias = this.categoriasCollection.valueChanges({ idField: 'id' });
  }

  // Método para obtener todas las categorías
  getCategorias(): Observable<Categoria[]> {
    return this.categorias;
  }

  // Método para agregar una nueva categoría
  async agregarCategoria(categoria: Categoria): Promise<any> {
    const numCategorias = await this.categoriasCollection.ref.get().then(snapshot => snapshot.size);
    categoria.id = (numCategorias + 1).toString();
    return this.categoriasCollection.add(categoria);
  }

  // Método para obtener una categoría por su ID
  getCategoriaById(id: string): Observable<Categoria | undefined> {
    return this.categoriasCollection.doc<Categoria>(id).valueChanges().pipe(
      map(categoria => categoria ? { ...categoria, id } as Categoria : undefined)
    );
  }

  // Método para actualizar una categoría
  actualizarCategoria(id: string, data: any): Promise<void> {
    return this.categoriasCollection.doc(id).update(data);
  }

  // Método para eliminar una categoría
  eliminarCategoria(id: string): Promise<void> {
    return this.categoriasCollection.doc(id).delete();
  }
}
