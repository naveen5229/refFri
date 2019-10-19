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
  //  URL: string = 'http://elogist.in/testservices/'; // prod Server
  URL: string = 'http://13.126.215.102/booster_webservices/'; // Dev Server
  // URL: string = 'http://192.168.1.112/booster_webservices/'; // Umang
  //  URL: string = 'http://localhost/booster_webservices/'; // sachin
// UrlTranstruckNew: string = 'http://192.168.0.120/webservices/';
  UrlTranstruckNew: string = 'http://elogist.in/transtrucknew/';
  URL2 = 'http://elogist.in/transtruck/';
 
  nstructor(private http: HttpClient,
    blic router: Router,
    blic accountService: AccountService,
    blic user: UserService) {
    
  

  st(subURL: string, body: any, options?) {
    if (this.user._customer.id) {
    body['foAdminId'] = this.user._customer.id;
    body['multipleAccounts'] = this.user._details.multipleAccounts ? this.user._details.multipleAccounts : 0;
    // console.log(body['foAdminId']);
    console.log("foAdminId", body); 
  }
    
     (this.router.url.includes('accounts') && this.accountService.selected.branch) body['branch'] = this.accountService.selected.branch.id;

     console.log('BODY: ', body);
    turn this.http.post(this.URL + subURL, body, { headers: this.setHeaders() })
    
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

  if (this.router.url.incl udes('accounts') && this.accountService.selected.branch) body['branch'] = this.accountService.selected.branch.id;
  
  // console.log('BODY: ', body);
    t encoded = this.http.post(this.URL + subURL, body, { headers: this.setHeaders() });
      rn encoded;
     encoded = atob(encoded);
      
    
  t(subURL: string, params?: any) {
    let mulAcc = this.user._details.multipleAccounts ? this.user._details.multipleAccounts : 0;
  if (this.user._customer.id) {
    if (subURL.includes('?')) {
      subURL += '&foAdminId=' + this.user._customer.id + '&multipleAccounts=' + mulAcc;
    } else {
      subURL += '?foAdminId=' + this.user._customer.id + '&multipleAccounts=' + mulAcc;
    }
  }

  if (this.router.url.includes('accounts') && this.accountService.selected.branch) {
    if (subURL.includes('?')) {
      subURL += '&branch=' + this .accountService.selected.branch.id;
    } else {
      subURL += '?branch=' + this.accountService.selected.branch.id;
    }
    
      
      rn this.http.get(this.URL + subURL, { headers: this.setHeaders() })
      
      rypt(subURL: string, params?: any) {
      url = subURL.split("?");
      dataBase64 = null;
        is.user._customer.id) {
        subURL.includes('?')) {
      subURL += '&foAdminId=' + this.user._customer.id;
      var data = new Object();
      let url = subURL.split("?");
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
    }
  }

    if (this.router.url.includes('accounts') && this.accountService.selected.branch) {
    if (subURL.includes('?')) {
      subURL += '&branch=' + this.accountService.selected.branch.id;
      } else {
      subURL += '?branch='  + this.accountService.selected.branch.id;
    }
  };
    
      
    turn this.http.get(this.URL + url[0] + '?encData=' + dataBase64, { headers: this.setHeaders() })
      
    
  t3(subURL: string, params?: any) {
    let mulAcc = this.user._details.multipleAccounts ? this.user._details.multipleAccounts : 0;
  if (this.user._customer.id) {
    if (subURL.includes('?')) {
      subURL += '&foAdminId=' + this.user._customer.id + '&multipleAccounts=' + mulAcc;
    } else {
      subURL += '?foAdminId=' + this.user._customer.id + '&multipleAccounts=' + mulAcc;
    }
  }

    if (this.router.url.includes('accounts') && this.accountService.selected.branch) {
    if (subURL.includes('?')) {
      subURL += '&branch=' + this.accountService.selected.branch;
      } else {
      subURL += '?branch=' + this.accountService.sele cted.branch.id;
    }
  };
  
  
  return this.http.get(this.URL2 + subURL, {})
  
  
  stToTranstrucknew(subURL: string, body: any, optons?) {
  console.log('Test::::');
  // if (this.user._customer.id) {
  //   body['foAdminId'] = this.user._customer.id;
     console.log(body['foAdminId']);
       console.log("foAdminId", body);
     }
    nsole.log('Test::::');
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
  
  
  tToTranstruckNew(subURL: string, params?: any) {
  // if (this.user._customer.id) {
  //   if (subURL.includes('?')) {
         subURL += '&foAdminId=' + this.user._customer.id;
       } else {
    bURL += '?' + params;
       }
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

put(subURL: string, body: any) 
  return this.http.put(this.URL + subURL, body, { headers: this.setHeaders() })
}

delete(subURL: string, ) {
  return this.http.delete(this.URL + subURL, { headers: this.setHeaders() })
  
    
    h(subURL: string, body: any, ) {
    turn this.http.patch(this.URL + subURL, body, { headers: this.setHeaders() })
    
    
  tHeaders() {
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


// imageProcessingPost(subURL: string, body:  any, options?) {
     let headers = new HttpHeaders({
       'Content-Type': 'application/json'
  //   });
  
//   return this.http.post(this.IMAGE_PROCESSING_URL + subURL, body, { headers: headers })
  // }
 
  lle8Post(subURL: string, body: any, options?) {
  this.user._customer.id && (body['foAdminId'] = this.user._customer.id);
    if (this.router.url.includes('accounts') && this.accountService.selected.branch) body['branch'] = this.accountService.selected.branch.id;

  return this.http.post(this.UrlTranstruckNew + subURL, body, { headers: this.setWalle8Headers() })
  
  
  lle8Get(subURL: string, params?: any) {
    return this.http.get(this.UrlTranstruckNew + subURL, { headers: this.setWalle8Headers() })
  
    
    
    alle8Headers() {
    nst entryMode = '3';
  const authKey = this.user._details.authkeyOld || '';
    const version = '2.3';
  
  let headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'version': version,
    'entrymode': entryMode,
      uthkey': authKey
      
      
         headers;
        
        hes() {
      .post('Suggestion/GetBranchList', { search: 123 })
        scribe(res => {
        nsole.log('Branches :', res['data']);
        is.accountService.branches = res['data'];
         (this.accountService.branches.length == 2) {
          console.log('_________________________TRUE');
        this.accountService.selected.branchId = this.accountService.branches[1].id;
        this.accountService.selected.branch = this.accountService.branches[1];
      } else {
        console.log('_________________________ELSE');
        this.accountService.selected.branchId = 0;
          this.accountService.selected.branch.id = 0;
          // this.accountService.selected.branch.name = ;

        }
      }, err => {
        console.log('Error: ', err);
      });
  }
}
