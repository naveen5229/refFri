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
      { id: 1, route: '/pages' },
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
      { id: 15, route: '/admin/vscticketaudit' },
      { id: 16, route: '/admin/alert-related-issue' },
      { id: 17, route: '/admin/gps-supplier-mapping' },
      { id: 18, route: '/admin/vehicles-view' },
      { id: 19, route: '/admin/company-details' },
      { id: 20, route: '/admin/transport-agents' },
      { id: 21, route: '/admin/driver-list' },
      { id: 22, route: '/admin/vehicle-gps-trail' },
      { id: 23, route: '/admin/sub-sites' },
      { id: 23, route: '/admin/vehicle-distance' },
      { id: 24, route: '/admin/activity-summary' },
      { id: 25, route: '/admin/vehicle-gps-detail' },
      { id: 26, route: '/admin/vehicle-distance' },
      { id: 27, route: '/admin/fuel-fillings' },
      { id: 28, route: '/admin/trip-site-rule' },
      { id: 30, route: '/admin/trip-status-feedback-logs' },
      { id: 31, route: '/admin/transport-area' },
      { id: 32, route: '/accounts/dashboard' },
      { id: 33, route: '/admin/fuel-average-analysis' },

    ]
  }


}
