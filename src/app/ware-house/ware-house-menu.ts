import { NbMenuItem } from '@nebular/theme';

export const WAREHOUSE_MENU_ITEMS = JSON.stringify([
    {
        title: 'Home Dashboard',
        icon: 'fa-clipboard-check',
        link: '/pages/dashboard',
        home: true,
    },
    {
        title: 'Ware House Receipts',
        icon: 'fa-receipt',
        link: '/ware-house/ware-house-receipts',
    },
    {
        title: 'Ware House Inventory',
        icon: 'fa-dolly-flatbed',
        link: '/ware-house/warehouse-inventory',
        home: true,
    },
    {
        title: 'State Logs',
        icon: 'fa-clipboard-check',
        link: '/ware-house/state-logs',
        home: true,
    },
    {
        title: 'Manage Stock Exchange',
        icon: 'fa-exchange',
        link: '/ware-house/manage-stock-exchange',
        home: true,
    },


]);



