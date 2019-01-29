import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  URL: string = 'http://ec2-13-126-162-170.ap-south-1.compute.amazonaws.com:7070/'; // Dev Server
  // URL: string = 'http://ec2-13-126-162-170.ap-south-1.compute.amazonaws.com:7071/'; // Dev Server
  // URL: string = 'http://13.233.32.59/';
  version = '0.1.0';

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
      'version': this.version,
      'entrymode': '1',
      'authkey': this.user._token || ''
    });

    console.log('Header: ', headers);

    return headers;

  }
}
