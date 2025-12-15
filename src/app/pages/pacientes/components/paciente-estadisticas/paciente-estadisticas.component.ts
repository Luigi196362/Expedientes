import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PacienteService } from '../../services/paciente.service';
import { EstadisticasPaciente } from '../../models/estadisticas-paciente';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-paciente-estadisticas',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './paciente-estadisticas.component.html',
  styleUrl: './paciente-estadisticas.component.css'
})
export class PacienteEstadisticasComponent implements OnInit {
  estadisticas: EstadisticasPaciente | null = null;
  loading: boolean = true;
  error: string = '';

  constructor(private pacienteService: PacienteService) { }

  ngOnInit(): void {
    this.pacienteService.estadisticasPaciente().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.loading = false;
        console.log('Estadísticas cargadas:', data);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas', err);
        this.error = 'No se pudieron cargar las estadísticas.';
        this.loading = false;
      }
    });
  }

  // Helper to convert object to array for *ngFor
  getObjectEntries(obj: Record<string, number> | undefined): { key: string, value: number, percent: number }[] {
    if (!obj) return [];
    const entries = Object.entries(obj);
    const total = entries.reduce((acc, [_, val]) => acc + val, 0);
    return entries.map(([key, value]) => ({
      key: key || 'No especificado', // Handle empty keys
      value,
      percent: total > 0 ? (value / total) * 100 : 0
    })).sort((a, b) => b.value - a.value); // Sort descending
  }
}
