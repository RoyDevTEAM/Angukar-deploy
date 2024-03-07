import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    if (!this.loginForm || this.loginForm.invalid) { 
      return;
    }

    const emailControl = this.loginForm.get('email');
    const passwordControl = this.loginForm.get('password');

    if (!emailControl || !passwordControl) { 
      return;
    }

    const email = emailControl.value;
    const password = passwordControl.value;

    try {
      await this.authService.loginWithEmail(email, password);
      this.snackBar.open('Inicio de sesión exitoso', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });

      // Determinar el destino después del inicio de sesión
      if (this.authService.isAdmin()) {
        // Redirigir al dashboard de administrador
        this.router.navigate(['/admin']);
      } else {
        // Redirigir al área de cliente (puedes ajustar la ruta según sea necesario)
        this.router.navigate(['/home']);
      }
    } catch (error) {
      this.snackBar.open('Error al iniciar sesión. Verifique sus credenciales e intente nuevamente.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }
}
