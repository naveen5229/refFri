import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _token = '';
  _details = null;

  constructor() {
    console.log('Details: ', localStorage.getItem('CUSTOMER_DETAILS'));
    
    this._token = localStorage.getItem('CUSTOMER_TOKEN') || '';
    this._details = JSON.parse(localStorage.getItem('CUSTOMER_DETAILS')) || null;
  }

}
