import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'nb-home',
    link: '/pages/dashboard',
    home: true,
  },
  {
    title: 'Vehicle KPIs',
    icon: 'nb-tables',
    link: '/pages/vehicle-kpis',
  },
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
  // {
  //   title: 'Concise View',
  //   icon: 'nb-bar-chart',
  //   link: '/pages/concise',
  // },
  {
    title: 'Fuel Average Analysis',
    icon: 'fa fa-truck-moving',
    link: '/pages/fuel-average-analysis',
  },  
  {
    title: 'Vehicle Trip',
    icon: 'fa fa-truck',
    link: '/pages/vehicle-trip',
  }, 
];
