export interface Venta {
    id: string;
    fecha: Date;
    cliente_id: string;
    total: number;
    metodo_pago: string;
    estado: string;
  }
  