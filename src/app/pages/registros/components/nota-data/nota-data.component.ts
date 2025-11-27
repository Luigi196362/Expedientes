import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RegistroService } from '../../services/registros/registros.service';
import { Nota_Evolucion } from '../../models/nota-evolucion';

@Component({
  selector: 'app-nota-data',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    RouterLink
  ],
  templateUrl: './nota-data.component.html',
  styleUrl: './nota-data.component.css'
})
export class NotaDataComponent implements OnInit {
  @Input() registroIdInput: number | null = null;
  @Input() isEmbedded: boolean = false;
  nota: Nota_Evolucion | null = null;
  loading: boolean = true;

  constructor(
    private router: Router,
    private registroService: RegistroService
  ) {}

  ngOnInit(): void {
    if (this.registroIdInput) {
      this.cargarNota(this.registroIdInput);
    } else {
      const state = history.state;
      console.log('Estado recibido:', state);

      if (state.registro_id) {
        this.cargarNota(state.registro_id);
      } else {
        console.error('No se recibió el ID del registro');
        // this.router.navigate(['/layout/pacientes']);
      }
    }
  }

  cargarNota(idRegistro: number) {
    this.loading = true;
    this.registroService.getNota(idRegistro).subscribe({
      next: (registros: any[]) => {
        console.log('Nota recibida:', registros);
        
        if (Array.isArray(registros)) {
            if (registros.length > 0) {
                this.nota = registros[0];
            } else {
                console.warn('El arreglo de nota está vacío.');
            }
        } else if (registros) {
            this.nota = registros;
        } else {
            console.warn('No se encontró la nota con el ID especificado.');
        }

        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar nota:', err);
        this.loading = false;
      }
    });
  }
}
