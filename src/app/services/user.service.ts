import { Injectable } from '@angular/core';
import { ActivityService } from './Activity/activity.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  _token = '';
  _details = null;
  _customer = {
    name: '',
    id: '',
  };

  _loggedInBy = '';
  _pages = [];

  constructor() {
    console.log('Details: ', localStorage.getItem('USER_DETAILS'));

    this._token = localStorage.getItem('USER_TOKEN') || '';
    this._details = JSON.parse(localStorage.getItem('USER_DETAILS')) || null;

    this._loggedInBy = localStorage.getItem('LOGGED_IN_BY') || '';
    this._customer = JSON.parse(localStorage.getItem('CUSTOMER_DETAILS')) || { name: '', id: ''};




    this._pages = [
      { id: 1, route: '/pages/dashboard' },
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
      { id: 34, route: '/admin/remaining-fuel' },
      { id: 35, route: '/admin/ticket-subscribe' },
      { id: 36, route: '/admin/add-customer' },
      { id: 37, route: '/admin/fuel-rules' },
      { id: 38, route: '/admin/pump-station-area' },
      { id: 39, route: '/admin/toll-transaction-summary' },
      { id: 40, route: '/admin/manual-toll-transaction-summary' },
      { id: 41, route: '/admin/vehiclewise-tolltransaction' },
      { id: 42, route: '/admin/pending-vehicle' },
      { id: 43, route: '/admin/halt-density' },
      { id: 44, route: '/admin/placement-site-rule' },
      { id: 45, route: '/admin/fuel-average-issues' },
      { id: 46, route: '/admin/consolidate-fuel-average' },
      { id: 47, route: '/admin/fuel-analysis' },
      { id: 48, route: '/admin/vehicles' },
      { id: 49, route: '/admin/trip-analysis' },
      { id: 50, route: '/admin/vsc-diagnosis' },
      { id: 51, route: '/admin/view-modal-service' },
      { id: 52, route: '/admin/view-sub-modal-service' },
      { id: 53, route: '/admin/lr-diagnostics' },
      { id: 54, route: '/admin/via-routes' },
      { id: 55, route: '/admin/buffer-polyline' },
      { id: 56, route: '/admin/pod-dashboard' },
      { id: 57, route: '/admin/fo-fs-mapping' },
      { id: 58, route: '/admin/nearby-pods' },
      { id: 59, route: '/admin/locations' },
      { id: 60, route: '/admin/web-activity-summary' },
      { id: 61, route: '/admin/user-templates' },
      { id: 62, route: '/admin/vouchers-summary' },
      { id: 63, route: '/admin/fuel-mileage-with-odo' },
      { id: 64, route: '/admin/beehive' },
      { id: 65, route: '/admin/battery-modals' },
      { id: 66, route: '/admin/fo-fuel-average' },

    ]
  }


}
