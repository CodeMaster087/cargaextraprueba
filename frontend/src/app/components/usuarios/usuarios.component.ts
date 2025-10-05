import { Component, inject, OnInit, OnDestroy } from '@angular/core'; // 1. Importar OnDestroy
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { Usuario } from '../../models/usuario.model';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs'; // 2. Importar Subscription

// Necesario para acceder a las funciones de Materialize (ej: Modals)
declare const M: any;

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy { // 3. Implementar OnDestroy
  private apiService = inject(ApiService);
  private subscription = new Subscription(); // 4. Contenedor de suscripciones

  // Lista de todos los usuarios
  usuarios: Usuario[] = [];
  
  // Objeto para el formulario: puede ser un nuevo usuario o el usuario a editar
  usuarioSeleccionado: Usuario = { nombre: '', email: '', rol: 'Cliente' };
  
  // Variable de estado para saber si estamos editando o creando
  isEditing = false; 

  ngOnInit(): void {
    this.cargarUsuarios();
    // Inicializar selectores de Materialize (si los hay en el HTML)
    setTimeout(() => {
        const selects = document.querySelectorAll('select');
        M.FormSelect.init(selects);
    }, 50);
  }

  /**
   * Carga la lista de usuarios desde el backend.
   */
  cargarUsuarios(): void {
    // 5. Añadir suscripción
    this.subscription.add(
      this.apiService.get<Usuario[]>('usuarios').subscribe({
        next: (data) => {
          // Excluir el campo password de la lista si estuviera presente
          this.usuarios = data.map(u => {
            const { password, ...usuarioSinPassword } = u;
            return usuarioSinPassword as Usuario;
          });
        },
        error: (err) => console.error('Error al cargar usuarios:', err)
      })
    );
  }

  /**
   * Abre el modal de creación.
   */
  abrirModalCrear(): void {
    // 💡 Nota: Asegúrate de que tu interfaz Usuario en models/usuario.model.ts incluya 'password?: string'
    this.usuarioSeleccionado = { nombre: '', email: '', rol: 'Cliente', password: '' };
    this.isEditing = false;
    this.abrirModal('modalUsuario');
  }

  /**
   * Abre el modal para editar un usuario existente.
   * @param usuario El usuario a editar.
   */
  abrirModalEditar(usuario: Usuario): void {
    // Clona el objeto para evitar modificar la tabla directamente
    this.usuarioSeleccionado = { ...usuario, password: '' }; 
    this.isEditing = true;
    this.abrirModal('modalUsuario');
  }

  /**
   * Guarda o actualiza un usuario.
   */
  guardarUsuario(): void {
    if (!this.usuarioSeleccionado.nombre || !this.usuarioSeleccionado.email || !this.usuarioSeleccionado.rol) {
      M.toast({ html: 'Todos los campos obligatorios deben ser llenados.', classes: 'red' });
      return;
    }

    let obs$;
    if (this.isEditing) {
      // Actualizar
      const { _id, ...body } = this.usuarioSeleccionado;
      obs$ = this.apiService.put<Usuario>(`usuarios/${_id}`, body);
    } else {
      // Crear
      if (!this.usuarioSeleccionado.password) {
        M.toast({ html: 'La contraseña es obligatoria para un nuevo usuario.', classes: 'red' });
        return;
      }
      obs$ = this.apiService.post<Usuario>('usuarios', this.usuarioSeleccionado);
    }
    
    // 5. Añadir suscripción
    this.subscription.add(
      obs$.subscribe({
        next: () => {
          M.toast({ html: `Usuario ${this.isEditing ? 'actualizado' : 'creado'} con éxito`, classes: 'green' });
          this.cargarUsuarios();
          this.cerrarModal('modalUsuario');
        },
        error: (err) => {
          console.error(`Error al ${this.isEditing ? 'actualizar' : 'crear'}:`, err);
          M.toast({ html: `Error al guardar: ${err.error?.message || 'Verifique la API'}`, classes: 'red' });
        }
      })
    );
  }

  /**
   * Elimina un usuario.
   * @param id ID del usuario a eliminar.
   */
  eliminarUsuario(id: string | undefined): void {
    // 💡 Reemplazamos window.confirm por un mensaje de toast (dado el entorno)
    if (!id) return;
    
    M.toast({ html: 'Eliminando usuario...', classes: 'yellow black-text' });
    
    this.subscription.add(
      this.apiService.delete(`usuarios/${id}`).subscribe({
        next: () => {
          M.toast({ html: 'Usuario eliminado', classes: 'red' });
          this.cargarUsuarios();
        },
        error: (err) => {
           console.error('Error al eliminar:', err);
           M.toast({ html: 'Error al eliminar usuario. Verifique la API.', classes: 'red' });
        }
      })
    );
  }

  // --- Funciones de Materialize ---

  private abrirModal(id: string): void {
    const elem = document.getElementById(id);
    if (elem) {
      const instance = M.Modal.getInstance(elem) || M.Modal.init(elem);
      instance.open();
    }
  }

  private cerrarModal(id: string): void {
    const elem = document.getElementById(id);
    if (elem) {
      const instance = M.Modal.getInstance(elem);
      if (instance) {
        instance.close();
      }
    }
  }

  // 6. Limpieza de memoria (OnDestroy)
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}