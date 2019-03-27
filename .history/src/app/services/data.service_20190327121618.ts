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
        icon: 'nb-home',
        link: '/admin/vehiclestatuschange',
      },
      {
        title: 'VSC Ticket Audit',
        icon: 'nb-home',
        link: '/admin/vscticketaudit',
      },
      {
        title: 'Issue Alerts',
        icon: 'nb-home',
        link: '/admin/issue-alerts',
      },
      {
        title: 'Escalation Matrix',
        icon: 'nb-home',
        link: '/admin/escalation-matrix',
      },
      {
        title: 'LR View',
        icon: 'nb-home',
        link: '/admin/lrview',
      },
      {
        title: 'Generate LR',
        icon: 'nb-home',
        link: '/admin/generate-lr',
      },
      {
        title: 'Group Managements',
        icon: 'nb-home',
        link: '/admin/group-managements',
      },

      {
        title: 'Ticket Properties',
        icon: 'nb-home',
        link: '/admin/ticket-properties',
      },
      {
        title: 'Lorry Receipt Details',
        icon: 'nb-home',
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
