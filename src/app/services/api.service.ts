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
    // URL: string = 'https://dev.elogist.in/booster_webservices/'; // Dev : http://elogist.in/testing/dos
    URL: string = 'http://localhost/booster_webservices/'; // Local
  UrlTranstruckNew: string = 'http://elogist.in/transtrucknew/';
  URL2 = 'http://elogist.in/transtruck/';
  URLJava : string = 'http://13.126.162.170:7070/'; // Dev Server


  constructor(private http: HttpClient,
    public router: Router,
    public accountService: AccountService,
    public user: UserService) {
  }


  postJava(endpoint: string, body: any, ) {
    console.log('test');
    let reqOpts = {
      headers: {
        'Content-Type': 'application/json',
        'version': '0.1.0'
      }
    };
    if (localStorage.getItem('TOKEN')) {
      reqOpts.headers['authkey'] = localStorage.getItem('TOKEN');
    }
    return this.http.post(this.URLJava + endpoint, body, reqOpts);
  }

  post(subURL: string, body: any, options?) {
    if (this.user._customer.id) {
      body['foAdminId'] = this.user._customer.id;
      body['multipleAccounts'] = this.user._details.multipleAccounts ? this.user._details.multipleAccounts : 0;
      // console.log(body['foAdminId']);
      console.log("foAdminId", body);
    }

    if (this.router.url.includes('accounts') && this.accountService.selected.branch) body['branch'] = this.accountService.selected.branch.id;

    if (options == 'J') {
      return this.http.post(this.URLJava + subURL, body, { headers: this.setHeaders('0.1.0') })

    } else {
      return this.http.post(this.URL + subURL, body, { headers: this.setHeaders() })
    }
    // console.log('BODY: ', body);
  }
  postEncrypt(subURL: string, body: any, options?) {
    if (this.user._customer.id) {
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
    let encoded = this.http.post(this.URL + subURL, body, { headers: this.setHeaders() });
    return encoded;
    // encoded = atob(encoded);
  }

  get(subURL: string, params?: any) {
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
        subURL += '&branch=' + this.accountService.selected.branch.id;
      } else {
        subURL += '?branch=' + this.accountService.selected.branch.id;
      }
    };

    return this.http.get(this.URL + subURL, { headers: this.setHeaders() })
  }
  getEncrypt(subURL: string, params?: any) {
    let url = subURL.split("?");
    let dataBase64 = null;
    if (this.user._customer.id) {
      if (subURL.includes('?')) {
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
        subURL += '?branch=' + this.accountService.selected.branch.id;
      }
    };


    return this.http.get(this.URL + url[0] + '?encData=' + dataBase64, { headers: this.setHeaders() })
  }

  get3(subURL: string, params?: any) {
    let mulAcc = this.user._details.multipleAccounts ? this.user._details.multipleAccounts : 0;
    if (this.user._customer.id) {
      if (subURL.includes('?')) {
        subURL += '&foAdminId=' + this.user._customer.id + '&multipleAccounts=' + mulAcc;
      } else {
        subURL += '?foAdminId=' + this.user._customer.id + '&multipleAccounts=' + mulAcc;
      }
    }
    //this.router.url.includes('accounts') &&
    if (this.accountService.selected.branch) {
      if (subURL.includes('?')) {
        subURL += '&branch=' + this.accountService.selected.branch;
      } else {
        subURL += '?branch=' + this.accountService.selected.branch.id;
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

  setHeaders(version?) {
    const entryMode = this.user._loggedInBy == 'admin' ? '1' : this.user._loggedInBy == 'partner' ? '2' : '3';
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'version': version || '1.0',
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

  walle8Post(subURL: string, body: any, options?) {
    this.user._customer.id && (body['foAdminId'] = this.user._customer.id);
    if (this.router.url.includes('accounts') && this.accountService.selected.branch) body['branch'] = this.accountService.selected.branch.id;

    return this.http.post(this.UrlTranstruckNew + subURL, body, { headers: this.setWalle8Headers() })
  }

  walle8Get(subURL: string, params?: any) {
    return this.http.get(this.UrlTranstruckNew + subURL, { headers: this.setWalle8Headers() })
  }


  setWalle8Headers() {
    const entryMode = '3';
    const authKey = this.user._details.authkeyOld || '';
    const version = '2.3';

    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'version': version,
      'entrymode': entryMode,
      'authkey': authKey
    });

    return headers;
  }
  getBranches() {
    this.post('Suggestion/GetBranchList', { search: 123 })
      .subscribe(res => {
        console.log('Branches :', res['data'], 'length', this.accountService.branches.length);
        this.accountService.branches = res['data'];
        if (this.accountService.branches.length == 1) {
          console.log('_________________________TRUE');
          this.accountService.selected.branchId = this.accountService.branches[0].id;
          this.accountService.selected.branch = this.accountService.branches[0];
        } else {
          console.log('_________________________ELSE111');
          this.accountService.selected.branchId = 0;
          this.accountService.selected.branch.id = 0;
          // this.accountService.selected.branch.name = ;

        }
      }, err => {
        console.log('Error: ', err);
      });
  }
}