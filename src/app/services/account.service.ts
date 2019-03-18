import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  selected = {
    branch: ''
  };
  branches = [];

  constructor() {
    // this.getData('Suggestion/GetBranchList', { search: 123 }, 'branches');
  }

  // getData(url, params, variable) {
  //   this.api.post(url, params)
  //     .subscribe(res => {
  //       console.log('Response:', res['data']);
  //       this[variable] = res['data'];
  //     }, err => {
  //       console.log('Error: ', err);
  //     });
  // }

}
