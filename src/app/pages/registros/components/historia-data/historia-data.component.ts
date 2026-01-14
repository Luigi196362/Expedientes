import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { RegistroService } from '../../services/registros/registros.service';
import { Historia_clinica } from '../../models/historia-clinica';
import { PdfDataService } from '../../../../shared/services/pdf-data.service';

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
    private registroService: RegistroService,
    private pdfDataService: PdfDataService
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


  generarPdf() {
    if (!this.historia || !this.historia.id) return;

    this.loading = true;
    this.registroService.obtenerHistoriaPdf(this.historia.id).subscribe({
      next: (response) => {
        this.loading = false;
        const blob = response.body;
        if (blob) {
          const contentDisposition = response.headers.get('content-disposition');
          let filename = 'nota.pdf';
          if (contentDisposition) {
            const matches = /filename="?([^"]+)"?/.exec(contentDisposition);
            if (matches && matches[1]) {
              filename = matches[1];
            }
          }
          this.pdfDataService.setPdfData(blob, this.router.url, filename);
          this.router.navigate(['/pdf-view']);
        }
      },
      error: (err) => {
        console.error('Error al generar PDF de nota:', err);
        this.loading = false;
      }
    });
  }

  private getFilenameFromHeaders(headers: any): string | null {
    const contentDisposition = headers.get('content-disposition');
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        return matches[1].replace(/['"]/g, '');
      }
    }
    return null;
  }

}
