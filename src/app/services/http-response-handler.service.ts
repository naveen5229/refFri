import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import 'rxjs/add/operator/do';
import { Router } from '@angular/router';
import { CommonService } from './common.service';
import { tap, catchError } from "rxjs/operators";
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class HttpResponseHandlerService implements HttpInterceptor {
  constructor(protected router: Router, public common: CommonService, public user: UserService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(response => {
        // console.log("Response Body---->", response);
        /****************** FOR LOGOUT **************** */
        if (response['body'] && response['body']['code']) {
          const code = response['body']['code'];
          const success = response['body']['success'];
          const codes = [101, 13];

          if (codes.indexOf(code) !== -1) {
            localStorage.clear();
            this.user._token = '';
            this.user._details = null;
            this.user._loggedInBy = '';
            this.user._pages = null;
            this.user._customer = {
              name: '',
              id: '',
            };
            this.user._menu = {
              admin: [],
              pages: [],
              tyres: [],
              battery: [],
              vehicleMaintenance: [],
              wareHouse: [],
              account: [],
              challan: [],
              walle8: [],
            };
            localStorage.removeItem('DOST_USER_PAGES');
            setTimeout(() => {
              this.common.showError(response['body']['msg']);
            }, 1000);
            this.router.navigate(['/auth/login']);
          }
          if (!success && response['body'].msg !== "Qr Code Wrong!!") {
            setTimeout(() => {
              this.common.showError(response['body']['msg']);
            }, 500);
          }
        }
        if (response['body'] && response['body']['encData']) {

          // console.log("heres");
          let data = atob(response['body']['encData']);
          console.log("Encrypted Base64 From Api-->", response['body']['encData']);
          console.log("Encrypted From Api-->", data);
          data = JSON.parse(data);
          console.log("Decrypted Data-->", data);
          response['body'] = data;

        }
      }),
      catchError((err: any) => {
        this.common.loaderHandling('hide');
        this.common.showError(err.status === 0 ? 'Check Your Internet Connection & Try Again.' : '', err);
        return of(err);
      }));

  }
}

