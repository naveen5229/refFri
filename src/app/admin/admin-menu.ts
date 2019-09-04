import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'fa fa-home',
        link: '/pages',
    },

    {
        title: 'Vehicle Status Change',
        icon: 'fas fa-clipboard-check',
        link: '/admin/vehiclestatuschange',
    },
    {
        title: 'VSC Ticket Audit',
        icon: 'fas fa-ticket-alt',
        link: '/admin/vscticketaudit',
    },
    {
        title: 'Issue Alerts',
        icon: 'fa fa-exclamation-triangle',
        link: '/admin/issue-alerts',
    },
    {
        title: 'Escalation Matrix',
        icon: 'fa fa-chart-bar',
        link: '/admin/escalation-matrix',
    },
    {
        title: 'vehicle view',
        icon: 'fa fa-chart-bar',
        link: '/admin/vehicles-view',
    },
    {
        title: 'Alert Related Issue',
        icon: 'far fa-bell',
        link: '/admin/alert-related-issue',
        home: true,
    },
    {
        title: 'Driver',
        icon: 'fa fa-male',
        link: '/admin/driver-list',
        home: true,
    },
    {
        title: 'Generate LR',
        icon: 'fa fa-pencil',
        link: '/admin/generate-lr',
    },
    {
        title: 'Group Managements',
        icon: 'fa fa-users',
        link: '/admin/group-managements',
    },

    {
        title: 'Ticket Properties',
        icon: 'fas fa-ticket-alt',
        link: '/admin/ticket-properties',
    },
    {
        title: 'Lorry Receipt Details',
        icon: 'fas fa-receipt',
        link: '/admin/lorry-receipt-details',
    },
    {
        title: 'Site Fencing',
        icon: 'fas fa-coins',
        link: '/admin/site-fencing',
    },
    {
        title: 'Transport Area Fencing',
        icon: 'fas fa-coins',
        link: '/admin/transport-area',
    },
    {
        title: 'Diagnostics',
        icon: 'fa fa-stethoscope',
        link: '/admin/diagnostics',
    },
    {
        title: 'Document',
        icon: 'fa fa-file-alt',
        children: [
            {
                title: 'Pending Details',
                icon: 'fa fa-pencil-square-o',
                link: '/admin/pending-documents',
            },

        ]
    },
    {
        title: 'Account',
        icon: 'fa fa-money',
        link: '/accounts/dashboard'
    },

    {
        title: 'User Prefrence',
        icon: 'fas fa-user-cog',
        link: '/admin/user-preferences',
    },
    {
        title: 'Site Details',
        icon: 'fa fa-sitemap',
        link: '/admin/site-details',
        home: true,
    },
    {
        title: 'Vehicle Gps Trail',
        icon: 'fas fa-receipt',
        link: '/admin/vehicle-gps-trail',
        home: true,
    },
    {
        title: 'Vechile Distance',
        icon: 'fas fa-route',
        link: '/admin/vehicle-distance',
        home: true,
    },
    {
        title: 'Trip Site Rule',
        icon: 'fas fa-file-signature',
        link: '/admin/trip-site-rule',
        home: true,
    },
    {
        title: 'Trip Diagnosis',
        icon: 'fas fa-file-signature',
        link: '/admin/trip-analysis',
        home: true,
    },
    {
        title: 'VSC Diagnosis',
        icon: 'fas fa-receipt',
        link: '/admin/vsc-diagnosis',
        home: true,
    },
    {
        title: 'Fuel',
        icon: 'fas fa-gas-pump',
        children: [
            {
                title: 'Fuel Fillings',
                icon: 'fas fa-gas-pump',
                link: '/admin/fuel-fillings',
                home: true,
            },
            {
                title: 'Fuel Average Analysis',
                icon: 'fa fa-signal',
                link: '/admin/fuel-average-analysis',
                home: true,
            },
            {
                title: 'Fuel Rules',
                icon: 'fa fa-signal',
                link: '/admin/fuel-rules',
                home: true,
            },
            {
                title: 'Fuel Average Issues',
                icon: 'fa fa-signal',
                link: '/admin/fuel-average-issues',
                home: true,
            },
            // {
            //     title: 'Model Fuel Milage',
            //     icon: 'fa fa-signal',
            //     link: '/admin/fo-fuel-average',
            //     home: true,
            // },
            {
                title: 'Consolidate Fuel Average',
                icon: 'fa fa-signal',
                link: '/admin/consolidate-fuel-average',
                home: true,
            },
            {
                title: 'Fuel Diagnosis',
                icon: 'fa fa-signal',
                link: '/admin/fuel-analysis',
                home: true,
            },
            {
                title: 'Pump Station Area',
                icon: 'fa fa-signal',
                link: '/admin/pump-station-area',
                home: true,
            },
         
            {
                title: 'Fo Fs Mapping',
                icon: 'fa fa-signal',
                link: '/admin/fo-fs-mapping',
                home: true,
            },
        ]
    },
    {
        title: 'gps-supplier-mapping',
        icon: 'nb-home',
        link: '/admin/gps-supplier-mapping',
        home: true,
    },
    {
        title: 'vehicles-view',
        icon: 'nb-home',
        link: '/admin/vehicles-view',
        home: true,
    },
    {
        title: 'Company Details',
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
    {
        title: 'Activity Summary',
        icon: 'nb-home',
        link: '/admin/activity-summary',
        home: true,
    },
    {
        title: 'Vehicle Gps Detail',
        icon: 'nb-home',
        link: '/admin/vehicle-gps-detail',
    },



    {
        title: 'Trip Feedback Logs',
        icon: 'nb-home',
        link: '/admin/trip-status-feedback-logs',
        home: true,
    },
    {
        title: 'Fuel Average Analysis',
        icon: 'fa fa-signal',
        link: '/admin/fuel-average-analysis',
        home: true,
    },
    {
        title: 'Remaining Fuel',
        icon: 'fa fa-signal',
        link: '/admin/remaining-fuel',
        home: true,
    },
    {
        title: 'Ticket Subscribe',
        icon: 'fa fa-signal',
        link: '/admin/ticket-subscribe',
        home: true,
    },
    {
        title: 'Add Customer',
        icon: 'fa fa-signal',
        link: '/admin/add-customer',
        home: true,
    },
    {
        title: 'Toll Transaction summary',
        icon: 'fa fa-road',
        link: '/admin/toll-transaction-summary',
        home: true,
    },
    {
        title: 'Manual Toll Transaction Summary',
        icon: 'fa fa-user',
        link: '/admin/manual-toll-transaction-summary',
        home: true,
    },
    {
        title: 'Vehicle Wise Toll Transaction Summary',
        icon: 'fa fa-car',
        link: '/admin/vehiclewise-tolltransaction',
        home: true,
    },
    {
        title: 'LR Diagnostics',
        icon: 'fa fa-diagnostics',
        link: '/admin/lr-diagnostics',
        home: true,
    },
    {
        title: 'POD Dashboard',
        icon: 'fa fa-bar-chart',
        link: '/admin/pod-dashboard',
        home: true,
    },
    {
        title: 'Nearby Pods',
        icon: 'fa fa-bar-chart',
        link: '/admin/nearby-pods',
        home: true,
    },
    {
        title: 'locations',
        icon: 'fa fa-map',
        link: '/admin/locations',
        home: true,
    },
    {
        title: 'web activity summary',
        icon: 'far fa-list-all',
        link: '/admin/web-activity-summary',
        home: true,
    },
    {
        title: 'Vouchers Summary',
        icon: 'far fa-list-all',
        link: '/admin/vouchers-summary',
        home: true,
    },

];
