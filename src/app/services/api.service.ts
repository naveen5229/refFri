import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonService } from '../services/common.service';
import { Body } from '@angular/http/src/body';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL: string = 'http://13.233.32.59/booster_webservices/'; // prod Server
  //URL: string = 'http://13.126.215.102/booster_webservices/'; // Dev Server
  // URL: string = 'http://192.168.0.113/transtruck/booster_webservices/'; // Pawan
  //URL: string = 'http://192.168.0.108/booster_webservices/'; // Umang
   URL: string = 'http://localhost/transtruck/booster_webservices/';

  constructor(private http: HttpClient,
    public user: UserService,
    public common: CommonService) {

  }


  post(subURL: string, body: any, options?) {
    if (this.common.foAdminUserId) {
      body['foAdminId'] = this.common.foAdminUserId;
    }

    console.log('Options: ', options);
    console.log('Body :', body);
    return this.http.post(this.URL + subURL, body, { headers: this.setHeaders(options) })
  }

  get(subURL: string, params?: any) {
    if (this.common.foAdminUserId) {
      if (subURL.includes('?')) {
        subURL += '&foAdminId=' + this.common.foAdminUserId;
      } else {
        subURL += '?foAdminId=' + this.common.foAdminUserId;
      }
    }
    console.log('subURL :', subURL);

    return this.http.get(this.URL + subURL, { headers: this.setHeaders() })
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

  setHeaders(options?) {
    const entryMode = localStorage.getItem('ENTRY_MODE');

    let data = {
      'Content-Type': 'application/json',
      'version': '1.0',
      'entrymode': entryMode,
      'authkey': this.user._token || ''
    };
    console.log('Data: ', data);

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'version': '1.0',
      'entrymode': entryMode,
      'authkey': this.user._token || ''
    });

    console.log('Header: ', headers);

    return headers;

  }
}
