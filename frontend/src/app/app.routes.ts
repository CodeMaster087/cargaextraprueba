import { Routes } from '@angular/router';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { CargasComponent } from './components/cargas/cargas.component';

// Definición del array de rutas de Angular
export const routes: Routes = [
  // Ruta por defecto: redirige a la gestión de Cargas al iniciar
  { path: '', redirectTo: '/cargas', pathMatch: 'full' }, 
  
  // Rutas de Componentes CRUD
  { 
    path: 'cargas', 
    component: CargasComponent, 
    title: 'Cargas | CargaExtra' // Título que se muestra en la pestaña del navegador
  },
  { 
    path: 'usuarios', 
    component: UsuariosComponent, 
    title: 'Usuarios | CargaExtra' 
  },
  
  // Las rutas de Vehículos y Viajes se añadirán más adelante
  
  // Ruta comodín para manejar URLs no encontradas (redirige al inicio)
  { path: '**', redirectTo: '/cargas' } 
];
