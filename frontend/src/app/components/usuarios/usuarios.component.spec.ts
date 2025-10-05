import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuariosComponent } from './usuarios.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { of } from 'rxjs';
import { Usuario } from '../../models/usuario.model';
import { RouterTestingHarness } from '@angular/router/testing';

// Mock del servicio API para simular las respuestas del backend
class MockApiService {
  // Simula la obtención de la lista de usuarios
  getUsuarios = () => of([
    { _id: 'u1', nombre: 'Cliente A', email: 'a@test.com', rol: 'Cliente' },
    { _id: 'u2', nombre: 'Conductor B', email: 'b@test.com', rol: 'Conductor' }
  ] as Usuario[]);
  
  // Simula la creación de un usuario
  postUsuario = (usuario: Usuario) => of({ ...usuario, _id: 'u3' }); 

  // Simula la actualización de un usuario
  putUsuario = (usuario: Usuario) => of(usuario); 

  // Simula la eliminación (solo devuelve una respuesta exitosa)
  deleteUsuario = () => of({});
}

describe('UsuariosComponent', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;
  let mockApiService: MockApiService;

  beforeEach(async () => {
    // Configura el ambiente de pruebas
    await TestBed.configureTestingModule({
      imports: [UsuariosComponent, HttpClientTestingModule, FormsModule], // Importa el componente y módulos necesarios
      providers: [
        // Provee el mock en lugar del servicio real para aislar la prueba
        { provide: ApiService, useClass: MockApiService } 
      ]
    }).compileComponents();
    
    // Inicia el componente
    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
    mockApiService = TestBed.inject(ApiService) as unknown as MockApiService;
    fixture.detectChanges(); // Ejecuta la detección de cambios inicial
  });

  it('debe crear el componente', () => {
    // Prueba básica de inicialización
    expect(component).toBeTruthy();
  });

  it('debe inicializar la lista de usuarios al cargar', (done) => {
    // Simula la llamada al método getUsuarios y verifica la lista
    component.ngOnInit();
    // Usa setTimeout para esperar la resolución de la promesa si hay alguna, aunque con 'of' es síncrono
    setTimeout(() => {
        fixture.detectChanges();
        expect(component.usuarios.length).toBe(2);
        expect(component.usuarios[0].nombre).toBe('Cliente A');
        done();
    }, 100);
  });

  it('debe inicializar un nuevo usuario con rol "Cliente" por defecto', () => {
    // Prueba la lógica del reset para la creación de nuevos usuarios
    // FIX: Se usa 'as any' porque resetUsuario puede ser private en el componente real.
    (component as any).resetUsuario();
    // FIX: Se usa 'as any' para acceder a la señal.
    expect((component as any).selectedUsuario().nombre).toBe('');
    // FIX: Se usa 'as any' para acceder a la señal.
    expect((component as any).selectedUsuario().rol).toBe('Cliente');
    expect(component.isEditing).toBe(false);
  });

  it('debe establecer el componente en modo de edición al llamar a editarUsuario', () => {
    // Prueba la lógica de edición
    const testUsuario: Usuario = { _id: 'u4', nombre: 'Test Edit', email: 'edit@test.com', rol: 'Conductor' };
    // FIX: Se usa 'as any' porque editarUsuario puede ser private.
    (component as any).editarUsuario(testUsuario);
    // FIX: Se usa 'as any' para acceder a la señal.
    expect((component as any).selectedUsuario().nombre).toBe('Test Edit');
  });

  it('debe llamar a postUsuario cuando se guarda un nuevo usuario', () => {
    // Simula la creación de un usuario (POST)
    spyOn(mockApiService, 'postUsuario').and.callThrough();
    
    // Configura el componente para el modo de creación
    component.isEditing = false;
    // FIX: Usar 'as any' y .set() para actualizar el valor de la señal.
    (component as any).selectedUsuario.set({ _id: undefined, nombre: 'Nuevo Test', email: 'new@test.com', rol: 'Cliente' }); 
    
    // FIX: Se usa 'as any' porque guardarUsuario puede ser private.
    (component as any).guardarUsuario();
    
    // Verifica que el método del mock (simulado) haya sido llamado
    expect(mockApiService.postUsuario).toHaveBeenCalled();
  });

  it('debe llamar a putUsuario cuando se actualiza un usuario existente', () => {
    // Simula la actualización de un usuario (PUT)
    spyOn(mockApiService, 'putUsuario').and.callThrough();
    
    // Configura el componente para el modo de edición
    component.isEditing = true;
    // FIX: Usar 'as any' y .set() para actualizar el valor de la señal.
    (component as any).selectedUsuario.set({ _id: 'u1', nombre: 'Cliente Modificado', email: 'a@test.com', rol: 'Cliente' }); 
    
    // FIX: Se usa 'as any' porque guardarUsuario puede ser private.
    (component as any).guardarUsuario();
    
    // Verifica que el método del mock (simulado) haya sido llamado
    expect(mockApiService.putUsuario).toHaveBeenCalled();
  });
});
