import { Producto } from "./producto.model";

// Definición de la interfaz para los elementos del carrito
 export interface  CarritoItem {
    producto: Producto;
    cantidad: number;
  }