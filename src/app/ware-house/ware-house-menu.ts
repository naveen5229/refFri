import { NbMenuItem } from '@nebular/theme';

export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Home Dashboard',
        icon: 'fas fa-clipboard-check',
        link: '/pages/dashboard',
        home: true,
    },
    {
        title: 'Ware House Receipts',
        icon: 'fas fa-receipt',
        link: '/ware-house/ware-house-receipts',
    },
    {
        title: 'Ware House Inventory',
        icon: 'fas fa-dolly-flatbed',
        link: '/ware-house/warehouse-inventory',
        home: true,
    },
    {
        title: 'State Logs',
        icon: 'fas fa-clipboard-check',
        link: '/ware-house/state-logs',
        home: true,
    },
    {
        title: 'Manage Stock Exchange',
        icon: 'far fa-exchange',
        link: '/ware-house/manage-stock-exchange',
        home: true,
    },


];



