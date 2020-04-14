import { NbMenuItem } from '@nebular/theme';

export const ADMIN_MENU_ITEMS = JSON.stringify([
  {
    title: 'Dashboard',
    icon: 'fa fa-home',
    link: '/pages/dashboard',
  },
  {
    title: 'Load-Intelligence',
    icon: 'fa fa-home',
    link: '/load-intelligence',
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
        title: 'Placement Site Rule',
        icon: 'fas fa-file-signature',
        link: '/admin/placement-site-rule',
        home: true,
      },
      {
        title: 'Transport Agents',
        icon: 'fas fa-address-card',
        link: '/admin/transport-agents',
        home: true,
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
      {
        title: 'Trip Diagnosis',
        icon: 'fa fa-arrows-alt',
        link: '/admin/trip-analysis',
        home: true,
      },
      {
        title: 'VSC Diagnosis',
        icon: 'fa fa-arrows-alt',
        link: '/admin/vsc-diagnosis',
        home: true,
      },
    ]
  },
  {
    title: 'Site Fencing',
    icon: 'fas fa-coins',
    home: true,
    children: [{
      title: 'Site Fencing',
      icon: 'fas fa-coins',
      link: '/admin/site-fencing',
    },
    {
      title: 'Buffer Polyline ',
      icon: 'fas fa-coins',
      link: '/admin/buffer-polyline',
    },
    {
      title: 'Transport Area Fencing',
      icon: 'fas fa-coins',
      link: '/admin/transport-area',
    },
    {
      title: 'locations',
      icon: 'fas fa-map',
      link: '/admin/locations',
    },
    ]
  },

  {
    title: 'Admin',
    icon: 'fa fa-user',
    home: true,
    children: [
      {
        title: 'Driver List',
        icon: 'fa fa-male',
        link: '/admin/driver-list',
        home: true,
      },

      {
        title: 'Vehicle Categories',
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
        title: 'Cust Onboarding',
        icon: 'fas fa-info-circle',
        link: '/admin/add-customer',
        home: true,
      },
      {
        title: 'Toll Transaction Summary',
        icon: 'fas fa fa-road',
        link: '/admin/toll-transaction-summary',
        home: true,
      },
      {
        title: 'Manual Toll Transaction Summary',
        icon: 'fas fa fa-user',
        link: '/admin/manual-toll-transaction-summary',
        home: true,
      },
      {
        title: 'Vehicle Wise Toll Transaction Summary',
        icon: 'fas fa fa-car',
        link: '/admin/vehiclewise-tolltransaction',
        home: true,
      },
      {
        title: 'Vouchers Summary',
        icon: 'far fa-list-alt',
        link: '/admin/vouchers-summary',
        home: true,
      },
      {
        title: 'Challan Payment Request',
        icon: 'far fa-list-alt',
        link: '/admin/challan-payment-request',
        home: true,
      },
      {
        title: 'Mv Gps Api Request',
        icon: 'far fa-list-alt',
        link: '/admin/mv-gps-api-req',
        home: true,
      },
      {
        title: 'Captcha',
        icon: 'far fa-list-alt',
        link: '/admin/captcha',
        home: true,
      },
      {
        title: 'Financial Account Summary',
        icon: 'fa fa-pencil-square-o',
        link: '/admin/financial-account-summary',
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
        title: 'LR Diagnostics',
        icon: 'fas fa-diagnostics',
        link: '/admin/lr-diagnostics',
      },
      {
        title: 'POD Dashboard',
        icon: 'fa fa-bar-chart',
        link: '/admin/pod-dashboard',
      },
      {
        title: 'Nearby Pods',
        icon: 'fa fa-bar-chart',
        link: '/admin/nearby-pods',
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
        title: 'Ticket Properties',
        icon: 'fas fa-ticket-alt',
        link: '/admin/ticket-properties',
      },
      {
        title: 'Escalation Matrix',
        icon: 'fa fa-chart-bar',
        link: '/admin/escalation-matrix',
      },
      // {
      //   title: 'Fo Vehicle Details',
      //   icon: 'fas fa-info-circle',
      //   link: '/admin/vehicles-view',
      //   home: true,
      // },
      {
        title: 'Company Details',
        icon: 'fas fa-info-circle',
        link: '/admin/company-details',
        home: true,
      },
      {
        title: 'Web Activity Summary',
        icon: 'far fa-user',
        link: '/admin/web-activity-summary',
        home: true,
      },

      {
        title: 'User Template',
        icon: 'far fa-user',
        link: '/admin/user-templates',
        home: true,
      },
      {
        title: 'Routes',
        icon: 'fa fa-pencil-square-o',
        link: '/admin/via-routes',
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
        title: 'Pending vehicle Modal',
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
        title: 'Fuel Mileage',
        icon: 'fas fa-tachometer-alt',
        link: '/admin/fuel-average-analysis',
        home: true,
      },
      {
        title: 'Consolidate Fuel Average',
        icon: 'fa fa-signal',
        link: '/admin/consolidate-fuel-average',
        home: true,
      },
      {
        title: 'Fuel Diagnosis',
        icon: 'fa fa-signal',
        link: '/admin/fuel-analysis',
        home: true,
      },
      {
        title: 'Remaining Fuel',
        icon: 'fas fa-oil-can',
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
        title: 'Fo Model Fuel Milage',
        icon: 'fas fa-gas-pump',
        link: '/admin/fo-fuel-average',
        home: true,
      },

      {
        title: 'Pump Station Area',
        icon: 'fas fa-gas-pump',
        link: '/admin/pump-station-area',
        home: true,
      },
      {
        title: 'Fuel Average Issues',
        icon: 'fas fa-tachometer-alt',
        link: '/admin/fuel-average-issues',
        home: true,
      },
      {
        title: 'Fo Fs Mapping',
        icon: 'fa fa-signal',
        link: '/admin/fo-fs-mapping',
        home: true,
      },
      {
        title: 'Fuel Mileage With ODO',
        icon: 'fas fa-gas-pump',
        link: '/admin/fuel-mileage-with-odo',
        home: true
      },
    ]
  },
  {
    title: 'Account',
    icon: 'fa fa-money',
    link: '/accounts/dashboard'
  },
  {
    title: 'Maintenance',
    icon: 'fa fa-file-alt',
    children: [
      {
        title: 'Service Model',
        icon: 'fa fa-pencil-square-o',
        link: '/admin/view-modal-service',
      },
      {
        title: 'Sub Service Model',
        icon: 'fa fa-pencil-square-o',
        link: '/admin/view-sub-modal-service',
      },

    ]
  },
  {
    title: 'Battery',
    icon: 'fas fa-car-battery',
    children: [
      {
        title: 'Battery Models',
        icon: 'fa fa-text-width',
        link: '/admin/battery-modals',
        home: true,
      },
    ]
  },



]);
