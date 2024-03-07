import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      switchMap((loggedIn: boolean) => {
        if (!loggedIn) {
          // Si no está autenticado, redirige al inicio de sesión
          this.router.navigate(['/login']);
          return of(false); // Devuelve un observable de falso si no está autenticado
        } else {
          // Si está autenticado, verifica si es administrador
          return this.authService.isAdmin().pipe(
            map((isAdmin: boolean) => {
              if (!isAdmin) {
                // Si no es administrador, redirige a la página de inicio
                this.router.navigate(['/products']);
              }
              return isAdmin; // Devuelve si es administrador o no
            })
          );
        }
      })
    );
  }
}
