import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'nb-home',
        link: '/admin/dashboard',
        home: true,
    },
    {
        title: 'Vehicle Status Change',
        icon: 'nb-home',
        link: '/admin/vehiclestatuschange',
        home: true,
    },
    {
        title: 'VSC Ticket Audit',
        icon: 'nb-home',
        link: '/admin/vscticketaudit',
        home: true,
    },
    {
        title: 'Issue Alerts',
        icon: 'nb-home',
        link: '/admin/issue-alerts',
        home: true,
    },
    {
        title: 'Escalation Matrix',
        icon: 'nb-home',
        link: '/admin/escalation-matrix',
        home: true,
    },
    {
        title: 'Alert Related Issue',
        icon: 'far fa-bell',
        link: '/admin/alert-related-issue',
        home: true,
    },
    {
        title: 'Driver',
        icon: 'nb-home',
        link: '/admin/driver-list',
        home: true,
    },
    {
        title: 'Generate LR',
        icon: 'nb-home',
        link: '/admin/generate-lr',
        home: true,
    },
    {
        title: 'Group Managements',
        icon: 'nb-home',
        link: '/admin/group-managements',
        home: true,
    },

    {
        title: 'Ticket Properties',
        icon: 'nb-home',
        link: '/admin/ticket-properties',
        home: true,
    },
    {
        title: 'Lorry Receipt Details',
        icon: 'nb-home',
        link: '/admin/lorry-receipt-details',
        home: true,
    },
    {
        title: 'Site Fencing',
        icon: 'nb-home',
        link: '/admin/site-fencing',
    },
    {
        title: 'Diagnostics',
        icon: 'nb-home',
        link: '/admin/diagnostics',
        home: true,
    },
    {
        title: 'Document',
        icon: 'nb-home',
        children: [
            {
                title: 'Pending Details',
                icon: 'fa fa-pencil-square-o',
                link: '/admin/pending-documents',
                home: true,
            },

        ]
    },

    {
        title: 'User Prefrence',
        icon: 'nb-home',
        link: '/admin/user-preferences',
        home: true,
    },
    {
        title: 'Site Details',
        icon: 'nb-home',
        link: '/admin/site-details',
        home: true,
    },
    {
        title: 'Gps Supplier Mapping',
        icon: 'nb-home',
        link: '/admin/gps-supplier-mapping',
        home: true,
    },
    {
        title: 'Vechile Distance',
        icon: 'fas fa-route',
        link: '/admin/vehicle-distance',
        home: true,
    },
 
    {
        title: 'Vehicles View',
        icon: 'nb-home',
        link: '/admin/vehicles-view',
        home: true,
    },
    {
        title: 'Companies',
        icon: 'nb-home',
        link: '/admin/company-details',
        home: true,
    },
    {
        title: 'Transport Agents',
        icon: 'nb-home',
        link: '/admin/transport-agents',
        home: true,
    },
    {
        title: 'Sub Sites',
        icon: 'nb-home',
        link: '/admin/sub-sites',
        home: true,
    },
  
];
