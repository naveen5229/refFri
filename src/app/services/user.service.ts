import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _token = '';
  _details = null;
  _customer = {
    name: '',
    id: ''
  };

  _loggedInBy = '';

  constructor() {
    console.log('Details: ', localStorage.getItem('USER_DETAILS'));

    this._token = localStorage.getItem('USER_TOKEN') || '';
    this._details = JSON.parse(localStorage.getItem('USER_DETAILS')) || null;

    this._loggedInBy = localStorage.getItem('LOGGED_IN_BY') || '';
    this._customer = JSON.parse(localStorage.getItem('CUSTOMER_DETAILS')) || { name: '', id: '' };

  }

}
