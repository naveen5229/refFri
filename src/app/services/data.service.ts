import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public routes = {
    cost: [],
    profit: []
  };
  public costRoutes = [];

  _menu = {
    admin: this.setAdminpages()
  };

  constructor() { }

  setAdminpages() {
    return [
      {
        title: 'Dashboard',
        icon: 'fa fa-home',
        link: '/pages',
      },
      {
        title: 'Trip',
        icon: 'fas fa-route',
        children: [
          {
            title: 'Vehicle Status Change',
            icon: 'fas fa-clipboard-check',
            link: '/admin/vehiclestatuschange',
          },
          {
            title: 'VSC Ticket Audit',
            icon: 'fas fa-ticket-alt',
            link: '/admin/vscticketaudit',
          },

          {
            title: 'Issue Alerts',
            icon: 'fa fa-exclamation-triangle',
            link: '/admin/issue-alerts',
          },
          {
            title: 'Alert Related Issue',
            icon: 'far fa-bell',
            link: '/admin/alert-related-issue',
            home: true,
          },
          {
            title: 'Trip Feedback Logs',
            icon: 'fas fa-comment-dots',
            link: '/admin/trip-status-feedback-logs',
            home: true,
          },

          {
            title: 'Vehicle GPS Trail',
            icon: 'fas fa-receipt',
            link: '/admin/vehicle-gps-trail',
            home: true,
          },
          {
            title: 'Vehicle  Distance',
            icon: 'fas fa-route',
            link: '/admin/vehicle-distance',
            home: true,
          },
          {
            title: 'Trip Site Rule',
            icon: 'fas fa-file-signature',
            link: '/admin/trip-site-rule',
            home: true,
          },
          {
            title: 'Transport Agents',
            icon: 'fas fa-address-card',
            link: '/admin/transport-agents',
            home: true,
          },

          {
            title: 'Site Fencing',
            icon: 'fas fa-coins',
            link: '/admin/site-fencing',
          },
          {
            title: 'Transport Area Fencing',
            icon: 'fas fa-coins',
            link: '/admin/transport-area',
          },
          {
            title: 'Site Details',
            icon: 'fa fa-sitemap',
            link: '/admin/site-details',
            home: true,
          },
          {
            title: 'Subsites',
            icon: 'fa fa-arrows-alt',
            link: '/admin/sub-sites',
            home: true,
          },
        ]
      },

      {
        title: 'Admin',
        icon: 'fa fa-user',
        home: true,
        children: [
          {
            title: 'Driver',
            icon: 'fa fa-male',
            link: '/admin/driver-list',
            home: true,
          },
          {
            title: 'Ticket Properties',
            icon: 'fas fa-ticket-alt',
            link: '/admin/ticket-properties',
          },
          {
            title: 'vehicle view',
            icon: 'fa fa-chart-bar',
            link: '/admin/vehicles-view',
          },

          {
            title: 'Diagnostics',
            icon: 'fa fa-stethoscope',
            link: '/admin/diagnostics',
          },

          {
            title: 'User Role',
            icon: 'fas fa-user-cog',
            link: '/admin/user-preferences',
          },
          {
            title: 'FO Activity Summary',
            icon: 'fas fa-file-alt',
            link: '/admin/activity-summary',
            home: true,
          },
          {
            title: 'Ticket Subscribe',
            icon: 'fas fa-info-circle',
            link: '/admin/ticket-subscribe',
            home: true,
          },
          {
            title: 'add-customer',
            icon: 'fas fa-info-circle',
            link: '/admin/add-customer',
            home: true,
          },
        ]
      },
      {
        title: 'Receipt & Invoice',
        icon: 'fas fa-receipt',
        children: [
          {
            title: 'Lorry Receipt Details',
            icon: 'fas fa-receipt',
            link: '/admin/lorry-receipt-details',
          },

          {
            title: 'Generate LR',
            icon: 'fa fa-pencil',
            link: '/admin/generate-lr',
          },
        ]
      },
      {
        title: 'Customer Admin',
        icon: 'fa fa-user',
        children: [
          {
            title: 'Fo GPS Mapping',
            icon: 'fas fa-map-marked-alt',
            link: '/admin/gps-supplier-mapping',
            home: true,
          },
          {
            title: 'Vehicle GPS Detail',
            icon: 'fas fa-map-pin',
            link: '/admin/vehicle-gps-detail',
          },
          {
            title: 'Group Managements',
            icon: 'fa fa-users',
            link: '/admin/group-managements',
          },
          {
            title: 'Escalation Matrix',
            icon: 'fa fa-chart-bar',
            link: '/admin/escalation-matrix',
          },
          {
            title: 'Fo Vehicle Details',
            icon: 'fas fa-info-circle',
            link: '/admin/vehicles-view',
            home: true,
          },
          {
            title: 'Company Details',
            icon: 'fas fa-info-circle',
            link: '/admin/company-details',
            home: true,
          },

        ]
      },






      {
        title: 'Document',
        icon: 'fa fa-file-alt',
        children: [
          {
            title: 'Pending Details',
            icon: 'fa fa-pencil-square-o',
            link: '/admin/pending-documents',
          },
          {
            title: 'Pending vehicle',
            icon: 'fa fa-pencil-square-o',
            link: '/admin/pending-vehicle',
          },

        ]
      },

      {
        title: 'Fuel',
        icon: 'fas fa-gas-pump',
        children: [
          {
            title: 'Fuel Fillings',
            icon: 'fas fa-gas-pump',
            link: '/admin/fuel-fillings',
            home: true,
          },
          {
            title: 'Fuel Average Analysis',
            icon: 'fa fa-signal',
            link: '/admin/fuel-average-analysis',
            home: true,
          },
          {
            title: 'Remaining Fuel',
            icon: 'fa fa-signal',
            link: '/admin/remaining-fuel',
            home: true,
          },
          {
            title: 'Fuel Rules',
            icon: 'fa fa-signal',
            link: '/admin/fuel-rules',
            home: true,
          },
          {
            title: 'Pump Station Area',
            icon: 'fa fa-signal',
            link: '/admin/pump-station-area',
            home: true,
          },
        ]
      },
      {
        title: 'Account',
        icon: 'fa fa-money',
        link: '/accounts/dashboard'
      },






    ];
  }
}
