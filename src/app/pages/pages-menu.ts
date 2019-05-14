import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Trip',
    icon: 'fas fa-route',
    link: '/pages/dashboard',
    home: true,
    children: [
      {
        title: 'Dashboard - Trips',
        icon: 'nb-home',
        link: '/pages/dashboard',
        home: true,
      },
      {
        title: 'Vehicle Trip',
        icon: 'fa fa-truck',
        link: '/pages/vehicle-trip',
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
        link: '/pages/tip-feedback-logs',
        home: true,
      },
      {
        title: 'Placements DashBoard',
        icon: 'fas fa-map-marked-alt',
        link: '/pages/placements-dash-board',
        home: true,
      },
      {
        title: 'Vehicle Distance Covered',
        icon: 'fas fa-road',
        link: '/pages/vehicle-covered-distance',
        home: true,
      },
      {
        title: 'Vehicle Trip Stages',
        icon: 'fas fa-road',
        link: '/pages/vehicle-trip-stages',
        home: true,
      },
      {
        title: 'Trends',
        icon: 'fa fa-line-chart',
        link: '/pages/trends'
      },

    ]
  },
  {
    title: 'Admin',
    icon: 'fa fa-user',

    home: true,
    children: [
      {
        title: 'Tickets',
        icon: 'nb-notifications',
        link: '/pages/tickets',
        home: true,
      },
      {
        title: 'Tickets All',
        icon: 'nb-title',
        link: '/pages/tickets-all',
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
        icon: 'fas fa-chart-pie',
        link: '/pages/user-activity-status',
        home: true,
      },
    ]
  },
  {
    title: 'Receipt & Invoice',
    icon: 'nb-list',
    children: [
      {
        title: 'Lorry Receipts',
        icon: 'nb-list',
        link: '/pages/lorry-receipts',
      },

      {
        title: 'Generate LR',
        icon: 'fa fa-pencil',
        link: '/pages/generate-lr',
      },
      {
        title: 'Expenses',
        icon: 'fa fa-book',
        link: '/pages/expenses',
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
        icon: 'fa fa-signal',
        link: '/pages/fuel-average-analysis',
        home: true,
      },
      {
        title: 'Remaining Fuel',
        icon: 'fa fa-signal',
        link: '/pages/remaining-fuel',
        home: true,
      },
    ]
  },
  {
    title: 'Documents',
    icon: 'fa fa-database',
    children: [{
      title: 'Documents Input ',
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
    title: 'Tyre',
    icon: 'fa fa-cog',
    link: '/tyres/inventory'
  },


  {
    title: 'Accounts',
    icon: 'fa fa-money',
    link: '/accounts/dashboard'
  },
  {
    title: 'Maintenance',
    icon: 'fas fa-tools',
    link: '/vehicle-maintenance/add-vehicle-maintenance'
  },
  {
    title: 'Driver',
    icon: 'fa fa-user',
    children: [{
      title: 'driver Performance ',
      icon: 'fa fa-book',
      link: '/pages/driver-performance',
      home: true,
    }]
  },

  // {
  //   title: 'Placement Delay Faults',
  //   icon: 'fas fa-list',
  //   link: '/pages/placement-delay-faults',
  //   home: true,
  // },

  // {
  //   title: 'Short Target',
  //   icon: 'fas fa-sort-amount-up',
  //   link: '/pages/short-target',
  //   home: true,
  // },

];
