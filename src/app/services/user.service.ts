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
      { id: 1, route: '/admin/dashboard' },
      { id: 2, route: '/admin/vehiclestatuschange' },
      { id: 3, route: '/admin/issue-alerts' },
      { id: 4, route: '/admin/escalation-matrix' },
      { id: 5, route: '/admin/lrview' },
      { id: 6, route: '/admin/generate-lr' },
      { id: 7, route: '/admin/group-managements' },
      { id: 8, route: '/admin/ticket-properties' },
      { id: 9, route: '/admin/lorry-receipt-details' },
      { id: 10, route: '/admin/site-fencing' },
      { id: 11, route: '/admin/diagnostics' },
      { id: 12, route: '/admin/pending-documents' },
      { id: 13, route: '/admin/user-preferences' },
      { id: 14, route: '/admin/site-details' },
      { id: 15, route: '/admin/vscticketaudit' }
    ]
  }

}
