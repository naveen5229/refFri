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
  _pages = [];

  constructor() {
    console.log('Details: ', localStorage.getItem('USER_DETAILS'));

    this._token = localStorage.getItem('USER_TOKEN') || '';
    this._details = JSON.parse(localStorage.getItem('USER_DETAILS')) || null;

    this._loggedInBy = localStorage.getItem('LOGGED_IN_BY') || '';
    this._customer = JSON.parse(localStorage.getItem('CUSTOMER_DETAILS')) || { name: '', id: '' };
    this._pages = [
      { id: 1, route: '/admin/escalation-matrix' },
      { id: 2, route: '/admin/vehiclestatuschange' },
      { id: 3, route: '/admin/generate-lr' },
      { id: 4, route: '/admin/ticket-properties' },
    ]
  }

}
