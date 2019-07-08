import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  selected = {
    branch: {
      name: '',
      id: 0,
      lr_number: null,
      is_constcenterallow: false
    },
    financialYear: null
  };
  branches = [];
  financialYears = [];
  voucherDate = '';

  constructor() {
  }

  

}
