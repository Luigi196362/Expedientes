import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { NavBarComponent } from "../../components/nav-bar/nav-bar.component";

@Component({
  selector: 'app-crear-pacientes',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, NavBarComponent],
  templateUrl: './crear-pacientes.component.html',
  styleUrl: './crear-pacientes.component.css'
})
export class CrearPacientesComponent {
  guardarPaciente(): void {
    // Lógica para guardar un paciente
  }
}
