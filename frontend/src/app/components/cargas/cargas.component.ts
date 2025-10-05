import { Component, OnInit, inject, OnDestroy } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ApiService } from '../../services/api.service';
import { Carga } from '../../models/carga.model';
import { Usuario } from '../../models/usuario.model';
import { Subscription } from 'rxjs';

declare const M: any;

@Component({
  selector: 'app-cargas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cargas.component.html',
  styleUrl: './cargas.component.css'
})
export class CargasComponent implements OnInit, OnDestroy { 
  private apiService = inject(ApiService);
  private subscription = new Subscription();

  cargas: Carga[] = [];
  clientes: Usuario[] = [];
  conductores: Usuario[] = []; // Variable para almacenar los conductores
  cargaSeleccionada: Carga = this.resetCarga();
  isEditing = false;
  // Aseguramos que 'En ruta' sea con 'r' minúscula para coincidir con el modelo y el HTML
  estados = ['Pendiente', 'Asignada', 'En ruta', 'Entregada', 'Cancelada']; 

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarConductores();
    this.cargarCargas();
    // ELIMINADA la llamada a M.AutoInit();
  }

  // --- Comunicación con la API ---

  cargarClientes(): void {
    this.subscription.add(
      this.apiService.get<Usuario[]>('usuarios?rol=Cliente').subscribe({
        next: (data) => {
          this.clientes = data.filter(u => u.rol === 'Cliente'); 
          // Ajuste de tiempo de espera para que Materialize inicialice después de la carga de datos
          setTimeout(() => {
            const selects = document.querySelectorAll('select');
            M.FormSelect.init(selects);
          }, 300); // <-- Aumentado a 300ms
        },
        error: (err) => console.error('Error al cargar clientes:', err)
      })
    );
  }

  cargarConductores(): void {
    this.subscription.add(
      this.apiService.get<Usuario[]>('usuarios?rol=Conductor').subscribe({
        next: (data) => {
          this.conductores = data.filter(u => u.rol === 'Conductor'); 
          // Ajuste de tiempo de espera para que Materialize inicialice después de la carga de datos
          setTimeout(() => {
            const selects = document.querySelectorAll('select');
            M.FormSelect.init(selects);
          }, 300); // <-- Aumentado a 300ms
        },
        error: (err) => console.error('Error al cargar conductores:', err)
      })
    );
  }

  cargarCargas(): void {
    this.subscription.add(
      this.apiService.get<Carga[]>('cargas').subscribe({
        next: (data) => this.cargas = data,
        error: (err) => console.error('Error al cargar cargas:', err)
      })
    );
  }

  guardarCarga(): void {
    // Validación mínima en el frontend
    if (this.cargaSeleccionada.peso <= 0) {
        M.toast({ html: 'El peso debe ser un número positivo.', classes: 'red' });
        return;
    }
    if (!this.cargaSeleccionada.propietario_id) {
      M.toast({ html: 'Debe seleccionar un cliente propietario.', classes: 'red' });
      return;
    }
    
    // Clonar y limpiar el objeto para enviarlo
    let payload: Partial<Carga> = { ...this.cargaSeleccionada };
    
    // El backend solo necesita el ID, no el nombre calculado en el frontend.
    delete payload.propietario_nombre;

    // *************************************************************
    // * CORRECCIÓN FINAL: Renombrar propietario_id a 'usuario' (Confirmado por Postman)
    // *************************************************************
    const usuarioId = payload.propietario_id;
    // Eliminamos el campo incorrecto del payload
    delete payload.propietario_id; 

    if (usuarioId) {
      // Añadimos el campo que la API espera: 'usuario'
      (payload as any)['usuario'] = usuarioId;
    }
    
    // *************************************************************
    // * CORRECCIÓN: Eliminamos fecha_recogida si no es requerida por el esquema
    // *************************************************************
    // Verificamos si es null, undefined, o cadena vacía antes de eliminarla del payload
    if (!payload.fecha_recogida || payload.fecha_recogida === '') {
        delete payload.fecha_recogida;
    }


    let obs$;
    if (this.isEditing) {
      const cargaId = payload._id;
      if (!cargaId) {
        M.toast({ html: 'Error: ID de carga no definido.', classes: 'red' });
        return;
      }
      // Para PUT, enviamos todos los datos 
      obs$ = this.apiService.put<Carga>(`cargas/${cargaId}`, payload);
    } else {
      // Para POST, eliminamos el _id.
      delete payload._id;
      
      // *** VERIFICACIÓN Y ELIMINACIÓN DE CONDUCTOR_ID PARA CREACIÓN ***
      if (!payload.conductor_id || payload.conductor_id === '') {
          delete payload.conductor_id;
      }
      
      // *** LOG DE DEPURACIÓN CRUCIAL ***
      console.log('--- ENVIANDO CARGA (POST) [Estructura Final] ---');
      console.log('Payload:', payload);
      console.log('-------------------------------------------');
      
      obs$ = this.apiService.post<Carga>('cargas', payload);
    }

    this.subscription.add(
      obs$.subscribe({
        next: () => {
          M.toast({ html: `Carga ${this.isEditing ? 'actualizada' : 'creada'} con éxito.`, classes: 'green' });
          this.cargarCargas(); 
          this.cerrarModal('modalCarga');
        },
        error: (err) => {
          console.error('Error al guardar la carga:', err);
          
          let apiErrorMessage = 'Verifique la API (Error 400)';

          // 1. Intenta obtener el mensaje de la API (ej. Express/Mongoose/Joi)
          if (err.error && err.error.message) {
            apiErrorMessage = err.error.message;
          } 
          // 2. Si es un error de validación con lista de errores
          else if (err.error && err.error.errors) {
            const messages = Object.values(err.error.errors)
                                   .map((e: any) => e.msg || e.message)
                                   .join(', ');
            if (messages) {
              apiErrorMessage = 'Validación fallida: ' + messages;
            }
          }
          
          M.toast({ html: `Error al guardar: ${apiErrorMessage}`, classes: 'red' });
        }
      })
    );
  }

  eliminarCarga(id: string | undefined): void {
    // IMPORTANTE: Eliminamos 'confirm()' para cumplir con las restricciones del entorno.
    // Usaremos un simple control de flujo o un toast sin confirmación.
    if (!id) return; 

    // Aquí se podría usar un modal personalizado, pero por ahora, solo avisamos
    M.toast({ 
        html: `Eliminando carga ${id.substring(0, 4)}...`, 
        classes: 'orange darken-2'
    });
    
    this.subscription.add(
      this.apiService.delete(`cargas/${id}`).subscribe({
        next: () => {
          M.toast({ html: 'Carga eliminada con éxito.', classes: 'green' });
          this.cargarCargas();
        },
        error: (err) => {
          console.error('Error al eliminar la carga:', err);
          M.toast({ html: `Error al eliminar: ${err.error?.message || 'Verifique la API'}`, classes: 'red' });
        }
      })
    );
  }

  // --- Funciones de UI/Modal ---

  abrirModalCrear(): void {
    this.cargaSeleccionada = this.resetCarga();
    this.isEditing = false;
    this.abrirModal('modalCarga');
    // Reiniciar selectores para el modal (debe ocurrir después de que el modal se abre)
    setTimeout(() => {
      const selects = document.querySelectorAll('select');
      M.FormSelect.init(selects);
    }, 100); // <-- Aumentado a 100ms
  }

  abrirModalEditar(carga: Carga): void {
    // Si la fecha existe en el modelo, la formateamos
    let fechaRecogida = carga.fecha_recogida;
    if (fechaRecogida) {
      const date = new Date(fechaRecogida);
      date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); 
      fechaRecogida = date.toISOString().substring(0, 10);
    }

    this.cargaSeleccionada = { 
      ...carga, 
      fecha_recogida: fechaRecogida 
    };
    this.isEditing = true;
    this.abrirModal('modalCarga');
    // Reiniciar selectores para el modal (debe ocurrir después de que el modal se abre)
    setTimeout(() => {
      const selects = document.querySelectorAll('select');
      M.FormSelect.init(selects);
    }, 100); // <-- Aumentado a 100ms
  }

  private abrirModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      // Esta línea ahora inicializa explícitamente el modal si aún no lo está.
      const instance = M.Modal.getInstance(modalElement) || M.Modal.init(modalElement, {});
      instance.open();
    }
  }

  private cerrarModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
      const instance = M.Modal.getInstance(modalElement);
      if (instance) {
        instance.close();
      }
    }
  }

  private resetCarga(): Carga {
    return {
      _id: undefined, 
      descripcion: '',
      peso: 0,
      origen: '',
      destino: '',
      // CORRECCIÓN: Usamos '' en lugar de undefined para satisfacer el tipo 'string' del modelo Carga
      fecha_recogida: '', 
      estado: 'Pendiente',
      propietario_id: '', // Mantenemos este nombre para el Two-way binding en el HTML
      propietario_nombre: '',
      conductor_id: undefined 
    } as Carga; 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
