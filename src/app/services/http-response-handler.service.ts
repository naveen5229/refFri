import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { tap, catchError } from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class HttpResponseHandlerService implements HttpInterceptor {
  constructor(protected router: Router, public common: CommonService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(response => {
        /****************** FOR LOGOUT **************** */
        if (response['body'] && response['body']['code']) {
          const code = response['body']['code'];
          const codes = [101];
          if (codes.indexOf(code) !== -1) {
            localStorage.clear();
            setTimeout(() => {
              this.common.showError(response['body']['msg']);
            }, 1000);
            this.router.navigate(['/auth/login']);
          }
        }
      }),
      catchError((err: any) => {
        this.common.loaderHandling('hide');
        this.common.showError(err.status === 0 ? 'Check Your Internet Connection & Try Again.' : '', err);
        return of(err);
      }));

  }
}

