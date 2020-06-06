import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  selected = {
    branch: {
      name: 'All',
      id: 0,
      lr_number: null,
      is_constcenterallow: false,
      is_inv_manualapprove:false
    },
    financialYear: null,
    branchId: 0
  };
  branches = [];
  financialYears = [];
  voucherDate = '';
  fromdate='';
  todate='';

  constructor() {
  }
  

}
