import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _token = '';
  _details = null;

  constructor() {
    this._token = localStorage.getItem('CUSTOMER_TOKEN') || '';
    this._details = JSON.parse(localStorage.getItem('CUSTOMER_DETAILS')) || null;
  }

}
