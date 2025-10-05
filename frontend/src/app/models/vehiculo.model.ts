import { Usuario } from "./usuario.model";

export interface Vehiculo {
  _id?: string;
  marca: string;
  modelo: string;
  placa: string;
  capacidad: number; // Capacidad de carga en Kg
  tipo: 'Camión' | 'Furgoneta' | 'Remolque';
  // Referencia al usuario (Conductor). Puede ser el ID (string) o el objeto completo (Usuario) si es poblado.
  conductor: string | Usuario; 
}
