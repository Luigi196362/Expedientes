import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

// Definición de la interfaz para la configuración
export interface AppConfig {
    apiBaseUrl: string;
}

@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private config: AppConfig | null = null;

    constructor(private http: HttpClient) { }

    async loadConfig(): Promise<void> {
        // 1. Intentar cargar desde Electron (IPC)
        try {
            if ((window as any).api && (window as any).api.getConfig) {
                console.log('[AppConfig] Intentando cargar desde Electron IPC...');
                const electronConfig = await (window as any).api.getConfig();

                if (electronConfig && electronConfig.apiBaseUrl) {
                    console.log('[AppConfig] Configuración cargada desde Electron:', electronConfig);
                    this.config = electronConfig;
                    return;
                }
            }
        } catch (e) {
            console.error('[AppConfig] Error al cargar desde Electron:', e);
        }

        // 2. Fallback a environment (Web / Default)
        console.log('[AppConfig] Usando configuración de entorno (environment.ts).');
        this.config = {
            apiBaseUrl: environment.apiBaseUrl
        };
    }

    get apiBaseUrl(): string {
        return this.config?.apiBaseUrl || environment.apiBaseUrl;
    }
}
