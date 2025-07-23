import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Ajoute withCredentials: true à toutes les requêtes API (pour Sanctum)
    const apiReq = req.clone({ withCredentials: true });
    return next.handle(apiReq);
  }
}
