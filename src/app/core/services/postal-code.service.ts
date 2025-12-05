import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, shareReplay, tap } from 'rxjs/operators';

export interface PostalCodeData {
  codigo: string;
  asentamiento: string;
  tipo_asentamiento: string;
  municipio: string;
  estado: string;
  ciudad: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostalCodeService {
  private dataPath = 'assets/Codigos Postales/Codigos Postales.txt';
  private cachedData$: Observable<string> | null = null;

  constructor(private http: HttpClient) {}

  private loadData(): Observable<string> {
    if (!this.cachedData$) {
      this.cachedData$ = this.http.get(this.dataPath, { responseType: 'arraybuffer' }).pipe(
        map(buffer => {
          const decoder = new TextDecoder('iso-8859-1');
          return decoder.decode(buffer);
        }),
        shareReplay(1)
      );
    }
    return this.cachedData$;
  }

  getSettlements(postalCode: string): Observable<PostalCodeData[]> {
    return this.loadData().pipe(
      map(data => {
        const lines = data.split('\n');
        const results: PostalCodeData[] = [];
        
        for (const line of lines) {
          if (line.startsWith(postalCode)) {
            const parts = line.split('|');
            // d_codigo|d_asenta|d_tipo_asenta|D_mnpio|d_estado|d_ciudad...
            // 0       |1       |2            |3      |4       |5
            if (parts.length >= 5) {
              results.push({
                codigo: parts[0],
                asentamiento: parts[1],
                tipo_asentamiento: parts[2],
                municipio: parts[3],
                estado: parts[4],
                ciudad: parts[5]
              });
            }
          }
        }
        return results;
      })
    );
  }
}
