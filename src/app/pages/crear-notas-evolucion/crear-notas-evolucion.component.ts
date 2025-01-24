import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Nota_Evolucion } from '../../models/nota-evolucion';
import { NotasEvolucionService } from '../../services/Notas-Evolucion/notas-evolucion.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-crear-notas-evolucion',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    NavBarComponent
],
  templateUrl: './crear-notas-evolucion.component.html',
  styleUrl: './crear-notas-evolucion.component.css'
})
export class CrearNotasEvolucionComponent {
  notaEvolucion: Nota_Evolucion = new Nota_Evolucion();
  idUsuario: number = 1;  // Valor inicial, puede ser dinámico si se obtiene de algún lugar
  idPaciente: number = 1;  // Valor inicial, puede ser dinámico si se obtiene de algún lugar

  constructor(
    private notasEvolucionService: NotasEvolucionService,
    private route: ActivatedRoute, // Para obtener parámetros de la URL si es necesario
    private router: Router
  ) { }

  ngOnInit(): void {

  }

  guardarNota(): void {
    if (this.notaEvolucion) {
      this.notasEvolucionService.guardarUsuario(this.idUsuario, this.idPaciente, this.notaEvolucion)
        .subscribe({
          next: (response) => {
            console.log('Nota guardada exitosamente:', response);
            // Redirigir o mostrar un mensaje de éxito
            this.router.navigate(['/notas']); // Redirigir a la lista de notas, por ejemplo
          },
          error: (error) => {
            console.error('Error al guardar la nota:', error);
            // Manejo de errores (puedes mostrar un mensaje de error en la UI)
          }
        });
    }
  }
}
