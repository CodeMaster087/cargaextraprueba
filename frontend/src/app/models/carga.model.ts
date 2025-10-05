// Nota: Ya no necesitamos importar Usuario aquí, ya que solo usamos strings.

export interface Carga {
    // Necesario para identificar si es una carga existente (edición) o nueva (creación)
    _id?: string; 
    
    descripcion: string;
    peso: number; // Es crucial que NO sea opcional
    origen: string;
    destino: string;
    
    // CAMPOS CRUCIALES AGREGADOS PARA EL FORMULARIO Y LA GESTIÓN:
    fecha_recogida: string; // Ya no es opcional (elimina el error de '!')
    estado: string; // Necesario para el select del estado
    
    // Campos necesarios para el Propietario (Cliente)
    propietario_id: string; // El ID del cliente, para el POST/PUT
    propietario_nombre: string; // El nombre del cliente, para mostrar y guardar
}
