import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PdfDataService {
    private pdfBlob: Blob | null = null;
    private previousUrl: string = '/';
    private filename: string = 'reporte.pdf';

    setPdfData(blob: Blob, fromUrl: string = '/', filename: string = 'reporte.pdf') {
        this.pdfBlob = blob;
        this.previousUrl = fromUrl;
        this.filename = filename;
    }

    getFilename(): string {
        return this.filename;
    }

    getPdfBlob(): Blob | null {
        return this.pdfBlob;
    }

    getPreviousUrl(): string {
        return this.previousUrl;
    }

    clearData() {
        this.pdfBlob = null;
        this.previousUrl = '/';
    }
}
