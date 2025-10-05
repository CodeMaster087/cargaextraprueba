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
  cargaSeleccionada: Carga = this.resetCarga();
  isEditing = false;
  estados = ['Pendiente', 'Asignada', 'En ruta', 'Entregada', 'Cancelada'];

  ngOnInit(): void {
    this.cargarClientes();
    this.cargarCargas();
    M.AutoInit(); 
  }

  // --- Comunicación con la API ---

  cargarClientes(): void {
    this.subscription.add(
      this.apiService.get<Usuario[]>('usuarios?rol=Cliente').subscribe({
        next: (data) => {
          this.clientes = data.filter(u => u.rol === 'Cliente'); 
          setTimeout(() => {
            const selects = document.querySelectorAll('select');
            M.FormSelect.init(selects);
          }, 100);
        },
        error: (err) => console.error('Error al cargar clientes:', err)
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
    if (this.cargaSeleccionada.peso <= 0) {
        M.toast({ html: 'El peso debe ser un número positivo.', classes: 'red' });
        return;
    }

    const cliente = this.clientes.find(c => c._id === this.cargaSeleccionada.propietario_id);
    if (cliente) {
      // Corrección de tipado: Se elimina '!' en la asignación
      this.cargaSeleccionada.propietario_nombre = cliente.nombre; 
    } else {
      M.toast({ html: 'Debe seleccionar un cliente válido.', classes: 'red' });
      return;
    }

    let obs$;
    if (this.isEditing) {
      const cargaId = this.cargaSeleccionada._id;
      if (!cargaId) {
        M.toast({ html: 'Error: ID de carga no definido.', classes: 'red' });
        return;
      }
      obs$ = this.apiService.put<Carga>(`cargas/${cargaId}`, this.cargaSeleccionada);
    } else {
      obs$ = this.apiService.post<Carga>('cargas', this.cargaSeleccionada);
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
          M.toast({ html: `Error al guardar: ${err.error?.message || 'Verifique la API'}`, classes: 'red' });
        }
      })
    );
  }

  eliminarCarga(id: string | undefined): void {
    if (!id || !confirm('¿Está seguro de que desea eliminar esta carga?')) return;

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
    setTimeout(() => {
      const selects = document.querySelectorAll('select');
      M.FormSelect.init(selects);
    }, 50);
  }

  abrirModalEditar(carga: Carga): void {
    // Corrección de Lógica: Ajuste de la Zona Horaria para fecha_recogida
    const date = new Date(carga.fecha_recogida); // Ya no se necesita '!' si el modelo está bien
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset()); 

    this.cargaSeleccionada = { 
      ...carga, 
      fecha_recogida: date.toISOString().substring(0, 10) 
    };
    this.isEditing = true;
    this.abrirModal('modalCarga');
    setTimeout(() => {
      const selects = document.querySelectorAll('select');
      M.FormSelect.init(selects);
    }, 50);
  }

  private abrirModal(id: string): void {
    const modalElement = document.getElementById(id);
    if (modalElement) {
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
      _id: undefined, // Inicializar _id como undefined
      descripcion: '',
      peso: 0,
      origen: '',
      destino: '',
      fecha_recogida: new Date().toISOString().substring(0, 10), 
      estado: 'Pendiente',
      propietario_id: '',
      propietario_nombre: ''
    } as Carga; 
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}