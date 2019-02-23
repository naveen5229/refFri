import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
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
                icon: 'fa fa-list-ul',
                link: '/documents/dashboard',
                home: true,
            },
            {
                title: 'Vehicle Document',
                icon: 'fa fa-truck',
                link: '/documents/crm-vehicle-documentions',
                home: true,
            }

        ]
    },

	{
		title: 'Pending Details',
		icon: 'fa fa-list',
		link: '/documents/pending-documents',
		home: true,
	}
];

