import { NbMenuItem } from '@nebular/theme';

export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'fa-book',
        link: '/lorry-receipt/dashboard',
        home: true,
    },
    {
        title: 'Generate LR',
        icon: 'nb-home',
        link: '/lorry-receipt/generate-lr',
        home: true,
    },
    {
        title: 'View LR',
        icon: 'nb-home',
        link: '/lorry-receipt/lrview',
        home: true,
    },
];

export const CUSTOMER_MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'nb-home',
        home: true,
    }
];


