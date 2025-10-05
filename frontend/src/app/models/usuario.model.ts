export interface Usuario {
  _id?: string;
  nombre: string;
  email: string;
  password?: string; // Es opcional en la interfaz, ya que no se envía en GET o PUT (a veces)
  rol: 'Cliente' | 'Conductor' | 'Admin'; // Roles predefinidos
}
