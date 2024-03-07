import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  usuarioActual$!: Observable<any>;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore
  ) {
    this.usuarioActual$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.firestore.doc<any>(`usuarios/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      }),
      catchError(error => {
        console.error('Error en AuthService:', error);
        return of(null);
      })
    );
  }

 // Método para obtener el nombre del usuario
 getUserName(): Observable<string> {
  return this.usuarioActual$.pipe(map(usuario => usuario ? usuario.nombre : ''));
}
  async registerWithEmail(
    email: string,
    password: string,
    nombre: string,
    apellido: string,
    direccion: string,
    ciudad: string,
    pais: string,
    telefono: string,
    nit: string
  ): Promise<void> {
    try {
      const credential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const user = credential.user;
  
      if (user) {
        const rolId = await this.getClienteRolId() ?? '8qRi0mTUiMCVxVQ1MFM1';
        await this.createUserProfile(user.uid, email, nombre, apellido, direccion, ciudad, pais, telefono, nit, rolId);
      } else {
        throw new Error('El usuario no se ha creado correctamente.');
      }
    } catch (error) {
      throw error;
    }
  }

  private async getClienteRolId(): Promise<string | null> {
    try {
      const rolSnapshot = await this.firestore.collection('rol', ref => ref.where('nombre', '==', 'cliente').limit(1)).get().toPromise();
      if (rolSnapshot && !rolSnapshot.empty) {
        return rolSnapshot.docs[0].id;
      } else {
        return null;
      }
    } catch (error) {
      console.error('Error al obtener el rol de cliente:', error);
      return null;
    }
  }

  private async createUserProfile(
    uid: string,
    email: string,
    nombre: string,
    apellido: string,
    direccion: string,
    ciudad: string,
    pais: string,
    telefono: string,
    nit: string,
    rolId: string
  ): Promise<void> {
    try {
      const fechaCreacion = new Date();
      await this.firestore.collection('usuarios').doc(uid).set({
        uid,
        nombre,
        apellido,
        correo: email,
        rol_id: rolId,
        fecha_creacion: fechaCreacion
      });

      await this.firestore.collection('clientes').doc(uid).set({
        usuario_id: uid,
        direccion,
        ciudad,
        pais,
        telefono,
        nit
      });
    } catch (error) {
      throw error;
    }
  }

  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      await this.afAuth.signInWithEmailAndPassword(email, password);
      localStorage.setItem('userLoggedIn', 'true');
    } catch (error) {
      throw error;
    }
  }
// Método para comprobar si el usuario es administrador
isAdmin(): Observable<boolean> {
  return this.afAuth.authState.pipe(
    switchMap(user => {
      if (!user) {
        return of(false); // Si no hay usuario, devuelve false
      } else {
        return this.firestore.doc<any>(`usuarios/${user.uid}`).valueChanges().pipe(
          map(userData => {
            // Comprueba si el usuario tiene el rol de administrador
            return userData && userData.rol_id === 'W3ebDlYlqL31p41IgIfx';
          })
        );
      }
    })
  );
}
  async logout(): Promise<void> {
    try {
      await this.afAuth.signOut();
      localStorage.removeItem('userLoggedIn');
    } catch (error) {
      throw error;
    }
  }

  isLoggedIn(): Observable<boolean> {
    const isLoggedIn = localStorage.getItem('userLoggedIn') === 'true';
    return of(isLoggedIn);
  }
}