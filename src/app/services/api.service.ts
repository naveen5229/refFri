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
  // URL: string = 'http://elogist.in/testservices/'; // prod Server
   URL: string = 'http://13.126.215.102/booster_webservices/'; // Dev Server
  // URL: string = 'http://localhost/Transtruck/booster_webservices/';
  // URL: string = 'http://192.168.0.180/booster_webservices/'; // Sachin
  // URL: string = 'http://192.168.0.120/booster_webservices/'; // Umang
  // URL: string = 'http://192.168.0.189/booster_webservices/'; // vishal
 // http://192.168.0.189/booster_webservices/UserRoles/setFoWebPageVisits
  //URL: string = 'http://elogist.in/testservices/'; // prod Server
  // UrlTranstruckNew: string = 'http://192.168.0.120/webservices/';
  UrlTranstruckNew: string = 'http://elogist.in/transtrucknew/';
  URL2 = 'http://elogist.in/transtruck/';

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

    if (this.router.url.includes('accounts') && this.accountService.selected.branch) body['branch'] = this.accountService.selected.branch.id;

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
        subURL += '&branch=' + this.accountService.selected.branch.id;
      } else {
        subURL += '?branch=' + this.accountService.selected.branch.id;
      }
    };


    return this.http.get(this.URL + subURL, { headers: this.setHeaders() })
  }

  get3(subURL: string, params?: any) {
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


    return this.http.get(this.URL2 + subURL, {})
  }

  postToTranstrucknew(subURL: string, body: any, optons?) {
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

  getBranches() {
    this.post('Suggestion/GetBranchList', { search: 123 })
      .subscribe(res => {
        console.log('Branches :', res['data']);
        this.accountService.branches = res['data'];
      }, err => {
        console.log('Error: ', err);
      });
  }
}
