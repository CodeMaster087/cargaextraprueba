import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router'; // Importaciones para el enrutamiento
import { CommonModule } from '@angular/common'; // Módulo base de Angular

// Declaramos M para acceder a las funciones de Materialize (ej: inicializar el Sidenav)
declare const M: any;

@Component({
  selector: 'app-root',
  standalone: true, // CLAVE: Este componente es Standalone (autónomo)
  imports: [CommonModule, RouterOutlet, RouterLink], // CLAVE: Importamos el enrutamiento
  templateUrl: './app.component.html', // Usaremos este HTML para el menú
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'CargaExtra - Gestión de Transporte';

  ngOnInit(): void {
    // Inicializa el Sidenav y otros componentes JS de Materialize
    // Damos un pequeño retraso para asegurar que el DOM esté cargado
    setTimeout(() => {
      M.AutoInit(); 
    }, 100); 
  }
}