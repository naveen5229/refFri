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
        link: '/pages/trip-feedback-logs',
        home: true,
      },
      {
        title: 'Placements DashBoard',
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
        icon: 'fas fa-receipt',
        link: '/pages/generate-lr',
      },
      {
        title: 'Generate LTL',
        icon: 'fas fa-receipt',
        link: '/pages/generate-lr-no-vehicles',
      },
      {
        title: 'Generate LR Manifest',
        icon: 'fas fa-receipt',
        link: '/pages/generate-lr-mainfesto',
      },
      {
        title: 'View LR Manifest',
        icon: 'fa fa-eye',
        link: '/pages/view-manifesto',
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
        icon: 'fas fa-history',
        link: '/pages/remaining-fuel',
        home: true,
      },
      {
        title: 'Consolidate Fuel Average',
        icon: 'fa fa-signal',
        link: '/pages/consolidate-fuel-average',
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
    title: 'Driver',
    icon: 'fa fa-user',
    children: [{
      title: 'driver Performance ',
      icon: 'fa fa-chart-bar',
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
      icon: 'fa fa-map-marker',
      link: '/pages/vehicle-driver-mapping',
      home: true,
    },
    {

      title: 'Attendace List',
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

      title: 'Licence Upload',
      icon: 'fas fa-address-card',
      link: '/pages/licence-upload',
      home: true,
    },
    {

      title: 'Pending Licence',
      icon: 'fas fa-align-justify',
      link: '/pages/pending-licence',
      home: true,
    }
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


];
