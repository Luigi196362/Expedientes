import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root',
})
export class HttpConnectionService {

  constructor(
    private http: HttpClient,
    private appConfigService: AppConfigService
  ) { }

  getBaseUrl(): string {
    return this.appConfigService.apiBaseUrl;
  }

  getDefaultHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: 'application/json',
    });
  }
}
