// src/app/models/carga.model.ts

export interface Carga {
    // Necesario para identificar si es una carga existente (edición) o nueva (creación)
    _id?: string; 
    
    descripcion: string;
    peso: number; 
    origen: string;
    destino: string;
    
    // CAMPOS CRUCIALES AGREGADOS PARA EL FORMULARIO Y LA GESTIÓN:
    fecha_recogida: string; // Formato YYYY-MM-DD
    estado: 'Pendiente' | 'Asignada' | 'En Ruta' | 'Entregada' | 'Cancelada'; // Tipado más estricto
    
    // Campos necesarios para el Propietario (Cliente)
    propietario_id: string; 
    propietario_nombre: string; 

    // **********************************************
    // 
    // **********************************************
    conductor_id?: string; // ID del Usuario con rol 'Conductor' asignado a la carga. Opcional al crear.
}