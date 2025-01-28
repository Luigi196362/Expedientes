import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class HttpConnectionService {
  private readonly BASE_URL = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  getBaseUrl(): string {
    return this.BASE_URL;
  }

  getDefaultHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }
}
