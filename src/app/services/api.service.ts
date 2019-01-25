import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL: string = 'http://13.233.32.59/booster_webservices/'; // prod Server
    // URL: string = 'http://13.126.215.102/booster_webservices/'; // Dev Server
  // URL: string = 'http://192.168.0.113/transtruck/booster_webservices/'; // Pawan
  //URL: string = 'http://192.168.0.108/booster_webservices/'; // Umang
  URL: string = 'http://localhost/booster_webservices/';

  constructor(private http: HttpClient,
    public user: UserService) { }

  post(subURL: string, body: any) {

    return this.http.post(this.URL + subURL, body, { headers: this.setHeaders() })
  }

  get(subURL: string, params?: any) {
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

  setHeaders() {

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'version': '1.0',
      'entrymode': '3',
      'authkey': this.user._token || ''
    });

    console.log('Header: ', headers);
    
    return headers;

  }
}
