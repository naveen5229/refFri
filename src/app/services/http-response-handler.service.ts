import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { CommonService } from './common.service';

@Injectable({
  providedIn: 'root'
})
export class HttpResponseHandlerService implements HttpInterceptor {
  constructor(protected router: Router, public common: CommonService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).do((response) => {
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
    });
  }
}
