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
        link: '/admin/dashboard',
      },
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
        title: 'Escalation Matrix',
        icon: 'fa fa-chart-bar',
        link: '/admin/escalation-matrix',
      },
      {
        title: 'LR View',
        icon: 'fa fa-info-circle',
        link: '/admin/lrview',
      },
      {
        title: 'Generate LR',
        icon: 'fa fa-pencil',
        link: '/admin/generate-lr',
      },
      {
        title: 'Group Managements',
        icon: 'fa fa-users',
        link: '/admin/group-managements',
      },

      {
        title: 'Ticket Properties',
        icon: 'fas fa-ticket-alt',
        link: '/admin/ticket-properties',
      },
      {
        title: 'Lorry Receipt Details',
        icon: 'fas fa-receipt',
        link: '/admin/lorry-receipt-details',
      },
      {
        title: 'Site Fencing',
        icon: 'nb-home',
        link: '/admin/site-fencing',
      },
      {
        title: 'Diagnostics',
        icon: 'nb-home',
        link: '/admin/diagnostics',
      },
      {
        title: 'Document',
        icon: 'nb-home',
        children: [
          {
            title: 'Pending Details',
            icon: 'fa fa-pencil-square-o',
            link: '/admin/pending-documents',
          },

        ]
      },

      {
        title: 'User Prefrence',
        icon: 'nb-home',
        link: '/admin/user-preferences',
      },
      {
        title: 'Site Details',
        icon: 'nb-home',
        link: '/admin/site-details',
        home: true,
      },
      {
        title: 'Alert Related Issue',
        icon: 'far fa-bell',
        link: '/admin/alert-related-issue',
        home: true,
      }
    ];
  }
}
