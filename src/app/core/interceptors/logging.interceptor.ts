import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const started = performance.now();
    const cloned = req.clone({
      setHeaders: {
        Authorization: 'Bearer fake-jwt-token'
      }
    });

    return next.handle(cloned).pipe(
      tap({
        next: () => this.logRequest(req.url, performance.now() - started),
        error: () => this.logRequest(req.url, performance.now() - started, true)
      })
    );
  }

  private logRequest(url: string, duration: number, failed = false): void {
    const status = failed ? 'FAILED' : 'OK';
    console.info(`[HTTP ${status}] ${url} (${duration.toFixed(1)} ms)`);
  }
}

