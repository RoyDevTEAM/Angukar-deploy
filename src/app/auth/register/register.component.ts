import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      direccion: ['', Validators.required],
      ciudad: ['', Validators.required],
      pais: ['', Validators.required],
      telefono: ['', Validators.required],
      nit: ['', Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.registerForm.invalid) {
      return;
    }

    const { email, password, nombre, apellido, direccion, ciudad, pais, telefono, nit } = this.registerForm.value;

    try {
      await this.authService.registerWithEmail(email, password, nombre, apellido, direccion, ciudad, pais, telefono, nit);
      this.snackBar.open('Registro exitoso. Inicia sesión con tus credenciales.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });

      // Redirigir al usuario a la página de inicio de sesión después del registro exitoso
      this.router.navigate(['/login']);

      // Limpiar el formulario después del registro exitoso
      this.registerForm.reset();
    } catch (error) {
      this.snackBar.open('Error al registrar. Por favor, inténtalo de nuevo más tarde.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom'
      });
    }
  }
}
