import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Home Dashboard',
        icon: 'fa fa-home',
        link: '/pages/dashboard',
        home: true,
    },
    {
        title: 'Inventory',
        icon: 'fa fa-recycle',
        link: '/battery/battery-inventory',
        home: true,
    },
    // {
    //     title: 'Battery Models',
    //     icon: 'fa fa-text-width',
    //     link: '/battery/battery-modals',
    //     home: true,
    // },
    {
        title: 'Vehicle Battery',
        icon: 'fa fa-text-width',
        link: '/battery/vehicle-battery',
        home: true,
    },
    {
        title: 'Battery Summary',
        icon: 'fa fa-file-text',
        link: '/battery/battery-summary',
        home: true,
    },

];
