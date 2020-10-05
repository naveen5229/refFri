import { NbMenuItem } from '@nebular/theme';

export const ADMIN_MENU_ITEMS = JSON.stringify([
  {
    title: 'Dashboard',
    icon: 'fa-home',
    link: '/pages/dashboard',
  },
  {
    title: 'Load-Intelligence',
    icon: 'fa-home',
    link: '/load-intelligence',
  },
  {
    title: 'Trip',
    icon: 'fa-route',
    children: [
      {
        title: 'Vehicle Status Change',
        icon: 'fa-clipboard-check',
        link: '/admin/vehiclestatuschange',
      },
      {
        title: 'Trip Verification',
        icon: 'fa-clipboard-check',
        link: '/admin/tripverification',
      },
      {
        title: 'VSC Ticket Audit',
        icon: 'fa-ticket-alt',
        link: '/admin/vscticketaudit',
      },

      {
        title: 'Issue Alerts',
        icon: 'fa-exclamation-triangle',
        link: '/admin/issue-alerts',
      },
      {
        title: 'Alert Related Issue',
        icon: 'fa-bell',
        link: '/admin/alert-related-issue',
        home: true,
      },
      {
        title: 'Trip Feedback Logs',
        icon: 'fa-comment-dots',
        link: '/admin/trip-status-feedback-logs',
        home: true,
      },

      {
        title: 'Vehicle GPS Trail',
        icon: 'fa-receipt',
        link: '/admin/vehicle-gps-trail',
        home: true,
      },
      {
        title: 'Vehicle  Distance',
        icon: 'fa-route',
        link: '/admin/vehicle-distance',
        home: true,
      },
      {
        title: 'Trip Site Rule',
        icon: 'fa-file-signature',
        link: '/admin/trip-site-rule',
        home: true,
      },
      {
        title: 'Placement Site Rule',
        icon: 'fa-file-signature',
        link: '/admin/placement-site-rule',
        home: true,
      },
      {
        title: 'Transport Agents',
        icon: 'fa-address-card',
        link: '/admin/transport-agents',
        home: true,
      },


     
      {
        title: 'Trip Diagnosis',
        icon: 'fa-arrows-alt',
        link: '/admin/trip-analysis',
        home: true,
      },
      {
        title: 'VSC Diagnosis',
        icon: 'fa-arrows-alt',
        link: '/admin/vsc-diagnosis',
        home: true,
      },
    ]
  },
  {
    title: 'Sites',
    icon: 'fa-coins',
    home: true,
    children: [{
      title: 'Site Fencing',
      icon: 'fa-coins',
      link: '/admin/site-fencing',
    },
    {
      title: 'Site Details',
      icon: 'fa-sitemap',
      link: '/admin/site-details',
      home: true,
    },
    {
      title: 'Subsites',
      icon: 'fa-arrows-alt',
      link: '/admin/sub-sites',
      home: true,
    },
    {
      title: 'Buffer Polyline ',
      icon: 'fa-coins',
      link: '/admin/buffer-polyline',
    },
    {
      title: 'Transport Area Fencing',
      icon: 'fa-coins',
      link: '/admin/transport-area',
    },
    {
      title: 'Locations/Alias',
      icon: 'fa-map',
      link: '/admin/locations',
    },
    ]
  },

  {
    title: 'Admin',
    icon: 'fa-user',
    home: true,
    children: [
      {
        title: 'Driver List',
        icon: 'fa-male',
        link: '/admin/driver-list',
        home: true,
      },

      {
        title: 'Vehicle Categories',
        icon: 'fa-chart-bar',
        link: '/admin/vehicles-view',
      },

      {
        title: 'Diagnostics',
        icon: 'fa-stethoscope',
        link: '/admin/diagnostics',
      },

      {
        title: 'User Role',
        icon: 'fa-user-cog',
        link: '/admin/user-preferences',
      },
      {
        title: 'FO Activity Summary',
        icon: 'fa-file-alt',
        link: '/admin/activity-summary',
        home: true,
      },
      {
        title: 'Ticket Subscribe',
        icon: 'fa-info-circle',
        link: '/admin/ticket-subscribe',
        home: true,
      },
      {
        title: 'Cust Onboarding',
        icon: 'fa-info-circle',
        link: '/admin/add-customer',
        home: true,
      },
      {
        title: 'Toll Transaction Summary',
        icon: 'fa-road',
        link: '/admin/toll-transaction-summary',
        home: true,
      },
      {
        title: 'Manual Toll Transaction Summary',
        icon: 'fa-user',
        link: '/admin/manual-toll-transaction-summary',
        home: true,
      },
      {
        title: 'Vehicle Wise Toll Transaction Summary',
        icon: 'fa-car',
        link: '/admin/vehiclewise-tolltransaction',
        home: true,
      },
      {
        title: 'Vouchers Summary',
        icon: 'fa-list-alt',
        link: '/admin/vouchers-summary',
        home: true,
      },
      {
        title: 'Challan Payment Request',
        icon: 'fa-list-alt',
        link: '/admin/challan-payment-request',
        home: true,
      },
      {
        title: 'Mv Gps Api Request',
        icon: 'fa-list-alt',
        link: '/admin/mv-gps-api-req',
        home: true,
      },
      {
        title: 'Captcha',
        icon: 'fa-list-alt',
        link: '/admin/captcha',
        home: true,
      },
      {
        title: 'Financial Account Summary',
        icon: 'fa-pencil-square-o',
        link: '/admin/financial-account-summary',
      },
      {
        title: 'Vehicle Document Mismatch Summary',
        icon: 'fa-pencil-square-o',
        link: '/admin/vehdocmismatch',
      },

    ]
  },
  {
    title: 'Receipt & Invoice',
    icon: 'fa-receipt',
    children: [
      {
        title: 'Lorry Receipt Details',
        icon: 'fa-receipt',
        link: '/admin/lorry-receipt-details',
      },


      {
        title: 'LR Diagnostics',
        icon: 'fa-diagnostics',
        link: '/admin/lr-diagnostics',
      },
      {
        title: 'POD Dashboard',
        icon: 'fa-bar-chart',
        link: '/admin/pod-dashboard',
      },
      {
        title: 'Nearby Pods',
        icon: 'fa-bar-chart',
        link: '/admin/nearby-pods',
      },
    ]
  },
  {
    title: 'Customer Admin',
    icon: 'fa-user',
    children: [
      {
        title: 'Fo GPS Mapping',
        icon: 'fa-map-marked-alt',
        link: '/admin/gps-supplier-mapping',
        home: true,
      },
      {
        title: 'Vehicle GPS Detail',
        icon: 'fa-map-pin',
        link: '/admin/vehicle-gps-detail',
      },
      {
        title: 'Group Managements',
        icon: 'fa-users',
        link: '/admin/group-managements',
      },
      {
        title: 'Ticket Properties',
        icon: 'fa-ticket-alt',
        link: '/admin/ticket-properties',
      },
      {
        title: 'Escalation Matrix',
        icon: 'fa-chart-bar',
        link: '/admin/escalation-matrix',
      },
      // {
      //   title: 'Fo Vehicle Details',
      //   icon: 'fa-info-circle',
      //   link: '/admin/vehicles-view',
      //   home: true,
      // },
      {
        title: 'Company Details',
        icon: 'fa-info-circle',
        link: '/admin/company-details',
        home: true,
      },
      {
        title: 'Web Activity Summary',
        icon: 'fa-user',
        link: '/admin/web-activity-summary',
        home: true,
      },

      {
        title: 'User Template',
        icon: 'fa-user',
        link: '/admin/user-templates',
        home: true,
      },
      {
        title: 'Routes',
        icon: 'fa-pencil-square-o',
        link: '/admin/via-routes',
      },
    ]
  },


  {
    title: 'Document',
    icon: 'fa-file-alt',
    children: [
      {
        title: 'Pending Details',
        icon: 'fa-pencil-square-o',
        link: '/admin/pending-documents',
      },
      {
        title: 'Pending vehicle Modal',
        icon: 'fa-pencil-square-o',
        link: '/admin/pending-vehicle',
      },

    ]
  },

  {
    title: 'Fuel',
    icon: 'fa-gas-pump',
    children: [
      {
        title: 'Fuel Fillings',
        icon: 'fa-gas-pump',
        link: '/admin/fuel-fillings',
        home: true,
      },
      {
        title: 'Fuel Mileage',
        icon: 'fa-tachometer-alt',
        link: '/admin/fuel-average-analysis',
        home: true,
      },
      {
        title: 'Consolidate Fuel Average',
        icon: 'fa-signal',
        link: '/admin/consolidate-fuel-average',
        home: true,
      },
      {
        title: 'Fuel Diagnosis',
        icon: 'fa-signal',
        link: '/admin/fuel-analysis',
        home: true,
      },
      {
        title: 'Remaining Fuel',
        icon: 'fa-oil-can',
        link: '/admin/remaining-fuel',
        home: true,
      },
      {
        title: 'Fuel Rules',
        icon: 'fa-signal',
        link: '/admin/fuel-rules',
        home: true,
      },
      {
        title: 'Fo Model Fuel Milage',
        icon: 'fa-gas-pump',
        link: '/admin/fo-fuel-average',
        home: true,
      },

      {
        title: 'Pump Station Area',
        icon: 'fa-gas-pump',
        link: '/admin/pump-station-area',
        home: true,
      },
      {
        title: 'Fuel Average Issues',
        icon: 'fa-tachometer-alt',
        link: '/admin/fuel-average-issues',
        home: true,
      },
      {
        title: 'Fo Fs Mapping',
        icon: 'fa-signal',
        link: '/admin/fo-fs-mapping',
        home: true,
      },
      {
        title: 'Fuel Mileage With ODO',
        icon: 'fa-gas-pump',
        link: '/admin/fuel-mileage-with-odo',
        home: true
      },
    ]
  },
  {
    title: 'Account',
    icon: 'fa-money',
    link: '/accounts/dashboard'
  },
  {
    title: 'Maintenance',
    icon: 'fa-file-alt',
    children: [
      {
        title: 'Service Model',
        icon: 'fa-pencil-square-o',
        link: '/admin/view-modal-service',
      },
      {
        title: 'Sub Service Model',
        icon: 'fa-pencil-square-o',
        link: '/admin/view-sub-modal-service',
      },

    ]
  },
  {
    title: 'Battery',
    icon: 'fa-car-battery',
    children: [
      {
        title: 'Battery Models',
        icon: 'fa-text-width',
        link: '/admin/battery-modals',
        home: true,
      },
    ]
  },



]);
