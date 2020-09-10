import { NbMenuItem } from '@nebular/theme';

export const PAGES_MENU_ITEMS = JSON.stringify([
  {
    title: 'Trip',
    icon: 'fa-route',
    link: '/pages/dashboard',
    home: true,
    children: [
      {
        title: 'Dashboard - Trips',
        icon: 'fa-home',
        link: '/pages/dashboard',
        home: true,
      },
      {
        title: 'Load-Intelligence',
        icon: 'fa-home',
        link: '/pages/load-intelligence',
        home: true,
      },
      {
        title: 'Vehicle Trip',
        icon: 'fa-exchange-alt',
        link: '/pages/vehicle-trip',
      },
      {
        title: 'Trips',
        icon: 'fa-exchange-alt',
        link: '/pages/trip',
      },
      {
        title: 'Trip Status FeedBack',
        icon: 'fa-comment-alt',
        link: '/pages/trip-status-feedback',
        home: true,
      },
      {
        title: 'Trip FeedBack Logs',
        icon: 'fa-comments',
        link: '/pages/trip-feedback-logs',
        home: true,
      },
      {
        title: 'Vehicle States',
        icon: 'fa-comment-alt',
        link: '/pages/vehicle-states',
        home: true,
      },
      {
        title: 'Vehicle Status Change',
        icon: 'fa-clipboard-check',
        link: '/pages/vehiclestatuschange',
        home: true,
      },
      {
        title: 'Trip Issues',
        icon: 'fa-clipboard-check',
        link: '/pages/tripissues',
        home: true,
      },
      {
        title: 'Issues Report',
        icon: 'fa-clipboard-check',
        link: '/pages/issues-report',
        home: true,
      },

      {
        title: 'Placement Dashboard',
        icon: 'fa-map-marked-alt',
        link: '/pages/placements-dash-board',
        home: true,
      },
      {
        title: 'Vehicle Distance(24Hr)',
        icon: 'fa-road',
        link: '/pages/vehicle-covered-distance',
        home: true,
      },
      {
        title: 'Vehicle Distance',
        icon: 'fa-road',
        link: '/pages/vehicle-distance',
        home: true,
      },
      {
        title: 'Day Wise Vehicle Distance',
        icon: 'fa-road',
        link: '/pages/daywise-vehicle-distance',
        home: true,
      },
      // {
      //   title: 'Vehicle Trip States',
      //   icon: 'fa-map-marked',
      //   link: '/pages/vehicle-trip-states',
      //   home: true,
      // },
      {
        title: 'Verify Trip States',
        icon: 'fa-check-circle',
        link: '/pages/trip-verify-states',
        home: true,
      },
      {
        title: 'Trends',
        icon: 'fa-line-chart',
        link: '/pages/trends'
      },
      {
        title: 'Route Trip Summary',
        icon: 'fa-line-chart',
        link: '/pages/trip-summary'
      },
      {
        title: 'Route Deviations',
        icon: 'fa-line-chart',
        link: '/pages/route-deviations'
      },
      {
        title: 'Trends Fo',
        icon: 'fa-line-chart',
        link: '/pages/trends-fo'
      },
      {
        title: 'Vehicle OdoMeter',
        icon: 'fa-tachometer-alt',
        link: '/pages/vehicle-odoMeter'
      },


      {
        title: 'Route-Dashboard',
        icon: 'fa-map-marked',
        link: '/pages/route-dashboard'
      },
      {
        title: 'Route-Trip',
        icon: 'fa-route',
        link: '/pages/route-trip'
      },
      {
        title: 'Trip P&L',
        icon: 'fa-pencil-square-o',
        link: '/pages/trip-pnl',
      },
      {
        title: 'TMG Trip',
        icon: 'fa-home',
        link: '/pages/tmg-trip',
      },
    ]
  },
  {
    title: 'Admin',
    icon: 'fa-chess-king',

    home: true,
    children: [
      {
        title: 'TMG Dashboard',
        icon: 'fa-pie',
        link: '/pages/tmg-dashboard',
        home: true,
      },
      {
        title: 'TMG Alerts',
        icon: 'fa-home',
        link: '/pages/tmg-alerts',
        home: true,
      },
      {
        title: 'Tickets',
        icon: 'fa-ticket-alt',
        link: '/pages/tickets',
        home: true,
      },
    
      // {
      //   title: 'Finance Recovery',
      //   icon: 'fa-tachometer-alt',
      //   link: '/pages/finance-recovery'
      // },
      {
        title: 'Tickets All',
        icon: 'fa-ticket-alt',
        link: '/pages/tickets-all',
        home: true,
      },
      {
        title: 'Supervisor View',
        icon: 'fa-ticket-alt',
        link: '/pages/tickets-kpi',
        home: true,
      },
      {
        title: 'Card Mapping',
        icon: 'fa-clone',
        link: '/pages/card-mapping',
        home: true,
      },
      {
        title: 'GPS Details',
        icon: 'fa-map-marker',
        link: '/pages/vehicle-gps-detail',
        home: true,
      },
      {
        title: 'User Activity Statistics',
        icon: 'fa-signal',
        link: '/pages/user-activity-status',
        home: true,
      },
      {
        title: 'Vehicle Distance With Odometer',
        icon: 'fa-chart-pie',
        link: '/pages/vehicle-distance-with-odometer',
        home: true,
      },
      {
        title: 'Manage Party',
        icon: 'fa-building',
        link: '/pages/manage-fo-party',
        home: true,
      },
      {
        title: 'Site',
        icon: 'fa-map-marker-alt',
        link: '/pages/sites',
        home: true,
      },
      {
        title: 'Web Activity Summary',
        icon: 'fa-user',
        link: '/pages/web-acttivity-summary'
      },
      {
        title: 'Fo User Role',
        icon: 'fa-user-cog',
        link: '/pages/fo-user-role',
      },
      {
        title: 'Supervisor User Association',
        icon: 'fa-user-cog',
        link: '/pages/supervisor-user-association',
      },
      {
        title: 'Vehicles',
        icon: 'fa-info-circle',
        link: '/pages/vehicles',
        home: true,
      },
      {
        title: 'Unmerge LR State',
        icon: 'fa-clone',
        link: '/pages/unmerge-lrstate',
        home: true,
      },
      {
        title: 'Vehicle Supplier Association',
        icon: 'fa-building',
        link: '/pages/vehicle-supplier-association',
        home: true,
      },
      {
        title: 'MV GPS API',
        icon: 'fa-clone',
        link: '/pages/mv-gps-apis',
        home: true,
      },
      {
        title: 'MV GPS API History',
        icon: 'fa-clone',
        link: '/pages/mv-gps-api-history',
        home: true,
      },
      {
        title: 'Routes',
        icon: 'fa-pencil-square-o',
        link: '/pages/via-routes',
      },
    ]
  },
  {
    title: 'Receipt & Invoice',
    icon: 'fa-list',
    children: [
      {
        title: 'Freight Rate Input',
        icon: 'fa-calculator',
        link: '/pages/frieght-rate-input',
      },
      // {
      //   title: 'LR-Invoice Columns',
      //   icon: 'fa-file-invoice',
      //   link: '/pages/lr-invoice-columns',
      // },

      {
        title: 'Freight Invoice',
        icon: 'fa-file-invoice-dollar',
        link: '/pages/freight-invoices',
      },

      {
        title: 'Transfer',
        icon: 'fa-dolly-flatbed',
        link: '/pages/transfers',
      },
      {
        title: 'MVS Freight Statement',
        icon: 'fa-dolly-flatbed',
        link: '/pages/mvs-freight-statement',
      },
      {
        title: 'Freight Expenses/Revenue',
        icon: 'fa-search-dollar',
        link: '/pages/freight-expenses',
      },
      {
        title: 'Lorry Receipts',
        icon: 'fa-receipt',
        link: '/pages/lorry-receipts',
      },


      {
        title: 'View LR Manifest',
        icon: 'fa-file',
        link: '/pages/view-manifesto',
      },
      {
        title: 'LR/POD Receipts',
        icon: 'fa-eye',
        link: '/pages/lr-pod-receipts',
      },
      {
        title: 'Fuel/Cash Indent',
        icon: 'fa-gas-pump',
        link: '/pages/fuel-indent',
        home: true,
      },
      {
        title: 'Expenses',
        icon: 'fa-book',
        link: '/pages/expenses',
      },
      {
        title: 'POD Dashboard',
        icon: 'fa-bar-chart',
        link: '/pages/pod-dashboard',
      },
      {
        title: 'Nearby Pods',
        icon: 'fa-bar-chart',
        link: '/pages/nearby-pods',
      },
      {
        title: 'Dispatch orders',
        icon: 'fa-book',
        link: '/pages/dispatch-orders',
      },
    ]
  },
  {
    title: 'Traffic',
    icon: 'fa-traffic-light',
    children: [
      {
        title: 'TMG Traffic',
        icon: 'fa-home',
        link: '/pages/tmg-traffic',
        home: true,
      },
      {
        title: 'TMG Calls',
        icon: 'fa-pie',
        link: '/pages/tmg-calls',
        home: true,
      },
      {
        title: 'Call Suggestion',
        icon: 'fa-traffic-light',
        link: '/pages/driver-call-suggestion',
        home: true,
      },
      {
        title: 'Site In & Out',
        icon: 'fa-truck',
        link: '/pages/site-in-out',
        home: true,
      },
      {
        title: 'Call Logs',
        icon: 'fa-phone',
        link: '/pages/call-logs',
        home: true,
      },
      {
        title: 'User Call Summary',
        icon: 'fa-address-book',
        link: '/pages/user-call-summary',
        home: true,
      },
      {
        title: 'Onward KMPD',
        icon: 'fa-list',
        link: '/pages/onward-kmpd',
        home: true,
      },
      {
        title: 'Vehicle Performance',
        icon: 'fa-truck-pickup',
        link: '/pages/vehicle-performance',
        home: true,
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
        link: '/pages/fuel-fillings',
        home: true,
      },
      
      {
        title: 'Fuel Mileage',
        icon: 'fa-tachometer-alt',
        link: '/pages/fuel-average-analysis',
        home: true,
      },
      {
        title: 'Remaining Fuel',
        icon: 'fa-oil-can',
        link: '/pages/remaining-fuel',
        home: true,
      },

      {
        title: ' Fuel Master',
        icon: 'fa-sliders-h',
        link: '/pages/fuel-master',
        home: true,
      },
      {
        title: 'Consolidate Fuel Average',
        icon: 'fa-signal',
        link: '/pages/consolidate-fuel-average',
        home: true,
      },
      {
        title: 'Fuel Station Entry',
        icon: 'fa-gas-pump',
        link: '/pages/fse-entry',
        home: true,
      },

      {
        title: 'Fuel Mileage With ODO',
        icon: 'fa-gas-pump',
        link: '/pages/fuel-mileage-with-odo',
        home: true
      },
      {
        title: 'Fuel Pump Summary',
        icon: 'fa-gas-pump',
        link: '/pages/fuel-consumption',
        home: true
      },
      {
        title: 'Fuel Daily Consumption',
        icon: 'fa-gas-pump',
        link: '/pages/fuel-daily-consumption',
        home: true

      }

    ]
  },
  {
    title: 'Documents',
    icon: 'fa-database',
    children: [{
      title: 'Document Input',
      icon: 'fa-book',
      link: '/pages/documentation-details',
      home: true,
    },
    {
      title: 'Document Dashboard',
      icon: 'fa-table',
      link: '/pages/documents-summary',
      home: true,
    },
    {
      title: 'Document Summary',
      icon: 'fa-file-text',
      link: '/pages/document-dashboard',
      home: true,
    },
    ]
  },


  {
    title: 'Driver',
    icon: 'fa-user',
    children: [{
      title: 'Driver Performance ',
      icon: 'fa-star',
      link: '/pages/driver-performance',
      home: true,
    },
    {
      title: 'Driver List ',
      icon: 'fa-list',
      link: '/pages/driver-list',
      home: true,
    },

    {

      title: 'Vehicle Driver Mapping',
      icon: 'fa-street-view',
      link: '/pages/vehicle-driver-mapping',
      home: true,
    },
    {

      title: 'Attendance List',
      icon: 'fa-clock-o',
      link: '/pages/driver-attendance',
      home: true,
    },
    {

      title: 'Driver Document',
      icon: 'fa-book',
      link: '/pages/driver-document',
      home: true,
    },

    {
      title: 'Advices',
      icon: 'fa-question',
      link: '/pages/advices',
      home: true,
    },

    ]
  },
  {
    title: 'Finance',
    icon: 'fa-money-bill-alt',
    children: [{
      title: 'Finance Recovery ',
      icon: 'fa-star',
      link: '/pages/finance-recovery',
      home: true,
    },]
  },
  {
    title: 'Tyre',
    icon: 'fa-cog',
    link: '/tyres/tyre-summary'
  },

  {
    title: 'Battery',
    icon: 'fa-car-battery',
    link: '/battery/battery-inventory'
  },
  {
    title: 'Accounts',
    icon: 'fa-coins',
    link: '/accounts/dashboard'
  },
  {
    title: 'Maintenance',
    icon: 'fa-tools',
    link: '/vehicle-maintenance/add-vehicle-maintenance'
  },
  {
    title: 'Ware-House',
    icon: 'fa-landmark',
    link: '/ware-house/ware-house-receipts'
  },
  {
    title: 'Challan',
    icon: 'fa-chalkboard-teacher',
    link: '/challan/pending-challan'
  },
 
  {
    title: 'TMG Challan',
    icon: 'fa-home',
    link: '/pages/tmg-challan',
    home: true,
  },
  {
    title: 'Walle8',
    icon: 'fa-wallet',
    link: '/walle8/card-balance'
  },
  {
    title: 'Bid-System',
    icon: 'fa-chalkboard-teacher',
    link: '/bid-system/dashboard'
  },
  {
    title: 'Load Intelligence',
    icon: 'fa-chalkboard-teacher',
    link: '/load-intelligence/dashboard'
  },

  {
    title: 'Load Intelligence',
    icon: 'fa-chalkboard-teacher',
    link: '/load-intelligence/dashboard'
  },
]);
