import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'nb-home',
        link: '/accounts/dashboard',
        home: true,
    },
    {
        title: 'Orders',
        icon: 'nb-home',
        link: '/accounts/orders'
    },
    {
        title: 'Stock Types',
        icon: 'nb-home',
        link: '/accounts/stock-types'
    },
    {
        title: 'Stock Sub Types',
        icon: 'nb-home',
        link: '/accounts/stock-subtypes'
    }
    ,
    {
        title: 'Stock Item',
        icon: 'nb-home',
        link: '/accounts/stockitem'
    },
    {
        title: 'Account',
        icon: 'nb-home',
        link: '/accounts/account'
    },
    {
        title: 'Ledger',
        icon: 'nb-home',
        link: '/accounts/ledgers'
    }
];
