export interface Producto {
    id: string;
    nombre: string;
    descripcion: string;
    precio: number;
    stock: number;
    categoria_id: string;
    proveedor_id: string;
    imagen_url: string;
    fecha_creacion: Date;
  }
  