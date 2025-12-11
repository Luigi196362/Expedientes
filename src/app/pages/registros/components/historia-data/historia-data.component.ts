import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RegistroService } from '../../services/registros/registros.service';
import { Historia_clinica } from '../../models/historia-clinica';

@Component({
  selector: 'app-historia-data',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    RouterLink
  ],
  templateUrl: './historia-data.component.html',
  styleUrl: './historia-data.component.css'
})
export class HistoriaDataComponent implements OnInit {
  @Input() registroIdInput: number | null = null;
  @Input() isEmbedded: boolean = false;
  @Input() sexoPaciente: String = "";
  historia: Historia_clinica | null = null;
  loading: boolean = true;

  constructor(
    private router: Router,
    private registroService: RegistroService
  ) { }

  ngOnInit(): void {
    if (this.registroIdInput) {
      this.cargarHistoria(this.registroIdInput);
    } else {
      const state = history.state;
      console.log('Estado recibido:', state);

      if (state.registro_id) {
        this.cargarHistoria(state.registro_id);
      } else {
        console.error('No se recibió el ID del registro');
        // this.router.navigate(['/layout/pacientes']);
      }
    }
  }

  cargarHistoria(idRegistro: number) {
    this.loading = true;
    this.registroService.getHistoria(idRegistro).subscribe({
      next: (registros: any[]) => {
        console.log('Historia recibida:', registros);
        if (Array.isArray(registros)) {
          if (registros.length > 0) {
            this.historia = registros[0];
          } else {
            console.warn('El arreglo de historia está vacío.');
          }
        } else if (registros) {
          this.historia = registros;
        } else {
          console.warn('No se encontró la historia con el ID especificado.');
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar historia:', err);
        this.loading = false;
      }
    });
  }
}
