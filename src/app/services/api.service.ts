import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
// import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL: string = 'http://elogist.in/booster_webservices/'; // prod Server
URL: string = 'http://13.126.215.102/booster_webservices/'; // Dev Server
  // URL: string = 'http://192.168.0.113/transtruck/booster_webservices/'; // Pawan
  //  URL: string = 'http://192.168.0.119/booster_webservices/'; // Umang
  // URL: string = 'http://localhost/webservices/booster_webservices/'; // sachin
  //  URL: string = 'http://localhost/booster_webservices/';
  // URL: string = 'http://localhost/transtruck/booster_webservices/'; // sachin 
  UrlTranstruckNew: string = 'http://elogist.in/transtrucknew/';

  constructor(private http: HttpClient,
    public router: Router,
    public accountService: AccountService,
    public user: UserService) {
  }


  post(subURL: string, body: any, options?) {
    if (this.user._customer.id) {
      body['foAdminId'] = this.user._customer.id;
      // console.log(body['foAdminId']);
      console.log("foAdminId", body);
    }

    if (this.router.url.includes('accounts') && this.accountService.selected.branch) body['branch'] = this.accountService.selected.branch;

    console.log('BODY: ', body);
    return this.http.post(this.URL + subURL, body, { headers: this.setHeaders() })
  }

  get(subURL: string, params?: any) {
    if (this.user._customer.id) {
      if (subURL.includes('?')) {
        subURL += '&foAdminId=' + this.user._customer.id;
      } else {
        subURL += '?foAdminId=' + this.user._customer.id;
      }
    }

    if (this.router.url.includes('accounts') && this.accountService.selected.branch) {
      if (subURL.includes('?')) {
        subURL += '&branch=' + this.accountService.selected.branch;
      } else {
        subURL += '?branch=' + this.accountService.selected.branch;
      }
    };


    return this.http.get(this.URL + subURL, { headers: this.setHeaders() })
  }

  postToTranstrucknew(subURL: string, body: any, options?) {
    console.log('Test::::');
    // if (this.user._customer.id) {
    //   body['foAdminId'] = this.user._customer.id;
    // console.log(body['foAdminId']);
    //   console.log("foAdminId", body);
    // }
    console.log('Test::::');
    console.log('BODY: ', body);
    const entryMode = this.user._loggedInBy == 'admin' ? '1' : this.user._loggedInBy == 'partner' ? '2' : '3';
    console.log('Test::::');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'version': '1.0',
      'entrymode': entryMode,
      'authkey': this.user._token || ''
    });

    return this.http.post(this.UrlTranstruckNew + subURL, body, { headers: headers })
  }

  getToTranstruckNew(subURL: string, params?: any) {
    // if (this.user._customer.id) {
    //   if (subURL.includes('?')) {
    //     subURL += '&foAdminId=' + this.user._customer.id;
    //   } else {
    subURL += '?' + params;
    //   }
    // }
    const entryMode = this.user._loggedInBy == 'admin' ? '1' : this.user._loggedInBy == 'partner' ? '2' : '3';
    console.log('Test::::');
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'version': '1.0',
      'entrymode': entryMode,
      'authkey': this.user._token || ''
    });

    return this.http.get(this.UrlTranstruckNew + subURL, { headers: headers })
  }

  put(subURL: string, body: any) {
    return this.http.put(this.URL + subURL, body, { headers: this.setHeaders() })
  }

  delete(subURL: string, ) {
    return this.http.delete(this.URL + subURL, { headers: this.setHeaders() })
  }

  patch(subURL: string, body: any, ) {
    return this.http.patch(this.URL + subURL, body, { headers: this.setHeaders() })
  }

  setHeaders() {
    const entryMode = this.user._loggedInBy == 'admin' ? '1' : this.user._loggedInBy == 'partner' ? '2' : '3';
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'version': '1.0',
      'entrymode': entryMode,
      'apptype': 'dashboard',
      'authkey': this.user._token || ''
    });
    return headers;
  }


  // imageProcessingPost(subURL: string, body: any, options?) {
  //   let headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   return this.http.post(this.IMAGE_PROCESSING_URL + subURL, body, { headers: headers })
  // }
}
