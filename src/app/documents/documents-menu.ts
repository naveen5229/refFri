import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Vehicle Documents Input ',
        icon: 'fa fa-book',
        link: '/documents/documentation-details',
        home: true,
    },
    {
        title: 'Customer Dashboard',
        icon: 'nb-home',
        children: [
            {
                title: 'Document Dashboard',
                icon: 'fa fa-table',
                link: '/documents/documents-summary',
                home: true,
            },
            {
                title: 'Document Summary',
                icon: 'fa fa-list-ul',
                link: '/documents/dashboard',
                home: true,
            },
            {
                title: ' Document History',
                icon: 'fa fa-database',
                link: '/documents/crm-vehicle-documentions',
                home: true,
            },

        ]
    },


];
