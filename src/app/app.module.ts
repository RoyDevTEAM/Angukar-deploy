import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { MatMenuModule } from '@angular/material/menu';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { DashboardAdminComponent } from './admin/components/dashboard-admin/dashboard-admin.component';
import { ManageProductsComponent } from './admin/components/manage-products/manage-products.component';
import { ManageSalesComponent } from './admin/components/manage-sales/manage-sales.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card'; // Importa MatCardModule
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './client/components/home/home.component';
import { ProductListComponent } from './client/components/product-list/product-list.component';
import { FooterComponent } from './shared/layout/footer/footer.component';
import { HeaderComponent } from './shared/layout/header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CommonModule } from '@angular/common';
import { CheckOutComponent } from './client/components/check-out/check-out.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { CartComponent } from './client/components/cart/cart.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Importa MatTableModule

@NgModule({
  declarations: [
    CartComponent,
    HomeComponent,
    AppComponent,
    DashboardAdminComponent,
    ManageProductsComponent,
    ManageSalesComponent,
    LoginComponent,
    RegisterComponent,
    FooterComponent,
    HeaderComponent,
    CheckOutComponent,
    ProductListComponent

    
  ],
  imports: [MatMenuModule,
    MatListModule,
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule,
    MatToolbarModule,
    ReactiveFormsModule,
    MatCardModule, // Agrega MatCardModule aquí
    MatInputModule,
    CommonModule,
    MatButtonModule,
    MatSnackBarModule,MatIconModule,MatSidenavModule,MatTableModule,
    RouterModule.forRoot([
      { path: 'home', component: HomeComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'login', component: LoginComponent },
      { path: '**', redirectTo: '/home' } // Ruta por defecto
    ])


  ],
  providers: [
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
