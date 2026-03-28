/**
 * Respuesta de la API ve.dolarapi.com/v1/dolares/oficial
 */
export interface DolarApiResponse {
  moneda: string;
  fuente: string;
  nombre: string;
  compra: number | null;
  venta: number | null;
  promedio: number;
  fechaActualizacion: string;
}
