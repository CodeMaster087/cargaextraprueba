import { Carga } from "./carga.model";
import { Vehiculo } from "./vehiculo.model";

export interface Viaje {
  _id?: string;
  fechaSalida: Date | string;
  fechaLlegadaEstimada: Date | string;
  estado: 'Pendiente' | 'En Curso' | 'Completado' | 'Cancelado';
  // Referencias a la Carga y al Vehículo involucrados
  carga: string | Carga;
  vehiculo: string | Vehiculo;
}
