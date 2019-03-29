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
  },
  {
    title: 'Tickets All',
    icon: 'nb-title',
    link: '/pages/tickets-all',
  },
  {
    title: 'Lorry Receipts',
    icon: 'nb-list',
    link: '/pages/lorry-receipts',
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
    link:'/tyres/inventory'
  },
  {
    title: 'Documentation',
    icon: 'fa fa-database',
    link:'/documents/documents-summary'
  },
  {
    title: 'Account',
    icon: 'fa fa-money',
    link:'/accounts/dashboard'
  },
  {
    title: 'Vehicle Report',
    icon: 'fa fa-cog',
    link:'/pages/vehicle-report'
  }
];
