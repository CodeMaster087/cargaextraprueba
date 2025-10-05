import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; // Para comunicarse con la API
import { FormsModule } from '@angular/forms'; // Para usar [(ngModel)] y formularios

import { routes } from './app.routes'; // Importamos la definición de rutas

export const appConfig: ApplicationConfig = {
  providers: [
    // Habilita el sistema de enrutamiento
    provideRouter(routes), 
    
    // Importamos los módulos esenciales para la aplicación como proveedores de root
    importProvidersFrom(HttpClientModule, FormsModule) 
  ]
};

