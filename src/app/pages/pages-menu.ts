import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
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
  {
    title: 'Fuel Average Analysis',
    icon: 'fa fa-signal',
    link: '/pages/fuel-average-analysis',
  },
  {
    title: 'Vehicle Trip',
    icon: 'fa fa-truck',
    link: '/pages/vehicle-trip',
  },
  {
    title: 'Tyre',
    icon: 'fa fa-cog',
    link: '/tyres/inventory'
  },
  {
    title: 'Documentation',
    icon: 'fa fa-database',
    link: '/documents/documents-summary'
  },
  {
    title: 'Account',
    icon: 'fa fa-money',
    link: '/accounts/dashboard'
  },
  {
    title: 'Trends',
    icon: 'fa fa-line-chart',
    link: '/pages/trends'
  },
  {
    title: 'Placements DashBoard',
    icon: 'fas fa-map-marked-alt',
    link: '/pages/placements-dash-board',
    home: true,
  },
  {
    title: 'User Activity Statistics',
    icon: 'fas fa-chart-pie',
    link: '/pages/user-activity-status',
    home: true,
  },
  {
    title: 'Trip Status FeedBack',
    icon: 'fas fa-comment-alt',
    link: '/pages/trip-status-feedback',
    home: true,
  },
  {
    title: 'Vehicle Distance Covered',
    icon: 'fas fa-road',
    link: '/pages/vehicle-covered-distance',
    home: true,
  }, {
    title: 'Trip FeedBack logs',
    icon: 'fas fa-comments',
    link: '/pages/tip-feedback-logs',
    home: true,
  },
  // {
  //   title: 'Trip Onward Delay',
  //   icon: 'fas fa-truck',
  //   link: '/pages/trip-onward-delay',
  //   home: true,
  // },
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
        icon: 'fas fa-list',
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
  // {
  //   title: 'Placement Delay Faults',
  //   icon: 'fas fa-list',
  //   link: '/pages/placement-delay-faults',
  //   home: true,
  // },
  {
    title: 'Vehicle Gps Detail',
    icon: 'fa fa-map-marker',
    link: '/pages/vehicle-gps-detail',
    home: true,
  },
  // {
  //   title: 'Short Target',
  //   icon: 'fas fa-sort-amount-up',
  //   link: '/pages/short-target',
  //   home: true,
  // },
];
