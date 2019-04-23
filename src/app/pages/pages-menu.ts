import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  // {
  //   title: 'Vehicle KPIs',
  //   icon: 'nb-tables',
  //   link: '/pages/vehicle-kpis',
  // },
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
    link:'/pages/trends'
  },
  {
    title: 'Placements DashBoard',
    icon: 'fas fa-list',
    link: '/pages/placements-dash-board',
    home: true,
  },
  {
    title: 'User Activity Statistics',
    icon: 'fas fa-list',
    link: '/pages/user-activity-status',
    home: true,
  },
  {
    title: 'Trip Status FeedBack',
    icon: 'fas fa-list',
    link: '/pages/trip-status-feedback',
    home: true,
  },
  // {
  //   title: 'Placements',
  //   icon: 'fa fa-location-arrow',
  //   link:'/pages/placements'
  // },
  //{
  //  title: 'Call Logs',
  //  icon: 'fa fa-phone',
  //  link:'/pages/call-logs'
  //},
  // {
  //   title: 'Route Mapper',
  //   icon: 'fal fa-map-pin',
  //   link:'/pages/route-mapper'
  // }
  // {
  //   title: 'Driver',
  //   icon: 'fa fa-money',
  //   link:'/driver/dashboard',
  //   home: true,
  // },
  {
    title: 'Traffic',
    icon: 'fas fa-traffic-light',
    children : [
      {
        title: 'Driver Call Suggestion',
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
      }
    ]
  },
  {
    title: 'Placement Delay Faults',
    icon: 'fas fa-list',
    link: '/pages/placement-delay-faults',
    home: true,
  },
  {
    title: 'Vehicle Gps Detail',
    icon: 'fas fa-list',
    link: '/pages/vehicle-gps-detail',
    home: true,
  },
];
