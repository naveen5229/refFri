import { NbMenuItem } from '@nebular/theme';

export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Home Dashboard',
        icon: 'fa-home',
        link: '/pages/dashboard',
        home: true,
    },
    {
        title: 'Driver List ',
        icon: 'fa-list',
        link: '/driver/driver-list',
        home: true,
    },{

        title: 'Driver On Side Images',
        icon: 'fa-map-marker',
        link: '/driver/driver-on-side-images',
        home: true,
    },
    {

        title: 'Vehicle Driver Mapping',
        icon: 'fa-map-marker',
        link: '/driver/vehicle-driver-mapping',
        home: true,
    },
    {

        title: 'Attendace List',
        icon: 'fa-clock-o',
        link: '/driver/driver-attendance',
        home: true,
    },
    {

        title: 'Driver Document',
        icon: 'fa-book',
        link: '/driver/driver-document',
        home: true,
    },
    {

        title: 'Licence Upload',
        icon: 'fa-address-card',
        link: '/driver/licence-upload',
        home: true,
    },
    {

        title: 'Pending Licence',
        icon: 'fa-align-justify',
        link: '/driver/pending-licence',
        home: true,
    }
];

export const CUSTOMER_MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Home',
        icon: 'nb-home',
        link: '/driver',
        home: true,
    },
    {
        title: 'Add Driver',
        icon: 'nb-home',
        link: '/driver/add-driver',
        home: true,
    },
    {
        title: 'Driver List',
        icon: 'nb-home',
        link: '/driver/driver-list',
        home: true,
    },
    {

        title: 'vehicle-driver-mapping',
        icon: 'nb-home',
        link: '/driver/vehicle-driver-mapping',
        home: true,
    },
    {

        title: 'driver-attendance',
        icon: 'nb-home',
        link: '/driver/driver-attendance',
        home: true,
    },


];

