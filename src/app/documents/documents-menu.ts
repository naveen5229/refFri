import { NbMenuItem } from '@nebular/theme';

export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Home Dashboard',
        icon: 'fa fa-home',
        link: '/pages/dashboard',
        home: true,
    },
    {
        title: 'Documents Input ',
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
                icon: 'fa fa-file-text',
                link: '/documents/dashboard',
                home: true,
            },
            // {
            //     title: 'Vehicle Document History',
            //     icon: 'fa fa-truck',
            //     link: '/documents/documentation-details',
            //     home: true,
            // }

        ]
    },

    {
        title: 'Pending Details',
        icon: 'fa fa-pencil-square-o',
        link: '/documents/pending-documents',
        home: true,
    }
];

export const CUSTOMER_MENU_ITEMS: NbMenuItem[] = [

    {
        title: 'Home Dashboard',
        icon: 'fa fa-home',
        link: '/pages/dashboard',
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
            },
            {
                title: 'Document Summary',
                icon: 'fa fa-file-text',
                link: '/documents/dashboard',
            },
            {
                title: ' Vehicle Document History',
                icon: 'fa fa-truck',
                link: '/documents/documentation-details',
            }

        ]
    },


];

