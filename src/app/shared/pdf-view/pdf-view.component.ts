import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { PdfDataService } from '../services/pdf-data.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-pdf-view',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './pdf-view.component.html',
  styleUrl: './pdf-view.component.css'
})
export class PdfViewComponent implements OnInit, OnDestroy {
  pdfUrl: SafeResourceUrl | null = null;
  zoomLevel: number = 100;
  private blob: Blob | null = null;
  private objectUrl: string | null = null;

  constructor(
    private pdfService: PdfDataService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.blob = this.pdfService.getPdfBlob();
    const filename = this.pdfService.getFilename();

    if (this.blob) {
      // Intento de forzar el nombre usando el constructor File (funciona en algunos navegadores modernos)
      const file = new File([this.blob], filename, { type: 'application/pdf' });
      this.objectUrl = URL.createObjectURL(file);
      // Disable toolbar and navpanes, force FitH (Fit Width)
      this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.objectUrl + '#toolbar=0&navpanes=0&view=FitH');
    } else {
      // If no PDF data, go back or home
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    if (this.objectUrl) {
      URL.revokeObjectURL(this.objectUrl);
    }
    this.pdfService.clearData();
  }

  downloadPdf() {
    if (this.blob && this.objectUrl) {
      const a = document.createElement('a');
      a.href = this.objectUrl;
      a.download = this.pdfService.getFilename();
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  printPdf() {
    const iframe = document.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.print();
    }
  }

  goBack() {
    this.location.back();
  }

  zoomIn() {
    this.zoomLevel += 25;
  }

  zoomOut() {
    if (this.zoomLevel > 25) {
      this.zoomLevel -= 25;
    }
  }

  resetZoom() {
    this.zoomLevel = 100;
  }
}
