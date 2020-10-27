import { NbMenuItem } from '@nebular/theme';

export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Home Dashboard',
        icon: 'fa-home',
        link: '/pages/dashboard',
        home: true,
    },
    {
        title: 'Documents Input ',
        icon: 'fa-book',
        link: '/documents/documentation-details',
        home: true,
    },
    {
        title: 'Pending Details',
        icon: 'fa-pencil-square-o',
        link: '/documents/pending-documents',
        home: true,
    },

    {
        title: 'Customer Dashboard',
        icon: 'fa-user',
        children: [
            {
                title: 'Document Dashboard',
                icon: 'fa-table',
                link: '/documents/documents-summary',
                home: true,
            },
            {
                title: 'Document Summary',
                icon: 'fa-file-text',
                link: '/documents/dashboard',
                home: true,
            },

        ]
    },


];

export const CUSTOMER_MENU_ITEMS: NbMenuItem[] = [

    {
        title: 'Home Dashboard',
        icon: 'fa-home',
        link: '/pages/dashboard',
        home: true,
    },
    {

        title: 'Customer Dashboard',
        icon: 'nb-home',
        children: [
            {
                title: 'Document Dashboard',
                icon: 'fa-table',
                link: '/documents/documents-summary',
            },
            {
                title: 'Document Summary',
                icon: 'fa-file-text',
                link: '/documents/dashboard',
            },
            {
                title: ' Vehicle Document History',
                icon: 'fa-truck',
                link: '/documents/documentation-details',
            }

        ]
    },


];

