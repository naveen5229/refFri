import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { AccountService } from './account.service';
import { encode } from 'punycode';
// import { CommonService } from '../services/common.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // URL: string = 'http://elogist.in/booster_webservices/'; // prod Server
  // URL: string = 'http://elogist.in/testservices/'; // prod Server
  URL: string = 'http://13.126.215.102/booster_webservices/'; // Dev Server
  // URL: string = 'http://localhost/Transtruck/booster_webservices/';
  // URL: string = 'http://192.168.0.111/booster_webservices/'; // Sachin
  // URL: string = 'http://192.168.0.127/booster_webservices/'; // Umang
  //  URL: string = 'http://localhost/booster_webservices/'; // sachin
   UrlTranstruckNew: string = 'http://192.168.0.120/webservices/';
  lTranstruckNew: string = 'http://elogist.in/transtrucknew/';
  L2 = 'http://elogist.in/transtruck/';

  constructor(private http: HttpClient,
    public router: Router,
  public accountService: AccountService ,
  public user: UserService) {
    
    
    
    (subURL: string, body: any, options?) {
  if (this.user._customer.id) {
      body['foAdminId'] = this.user._customer.id;
    body['multipleAccounts'] = this.user._details.multipleAccounts ? this.user._details.multipleAccounts : 0;
      // console.log(body['foAdminId']);
    console.log("foAdminId", body);
  }

  if (this.router.url.includes('accounts') &&  this.accountService.selected.branch) body['branch'] = this.accountService.selected.branch.id;
  
     console.log('BODY: ', body);
    turn this.http.post(this.URL + subURL, body, { headers: this.setHeaders() })
  }
    Encrypt(subURL: string, body: any, options?) {
     (this.user._customer.id) {
    body['foAdminId'] = this.user._customer.id;
    body['multipleAccounts'] = this.user._details.multipleAccounts ? this.user._details.multipleAccounts : 0;
    
    body = JSON.stringify(body);
      body = btoa(body);
    body = { encData: body };
      // console.log(body['foAdminId']);
    // console.log("foAdminId", body);
      console.log("Encrypted Params-->", body);
  
  }
  
  if (this.router.url.includes('accounts') && this.accountService.selected.branch) body['branch'] = this.accountService.selected.branch.id;

    // console.log('BODY: ', body);
  let encoded = this.http. post(this.URL + subURL, body, { headers: this.setHeaders() });
  return encoded;
  // encoded = atob(encoded);
    
      
    subURL: string, params?: any) {
      mulAcc = this.user._details.multipleAccounts ? this.user._details.multipleAccounts : 0;
     (this.user._customer.id) {
    if (subURL.includes('?')) {
        subURL += '&foAdminId=' + this.user._customer.id + '&multipleAccounts=' + mulAcc;
    } else {
      subURL += '?foAdminId=' + this.user._customer.id + '&multipleAccounts=' + mulAcc;
      
    
      
     (this.router.url.includes('accounts') && this.accountService.selected.branch) {
    if (subURL.includes('?')) {
        subURL += '&branch=' + this.accountService.selected.branch.id;
    } else {
      subURL += '?branch=' + this.accountService.selected.branch.id;
    } 
  };
  
  return this.http.get(this.URL + subURL, { headers: this.setHeaders() })
    
      rypt(subURL: string, params?: any) {
      url = subURL.split("?");
      dataBase64 = null;
      this.user._customer.id) {
       (subURL.includes('?')) {
      subURL += '&foAdminId=' + this.user._customer.id;
        r data = new Object();
        t url = subURL.split("?");
      let parameter = url[1];
      let paramsKeyValue = parameter.split("&");
      for (var key in paramsKeyValue) {
        var value = paramsKeyValue[key].split("=");
        data[value[0]] = value[1];
      }
      let dataString = JSON.stringify(data);
      dataBase64 = btoa(dataString);
        // let newParams = {encData: dataBase64};
    } else {
      subURL += '?foAdminId=' + this.user._customer.id;
      
    
      
     (this.router.url.includes('accounts') && this.accountService.selected.branch) {
    if (subURL.includes('?')) {
        subURL += '&branch=' + this.accountService.selected.branch.id;
      } else {
      subURL += '?branch=' + this.accountService.selected.branch.id;
    }
    };
 
  
  return this.http.get(this.URL + url[0] + '?encData=' + dataBase64, { headers: this.setHeaders() })
    
      
    (subURL: string, params?: any) {
      mulAcc = this.user._details.multipleAccounts ? this.user._details.multipleAccounts : 0;
     (this.user._customer.id) {
    if (subURL.includes('?')) {
        subURL += '&foAdminId=' + this.user._customer.id + '&multipleAccounts=' + mulAcc;
    } else {
      subURL += '?foAdminId=' + this.user._customer.id + '&multipleAccounts=' + mulAcc;
      
    
      
     (this.router.url.includes('accounts') && this.accountService.selected.branch) {
    if (subURL.includes('?')) {
        subURL += '&branch=' + this.accountService.selected.branch;
      } else {
      subURL += '?branch=' + this.accountService.selected.branch.id;
    }
    };
 
  
  return this.http.get(this.URL2 + subURL, {})
  
  
  stToTranstrucknew(subURL: string, body: any, optons?) {
  console.log('Test::::');
  // if (this.user._customer.id) {
  //   body['foAdminId'] = this.user._customer.id;
  // console.log(body['foAdminId']);
  //   console.log("foAdminId", body);
  // }
    nsole.log('Test::::');
    nsole.log('BODY: ', body);
    nst entryMode = this.user._loggedInBy == 'admin' ? '1' : this.user._loggedInBy == 'partner' ? '2' : '3';
    nsole.log('Test::::');
  let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    'version': '1.0',
    'entrymode': entryMode,
      'authkey': this.user._token || ''
  }); 
  
  return this.http.post(this.UrlTranstruckNew + subURL, body, { headers: headers })
  
  
  tToTranstruckNew(subURL: string, params?: any) {
  // if (this.user._customer.id) {
  //   if (subURL.includes('?')) {
  //     subURL += '&foAdminId=' + this.user._customer.id;
  //   } else {
  subURL += '?' + params;
       }
     }
    nst entryMode = this.user._loggedInBy == 'admin' ? '1' : this.user._loggedInBy == 'partner' ? '2' : '3';
    nsole.log('Test::::');
  let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    'version': '1.0',
    'entrymode': entryMode,
      'authkey': this.user._token || ''
  });
  
  return this.http.get(this.UrlTranstruckNew + subURL, { headers: headers })
  }
 
  t(subURL: string, body: any) {
  return this.http.put(this.URL + subURL, body, { headers: this.setHeaders() })
  }

  lete(subURL: string, ) {
  return this.http.delete(this.URL + subURL, { headers: this.setHeaders() })
  }

  tch(subURL: string, body: any, ) {
  return this.http.patch(this.URL + subURL, body, { headers: this.setHeaders() })
    
    
    eaders() {
    nst entryMode = this.user._loggedInBy == 'admin' ? '1' : this.user._loggedInBy == 'partner' ? '2' : '3';
    t headers = new HttpHeaders({
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
  
     return this.http.post(this.IMAGE_PROCESSING_URL + subURL, body, { headers: headers })
  // }
  
walle8Post(subURL: string, body: any, options?) {
    this.user._customer.id && (body['foAdminId'] = this.user._customer.id);
  if (this.router.url.includes(' accounts') && this.accountService.selected.branch) body['branch'] = this.accountService.selected.branch.id;
  
  return this.http.post(this.UrlTranstruckNew + subURL, body, { headers: this.setWalle8Headers() })
  }

walle8Get(subURL: string, params?: any) {
  return this.http.get(this.UrlTranstruckNew + subURL, { headers: this.setWalle8Headers() })
  
  

  tWalle8Headers() {
    nst entryMode = '3';
    nst authKey = this.user._details.authkeyOld || '';
    nst version = '2.3';
    
  let headers = new HttpHeaders({
      'Content-Type': 'application/json',
    'version': version,
    'entrymode': entryMode,
    'authkey': authKey
  });
    
      rn headers;
      
    ranches() {
      .post('Suggestion/GetBranchList', { search: 123 })
    .subscribe(res => {
      console.log('Branches :', res['data']);
        this.accountService.branches = res['data'];
      }, err => {
        console.log('Error: ', err);
      });
  }
}
