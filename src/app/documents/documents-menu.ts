import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Vehicle Documents Summary',
        icon: 'nb-home',
        link: '/documents/dashboard',
        home: true,
    },
    {
        title: ' Vehicle Document History',
        icon: 'fa fa-database',
        link: '/documents/crm-vehicle-documentions',
        home: true,
    },
    {
        title: 'Vehicle Documents Input ',
        icon: 'fa fa-book',
        link: '/documents/documentation-details',
        home: true,
    },
    {
        title: 'Smart Table',
        icon: ' fa fa-table',
        link: '/documents/smart-table',
        home: true,
    }
];
