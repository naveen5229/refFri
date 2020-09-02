import { NbMenuItem } from '@nebular/theme';

export const PAGES_MENU_ITEMS = JSON.stringify([
  {
    title: 'Trip',
    icon: 'fas fa-route',
    link: '/pages/dashboard',
    home: true,
    children: [
      {
        title: 'Dashboard - Trips',
        icon: 'fa fa-home',
        link: '/pages/dashboard',
        home: true,
      },
      {
        title: 'Load-Intelligence',
        icon: 'fa fa-home',
        link: '/pages/load-intelligence',
        home: true,
      },
      {
        title: 'Vehicle Trip',
        icon: 'fas fa-exchange-alt',
        link: '/pages/vehicle-trip',
      },
      {
        title: 'Trips',
        icon: 'fas fa-exchange-alt',
        link: '/pages/trip',
      },
      {
        title: 'Trip Status FeedBack',
        icon: 'fas fa-comment-alt',
        link: '/pages/trip-status-feedback',
        home: true,
      },
      {
        title: 'Trip FeedBack Logs',
        icon: 'fas fa-comments',
        link: '/pages/trip-feedback-logs',
        home: true,
      },
      {
        title: 'Vehicle States',
        icon: 'fas fa-comment-alt',
        link: '/pages/vehicle-states',
        home: true,
      },
      {
        title: 'Vehicle Status Change',
        icon: 'fas fa-clipboard-check',
        link: '/pages/vehiclestatuschange',
        home: true,
      },
      {
        title: 'Trip Issues',
        icon: 'fas fa-clipboard-check',
        link: '/pages/tripissues',
        home: true,
      },
      {
        title: 'Issues Report',
        icon: 'fas fa-clipboard-check',
        link: '/pages/issues-report',
        home: true,
      },

      {
        title: 'Placement Dashboard',
        icon: 'fas fa-map-marked-alt',
        link: '/pages/placements-dash-board',
        home: true,
      },
      {
        title: 'Vehicle Distance(24Hr)',
        icon: 'fas fa-road',
        link: '/pages/vehicle-covered-distance',
        home: true,
      },
      {
        title: 'Vehicle Distance',
        icon: 'fas fa-road',
        link: '/pages/vehicle-distance',
        home: true,
      },
      {
        title: 'Day Wise Vehicle Distance',
        icon: 'fas fa-road',
        link: '/pages/daywise-vehicle-distance',
        home: true,
      },
      // {
      //   title: 'Vehicle Trip States',
      //   icon: 'fas fa-map-marked',
      //   link: '/pages/vehicle-trip-states',
      //   home: true,
      // },
      {
        title: 'Verify Trip States',
        icon: 'far fa-check-circle',
        link: '/pages/trip-verify-states',
        home: true,
      },
      {
        title: 'Trends',
        icon: 'fa fa-line-chart',
        link: '/pages/trends'
      },
      {
        title: 'Route Trip Summary',
        icon: 'fa fa-line-chart',
        link: '/pages/trip-summary'
      },
      {
        title: 'Route Deviations',
        icon: 'fa fa-line-chart',
        link: '/pages/route-deviations'
      },
      {
        title: 'Trends Fo',
        icon: 'fa fa-line-chart',
        link: '/pages/trends-fo'
      },
      {
        title: 'Vehicle OdoMeter',
        icon: 'fas fa-tachometer-alt',
        link: '/pages/vehicle-odoMeter'
      },


      {
        title: 'Route-Dashboard',
        icon: 'fas fa-map-marked',
        link: '/pages/route-dashboard'
      },
      {
        title: 'Route-Trip',
        icon: 'fas fa-route',
        link: '/pages/route-trip'
      },
      {
        title: 'Trip P&L',
        icon: 'fa fa-pencil-square-o',
        link: '/pages/trip-pnl',
      },
      {
        title: 'TMG Trip',
        icon: 'fa fa-home',
        link: '/pages/tmg-trip',
      },
    ]
  },
  {
    title: 'Admin',
    icon: 'fas fa-chess-king',

    home: true,
    children: [
      {
        title: 'Tickets',
        icon: 'fas fa-ticket-alt',
        link: '/pages/tickets',
        home: true,
      },
    
      // {
      //   title: 'Finance Recovery',
      //   icon: 'fas fa-tachometer-alt',
      //   link: '/pages/finance-recovery'
      // },
      {
        title: 'Tickets All',
        icon: 'fas fa-ticket-alt',
        link: '/pages/tickets-all',
        home: true,
      },
      {
        title: 'Supervisor View',
        icon: 'fas fa-ticket-alt',
        link: '/pages/tickets-kpi',
        home: true,
      },
      {
        title: 'Card Mapping',
        icon: 'fas fa-clone',
        link: '/pages/card-mapping',
        home: true,
      },
      {
        title: 'GPS Details',
        icon: 'fa fa-map-marker',
        link: '/pages/vehicle-gps-detail',
        home: true,
      },
      {
        title: 'User Activity Statistics',
        icon: 'fas fa-signal',
        link: '/pages/user-activity-status',
        home: true,
      },
      {
        title: 'Vehicle Distance With Odometer',
        icon: 'fas fa-chart-pie',
        link: '/pages/vehicle-distance-with-odometer',
        home: true,
      },
      {
        title: 'Manage Party',
        icon: 'far fa-building',
        link: '/pages/manage-fo-party',
        home: true,
      },
      {
        title: 'Site',
        icon: 'fas fa-map-marker-alt',
        link: '/pages/sites',
        home: true,
      },
      {
        title: 'Web Activity Summary',
        icon: 'far fa-user',
        link: '/pages/web-acttivity-summary'
      },
      {
        title: 'Fo User Role',
        icon: 'fas fa-user-cog',
        link: '/pages/fo-user-role',
      },
      {
        title: 'Supervisor User Association',
        icon: 'fas fa-user-cog',
        link: '/pages/supervisor-user-association',
      },
      {
        title: 'Vehicles',
        icon: 'fas fa-info-circle',
        link: '/pages/vehicles',
        home: true,
      },
      {
        title: 'Unmerge LR State',
        icon: 'fas fa-clone',
        link: '/pages/unmerge-lrstate',
        home: true,
      },
      {
        title: 'Vehicle Supplier Association',
        icon: 'far fa-building',
        link: '/pages/vehicle-supplier-association',
        home: true,
      },
      {
        title: 'MV GPS API',
        icon: 'fas fa-clone',
        link: '/pages/mv-gps-apis',
        home: true,
      },
      {
        title: 'MV GPS API History',
        icon: 'fas fa-clone',
        link: '/pages/mv-gps-api-history',
        home: true,
      },
      {
        title: 'Routes',
        icon: 'fa fa-pencil-square-o',
        link: '/pages/via-routes',
      },
    ]
  },
  {
    title: 'Receipt & Invoice',
    icon: 'fa fa-list',
    children: [
      {
        title: 'Freight Rate Input',
        icon: 'fas fa-calculator',
        link: '/pages/frieght-rate-input',
      },
      // {
      //   title: 'LR-Invoice Columns',
      //   icon: 'fas fa-file-invoice',
      //   link: '/pages/lr-invoice-columns',
      // },

      {
        title: 'Freight Invoice',
        icon: 'fas fa-file-invoice-dollar',
        link: '/pages/freight-invoices',
      },

      {
        title: 'Transfer',
        icon: 'fas fa-dolly-flatbed',
        link: '/pages/transfers',
      },
      {
        title: 'MVS Freight Statement',
        icon: 'fas fa-dolly-flatbed',
        link: '/pages/mvs-freight-statement',
      },
      {
        title: 'Freight Expenses/Revenue',
        icon: 'fas fa-search-dollar',
        link: '/pages/freight-expenses',
      },
      {
        title: 'Lorry Receipts',
        icon: 'fas fa-receipt',
        link: '/pages/lorry-receipts',
      },


      {
        title: 'View LR Manifest',
        icon: 'far fa-file',
        link: '/pages/view-manifesto',
      },
      {
        title: 'LR/POD Receipts',
        icon: 'fa fa-eye',
        link: '/pages/lr-pod-receipts',
      },
      {
        title: 'Fuel/Cash Indent',
        icon: 'fas fa-gas-pump',
        link: '/pages/fuel-indent',
        home: true,
      },
      {
        title: 'Expenses',
        icon: 'fa fa-book',
        link: '/pages/expenses',
      },
      {
        title: 'POD Dashboard',
        icon: 'fa fa-bar-chart',
        link: '/pages/pod-dashboard',
      },
      {
        title: 'Nearby Pods',
        icon: 'fa fa-bar-chart',
        link: '/pages/nearby-pods',
      },
      {
        title: 'Dispatch orders',
        icon: 'fa fa-book',
        link: '/pages/dispatch-orders',
      },
    ]
  },
  {
    title: 'Traffic',
    icon: 'fas fa-traffic-light',
    children: [
      {
        title: 'Call Suggestion',
        icon: 'fas fa-traffic-light',
        link: '/pages/driver-call-suggestion',
        home: true,
      },
      {
        title: 'Site In & Out',
        icon: 'fas fa-truck',
        link: '/pages/site-in-out',
        home: true,
      },
      {
        title: 'Call Logs',
        icon: 'fa fa-phone',
        link: '/pages/call-logs',
        home: true,
      },
      {
        title: 'User Call Summary',
        icon: 'fas fa-address-book',
        link: '/pages/user-call-summary',
        home: true,
      },
      {
        title: 'Onward KMPD',
        icon: 'fas fa-list',
        link: '/pages/onward-kmpd',
        home: true,
      },
      {
        title: 'Vehicle Performance',
        icon: 'fas fa-truck-pickup',
        link: '/pages/vehicle-performance',
        home: true,
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
        link: '/pages/fuel-fillings',
        home: true,
      },
      
      {
        title: 'Fuel Mileage',
        icon: 'fas fa-tachometer-alt',
        link: '/pages/fuel-average-analysis',
        home: true,
      },
      {
        title: 'Remaining Fuel',
        icon: 'fas fa-oil-can',
        link: '/pages/remaining-fuel',
        home: true,
      },

      {
        title: ' Fuel Master',
        icon: 'fas fa-sliders-h',
        link: '/pages/fuel-master',
        home: true,
      },
      {
        title: 'Consolidate Fuel Average',
        icon: 'fa fa-signal',
        link: '/pages/consolidate-fuel-average',
        home: true,
      },
      {
        title: 'Fuel Station Entry',
        icon: 'fas fa-gas-pump',
        link: '/pages/fse-entry',
        home: true,
      },

      {
        title: 'Fuel Mileage With ODO',
        icon: 'fas fa-gas-pump',
        link: '/pages/fuel-mileage-with-odo',
        home: true
      },
      {
        title: 'Fuel Pump Summary',
        icon: 'fas fa-gas-pump',
        link: '/pages/fuel-consumption',
        home: true
      },
      {
        title: 'Fuel Daily Consumption',
        icon: 'fas fa-gas-pump',
        link: '/pages/fuel-daily-consumption',
        home: true

      }

    ]
  },
  {
    title: 'Documents',
    icon: 'fa fa-database',
    children: [{
      title: 'Document Input',
      icon: 'fa fa-book',
      link: '/pages/documentation-details',
      home: true,
    },
    {
      title: 'Document Dashboard',
      icon: 'fa fa-table',
      link: '/pages/documents-summary',
      home: true,
    },
    {
      title: 'Document Summary',
      icon: 'fa fa-file-text',
      link: '/pages/document-dashboard',
      home: true,
    },
    ]
  },


  {
    title: 'Driver',
    icon: 'fa fa-user',
    children: [{
      title: 'Driver Performance ',
      icon: 'fas fa-star',
      link: '/pages/driver-performance',
      home: true,
    },
    {
      title: 'Driver List ',
      icon: 'fa fa-list',
      link: '/pages/driver-list',
      home: true,
    },

    {

      title: 'Vehicle Driver Mapping',
      icon: 'fas fa-street-view',
      link: '/pages/vehicle-driver-mapping',
      home: true,
    },
    {

      title: 'Attendance List',
      icon: 'fa fa-clock-o',
      link: '/pages/driver-attendance',
      home: true,
    },
    {

      title: 'Driver Document',
      icon: 'fa fa-book',
      link: '/pages/driver-document',
      home: true,
    },

    {
      title: 'Advices',
      icon: 'fas fa-question',
      link: '/pages/advices',
      home: true,
    },

    ]
  },
  {
    title: 'Finance',
    icon: 'fas fa-money-bill-alt',
    children: [{
      title: 'Finance Recovery ',
      icon: 'fas fa-star',
      link: '/pages/finance-recovery',
      home: true,
    },]
  },
  {
    title: 'Tyre',
    icon: 'fa fa-cog',
    link: '/tyres/tyre-summary'
  },

  {
    title: 'Battery',
    icon: 'fas fa-car-battery',
    link: '/battery/battery-inventory'
  },
  {
    title: 'Accounts',
    icon: 'fas fa-coins',
    link: '/accounts/dashboard'
  },
  {
    title: 'Maintenance',
    icon: 'fas fa-tools',
    link: '/vehicle-maintenance/add-vehicle-maintenance'
  },
  {
    title: 'Ware-House',
    icon: 'fas fa-landmark',
    link: '/ware-house/ware-house-receipts'
  },
  {
    title: 'Challan',
    icon: 'fas fa-chalkboard-teacher',
    link: '/challan/pending-challan'
  },
  {
    title: 'TMG Challan',
    icon: 'fa fa-home',
    link: '/pages/tmg-challan',
    home: true,
  },
  {
    title: 'Walle8',
    icon: 'fas fa-wallet',
    link: '/walle8/card-balance'
  },
  {
    title: 'Bid-System',
    icon: 'fas fa-chalkboard-teacher',
    link: '/bid-system/dashboard'
  },
  {
    title: 'Load Intelligence',
    icon: 'fas fa-chalkboard-teacher',
    link: '/load-intelligence/dashboard'
  },

  {
    title: 'Load Intelligence',
    icon: 'fas fa-chalkboard-teacher',
    link: '/load-intelligence/dashboard'
  },
]);
