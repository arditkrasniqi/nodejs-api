import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpResponse,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpInterceptor
} from '@angular/common/http';
import {TokenManagerService} from '../../../../projects/token-manager/src/public_api';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/do';
import {Router} from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${TokenManagerService.get('token')}`
      }
    });
    return next.handle(request).do(
      (event: HttpEvent<any>) => {
      if (event instanceof HttpResponse) {
        // do stuff with response if you want
      }
    },
      (err: any) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 401) {
          // check if user is unAuthenticated
          // redirect to the login route
          TokenManagerService.destroy();
          this.router.navigate(['login']);
        }
      }
    });
  }
}
