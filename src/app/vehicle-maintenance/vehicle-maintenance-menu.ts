import { NbMenuItem } from '@nebular/theme';

export const MAINTENANCE_MENU_ITEMS = JSON.stringify([
    {
        title: 'Home Dashboard',
        icon: 'fa fa-home',
        link: '/pages/dashboard',
        home: true,
    },
    {
        title: 'Add Maintenance',
        icon: 'fas fa-wrench',
        link: '/vehicle-maintenance/add-vehicle-maintenance',
        home: true,
    },
    // {
    //     title: 'Maintenance Dashboard',
    //     icon: 'fa fa-home',
    //     link: '/vehicle-maintenance/maintenanace-dashboard',
    //     home: true,
    // },
    {
        title: 'Maintenance Summary',
        icon: 'fas fa-cogs',
        link: '/vehicle-maintenance/maintenance-summary',
        home: true,
    },

]);

// export const CUSTOMER_MENU_ITEMS: NbMenuItem[] = [

//     {
//         title: 'Home Dashboard',
//         icon: 'fa fa-home',
//         link: '/vehicle-maintenance/dashboard',
//         home: true,
//     },


// ];

