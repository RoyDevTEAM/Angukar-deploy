import { Component, OnInit } from '@angular/core';
import { Producto } from '../../../core/model/producto.model';
import { Venta } from '../../../core/model/venta.model';
import { DetalleVenta } from '../../../core/model/detalleVenta.model';
import { AuthService } from '../../../core/services/auth.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { VentaService } from '../../../core/services/venta.service';
import { DetalleVentaService } from '../../../core/services/detalle-venta.service';
import { CarritoService } from '../../../core/services/carrito.service';
import { ProductoService } from '../../../core/services/producto.service';
import  pdfMake from 'pdfmake/build/pdfmake';
import  pdfFonts from 'pdfmake/build/vfs_fonts';
import { CarritoItem } from '../../../core/model/carrito.model';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;
import 'pdfmake/build/vfs_fonts';
import { CommonModule } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table'; // Importa MatTableModule

@Component({
  
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  currentUser: any;
  productosEnCarrito: CarritoItem[] = []; // Cambiar el nombre de la variable
  dataSource!: MatTableDataSource<CarritoItem> ; // Define dataSource como MatTableDataSource

  constructor(
    private authService: AuthService,
    private clienteService: ClienteService,
    private ventaService: VentaService,
    private detalleVentaService: DetalleVentaService,
    private carritoService: CarritoService,
    private productoService: ProductoService

  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<CarritoItem>(this.productosEnCarrito);

    // Modificación en la definición de productsInCart
    
    // En el método ngOnInit o donde obtengas los elementos del carrito
    this.productosEnCarrito = this.carritoService.obtenerItems();
    this.authService.usuarioActual$.subscribe(user => {
      this.currentUser = user;
    });
  }
  async realizarVenta(): Promise<void> {
    try {
        if (!this.currentUser) {
            console.error('No se ha iniciado sesión');
            return;
        }

        const detallesVenta: DetalleVenta[] = [];
        let totalVenta = 0;

        for (const carritoItem of this.productosEnCarrito) {
            const detalle: DetalleVenta = {
                id: '',
                venta_id: '',
                producto_id: carritoItem.producto.id,
                cantidad: carritoItem.cantidad,
                precio_unitario: carritoItem.producto.precio
            };

            detallesVenta.push(detalle);
            totalVenta += carritoItem.producto.precio * carritoItem.cantidad;
        }

        const venta: Venta = {
            id: '',
            fecha: new Date(),
            cliente_id: this.currentUser.uid, // Usamos directamente el ID del usuario
            total: totalVenta,
            metodo_pago: 'ID_METODO_PAGO', // Ajusta este valor según tu lógica
            estado: 'pendiente'
        };

        const ventaRef = await this.ventaService.agregarVenta(venta);
        venta.id = ventaRef.id;

        for (const detalle of detallesVenta) {
            await this.productoService.actualizarStock(detalle.producto_id, detalle.cantidad);
            detalle.venta_id = venta.id;
            await this.detalleVentaService.agregarDetalleVenta(detalle);
        }
        this.generatePDF(venta, detallesVenta);

        this.carritoService.limpiarCarrito();

        // Mostrar un mensaje de alerta
        alert('Venta realizada correctamente');

        // Recargar la página para refrescar el carrito
    } catch (error) {
        console.error('Error al procesar la venta:', error);
    }
}

  calcularTotal(): number {
    let total = 0;
    for (const carritoItem of this.productosEnCarrito) {
      total += carritoItem.producto.precio * carritoItem.cantidad;
    }
    return total;
  }
  
  truncateDescription(description: string, maxLength: number): string {
    if (description.length > maxLength) {
        return description.substring(0, maxLength) + '...';
    } else {
        return description;
    }
}
  eliminarDelCarrito(producto: Producto): void {
    this.carritoService.eliminarDelCarrito(producto);
    this.productosEnCarrito = this.carritoService.obtenerItems();
  }
  generatePDF(venta: Venta, detallesVenta: DetalleVenta[]): void {
    this.authService.getUserName().subscribe(userName => {
        const docDefinition: TDocumentDefinitions = {
            content: [
                { text: 'Symetrica', style: 'companyName' }, // Nombre de la empresa como encabezado
                { text: 'Comprobante de Venta', style: 'header' },
                { text: `ID de Venta: ${venta.id}`, style: 'subheader' },
                { text: `Fecha: ${this.formatShortDate(venta.fecha)}`, style: 'subheader' }, // Formato corto de la fecha
                { text: `Cliente: ${userName}`, style: 'subheader' }, // Usar el nombre del usuario obtenido del servicio de autenticación
                { text: 'Detalles de Venta', style: 'subheader' },
                this.generateDetalleVentaTable(detallesVenta),
                { text: `Total: $${venta.total}`, style: 'subheader' } // Formato de moneda
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true,
                    margin: [0, 0, 0, 10] // Ajusta los márgenes según sea necesario
                },
                subheader: {
                    fontSize: 14,
                    bold: true,
                    margin: [0, 10, 0, 5] // Ajusta los márgenes según sea necesario
                },
                companyName: {
                    fontSize: 22,
                    bold: true,
                    alignment: 'center',
                    margin: [0, 0, 0, 10] // Ajusta los márgenes según sea necesario
                },
                tableHeader: {
                    bold: true,
                    fontSize: 13,
                    color: 'black'
                }
            }
        };

        pdfMake.createPdf(docDefinition).open();

    });
}

generateDetalleVentaTable(detallesVenta: DetalleVenta[]): any {
    const body = [];

    // Encabezados de la tabla
    body.push([
        { text: 'Producto', style: 'tableHeader' },
        { text: 'Cantidad', style: 'tableHeader' },
        { text: 'Precio Unitario', style: 'tableHeader' }
    ]);

    detallesVenta.forEach(detalle => {
        body.push([
            detalle.producto_id, // Se asume que aquí debería ir el nombre del producto
            detalle.cantidad.toString(), // Convertir la cantidad a string
            `$${detalle.precio_unitario}` // Formato de moneda para el precio unitario
        ]);
    });

    return {
        table: {
            widths: ['*', 'auto', 'auto'], // Ancho de las columnas (producto: *, cantidad: auto, precio unitario: auto)
            headerRows: 1, // Filas de encabezado
            body: body
        }
    };
}

formatShortDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };
    return new Intl.DateTimeFormat('es-ES', options).format(date);
}


}
