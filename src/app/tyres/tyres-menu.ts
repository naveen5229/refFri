import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'nb-home',
        link: '/tyres/dashboard',
        home: true,
    },
    {
        title: 'Inventory',
        icon: 'fa fa-text-width',
        link: '/tyres/inventory',
        home: true,
    },
    {
        title: 'Inputs',
        icon: 'fa fa-angle-double-left',
        link: '/tyres/inputs',
        home: true,
    },
    {
        title: 'Health Checkup',
        icon: 'fa fa-check-circle',
        link: '/tyres/tyre-health-check-up',
        home: true,
    },
    {
        title: 'Add Trolly',
        icon: 'fa fa-truck',
        link: '/tyres/add-trolly',
        home: true,
    },
    {
        title: 'Vehicle Trolly Mapping',
        icon: 'fa fa-map-signs',
        link: '/tyres/vehicle-trolly-mapping',
        home: true,
    },
];
