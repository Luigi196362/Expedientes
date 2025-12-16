import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { PacienteService } from '../../services/paciente.service';
import { EstadisticasPaciente } from '../../models/estadisticas-paciente';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PdfDataService } from '../../../../shared/services/pdf-data.service';

@Component({
  selector: 'app-paciente-estadisticas',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule
  ],
  providers: [DatePipe],
  templateUrl: './paciente-estadisticas.component.html',
  styleUrl: './paciente-estadisticas.component.css'
})
export class PacienteEstadisticasComponent implements OnInit {
  estadisticas: EstadisticasPaciente | null = null;
  loading: boolean = true;
  error: string = '';

  startDate: Date | null = null;
  endDate: Date | null = null;

  constructor(
    private pacienteService: PacienteService,
    private datePipe: DatePipe,
    private router: Router,
    private pdfService: PdfDataService
  ) { }

  ngOnInit(): void {
    this.cargarEstadisticasGeneral();
  }

  cargarEstadisticasGeneral() {
    this.loading = true;
    this.error = '';
    this.pacienteService.estadisticasPaciente().subscribe({
      next: (data) => {
        this.estadisticas = data;
        this.loading = false;
        console.log('Estadísticas generales cargadas:', data);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas', err);
        this.error = 'No se pudieron cargar las estadísticas.';
        this.loading = false;
      }
    });
  }

  filtrar(): void {
    if (this.startDate && this.endDate) {
      this.loading = true;
      this.error = '';

      const startStr =
        this.datePipe.transform(this.startDate, 'yyyy-MM-dd') + 'T00:00:00';

      const endStr =
        this.datePipe.transform(this.endDate, 'yyyy-MM-dd') + 'T23:59:59';

      console.log(startStr, endStr);

      this.pacienteService.estadisticasRango(startStr, endStr).subscribe({
        next: (data) => {
          this.estadisticas = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = 'Error al filtrar por fechas.';
          this.loading = false;
        }
      });

    } else {
      alert('Por favor selecciona ambas fechas.');
    }
  }


  limpiar(): void {
    this.startDate = null;
    this.endDate = null;
    this.cargarEstadisticasGeneral();
  }

  generarPdf(): void {
    this.loading = true;
    let startStr: string | undefined;
    let endStr: string | undefined;

    if (this.startDate && this.endDate) {
      startStr = this.datePipe.transform(this.startDate, 'yyyy-MM-dd') + 'T00:00:00';
      endStr = this.datePipe.transform(this.endDate, 'yyyy-MM-dd') + 'T23:59:59';
    }

    this.pacienteService.obtenerReportePdf(startStr, endStr).subscribe({
      next: (response) => {
        this.loading = false;
        const blob = response.body;
        if (blob) {
          // Extract filename from content-disposition
          const contentDisposition = response.headers.get('content-disposition');
          let filename = 'reporte.pdf';
          if (contentDisposition) {
            const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
            if (matches && matches[1]) {
              filename = matches[1];
            }
          }

          // Store blob and filename in service and navigate
          this.pdfService.setPdfData(blob, this.router.url, filename);
          this.router.navigate(['/pdf-view']);
        } else {
          this.error = 'El reporte está vacío.';
        }
      },
      error: (err) => {
        console.error('Error al generar PDF', err);
        this.error = 'No se pudo generar el reporte PDF.';
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
