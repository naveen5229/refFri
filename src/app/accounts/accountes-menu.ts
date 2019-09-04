import { NbMenuItem } from '@nebular/theme';
import { VoucherComponent } from '../acounts-modals/voucher/voucher.component';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Home Dashboard',
        icon: 'fa fa-home',
        link: '/pages/dashboard',
        home: true,
    },
    // {
    //     title: 'Invoice',
    //     icon: 'fas fa-file-invoice',
    //     link: '/accounts/orders'
    // },
    {
        title: 'Accounts Master',
        icon: 'fas fa-user-circle',

        children: [

            {
                title: 'Account Group',
                link: '/accounts/account'
            },

            {
                title: 'Cost Category',
                link: '/accounts/costcenter'
            },
            {
                title: 'Ledger',
                link: '/accounts/ledgers/0'
            },
            {
                title: 'City',
                link: '/accounts/city'
            },
            {
                title: 'Cost Category-Ledger',
                link: '/accounts/ledgers/2'
            },
            {
                title: 'Company-Branches',
                link: '/accounts/company-branches'
            },
            {
                title: 'Vehicle Cost Center List',
                link: '/accounts/vehicle-cost-center-list'
            },
            {
                title: 'Vehicle Ledger',
                link: '/accounts/vehicle-ledgers'
            },

        ],
    },



    {
        title: 'Stock Master',
        icon: 'fas fa-building',

        children: [

            {
                title: 'Stock Type',
                link: '/accounts/stock-types'
            },

            {
                title: 'Stock Sub Type',
                link: '/accounts/stock-subtypes'
            },
            {
                title: 'Stock Item',
                link: '/accounts/stockitem'
            },
            {
                title: 'Ware House',
                link: '/accounts/ware-house'
            },

        ],
    },
    {
        title: 'Voucher',
        icon: 'fas fa-ticket-alt',
        children: [
            {
                title: 'Journal Voucher (F9)',
                link: '/accounts/vouchers/-7/Journal Voucher'
            },
            {
                title: 'Cash Receipt Voucher (F8)',
                link: '/accounts/vouchers/-4/Cash Receipt Voucher'
            },
            {
                title: 'Bank Receipt Voucher (F7)',
                link: '/accounts/vouchers/-2/Bank Receipt Voucher'
            },
            {
                title: 'Cash Payment Voucher (F6)',
                link: '/accounts/vouchers/-3/Cash Payment Voucher'
            },
            {
                title: 'Bank Payment Voucher (F5)',
                link: '/accounts/vouchers/-1/Bank Payment Voucher'
            },
            {
                title: 'Contra Voucher (F4)',
                link: '/accounts/vouchers/-8/Contra Voucher'
            },
        ],
    },
    {
        title: 'Account Reports',
        icon: 'fa fa-file-excel',
        children: [
            {
                title: 'Day Book',
                link: '/accounts/daybooks/0'
            },
            {
                title: 'Voucher Pending For Approval',
                link: '/accounts/daybookpending'
            },
            {
                title: 'Bank Book',
                link: '/accounts/bank-books'
            },
            {
                title: 'Cash Book',
                link: '/accounts/cashbook'
            },
            
            {
                title: 'Ledger View',
                link: '/accounts/ledgerview'
            },
            {
                title: 'Cost Category',
                link: '/accounts/cost-center-report'
            },
            {
                title: 'Trading Account',
                link: '/accounts/trading'
            },
            {
                title: 'Profit & Loass A/C',
                link: '/accounts/profitloss'
            },
            {
                title: 'Balance Sheet',
                link: '/accounts/balancesheet'
            },
            {
                title: 'Trial Balance',
                link: '/accounts/trialbalance'
            },
            {
                title: 'Ledger Mapping',
                link: '/accounts/ledgermapping'
            },
            {
                title: 'OutStanding',
                link: '/accounts/outstanding'
            },
            {
                title: 'Mapped Fuel Voucher',
                link: '/accounts/mapped-fuel-voucher'
            }

        ],
    },
    {
        title: 'Admin Report',
        icon: 'fas fa-file-invoice',
        children: [

    {
        title: 'Trip Expense Tally',
        link: '/accounts/trip-expense-tally'
    },
    {
        title: 'Account Statics',
        link: '/accounts/statics'
    },
    {
        title: 'GST Reports',
        link: '/accounts/gstreport'
    },
    {
        title:'Tally Export',
        link:'/accounts/tallyexport'
    },
    {
        title: 'Voucher Audit',
        link: '/accounts/voucheredited'
    },
    {
        title: 'Ledger Approve',
        link: '/accounts/ledgerapprove'
    }
],
},
    {
        title: 'Invoice',
        icon: 'fas fa-file-invoice',
        children: [
            {
                title: 'Purchase Invoice',
                link: '/accounts/orders/-102/Purchase Invoice'
            },
            {
                title: 'Sales Invoice',
                link: '/accounts/orders/-104/Sales Invoice'
            },
            {
                title: 'Purchase Assets Invoice',
                link: '/accounts/orders/-105/Purchase Assets Invoice'
            },
            {
                title: 'Debit Note',
                link: '/accounts/orders/-107/Debit Note'
            },
            {
                title: 'Credit Note',
                link: '/accounts/orders/-106/Credit Note'
            },
            {
                title: 'Wastage',
                link: '/accounts/orders/-108/Wastage'
            },
        ],
    },
    {
        title: 'Inventry  Reports',
        icon: 'fa fa-file-excel',
        children: [

            {
                title: 'Invoice Register',
                link: '/accounts/invoiceregister'
            },

            {
                title: 'Stock Available',
                link: '/accounts/stockavailable'
            },
            {
                title: 'Opening Stock',
                link: '/accounts/openingstock'
            },

        ],
    },

    // {
    //     title: 'Stock Types',
    //     icon: 'fas fa-weight-hanging',
    //     link: '/accounts/stock-types'
    // },
    // {
    //     title: 'Stock Sub Types',
    //     icon: 'fas fa-weight-hanging',
    //     link: '/accounts/stock-subtypes'
    // }
    // ,
    // {
    //     title: 'Stock Item',
    //     icon: 'fa fa-list',
    //     link: '/accounts/stockitem'
    // },



    // {
    //     title: 'Account Group',
    //     icon: 'fa fa-university',
    //     link: '/accounts/account'
    // },
    // {
    //     title: 'Cost Category',
    //     icon: 'fa fa-university',
    //     link: '/accounts/costcenter'
    // },
    // {
    //     title: 'Ledger',
    //     icon: 'fas fa-file-invoice-dollar',
    //     link: '/accounts/ledgers/0'
    // },







    {
        title: 'Store Requisition',
        icon: 'fas fa-building',

        children: [

            {
                title: 'Store Request',
                link: '/accounts/storerequisitions/-2'
            },

            {
                title: 'Stock Issue',
                link: '/accounts/storerequisitions/-3'
            },
            {
                title: 'Stock Transfer',
                link: '/accounts/storerequisitions/-1'
            },

        ],
    },



    {
        title: 'Accounts Bin',
        icon: 'fas fa-trash',
        children: [
            {
                title: 'Ledger Deleted',
                link: '/accounts/ledgers/1'
            },
            {
                title: 'Voucher & Invoice Deleted',
                link: '/accounts/daybooks/1'
            }
        ]
    },

    {
        title: 'Advance Voucher',
        icon: 'fas fa-building',

        children: [
            {
                title: 'Trip Voucher Expense',
                link: '/accounts/trip-voucher-expense'
            },
            {
                title: 'Trip Voucher Expense(Short)',
                link: '/accounts/trip-voucher-expense/1'
            },
            {
                title: 'Fuel Fillings',
                link: '/accounts/fuelfillings'
            },
        ]
    },
    // {
    //     title: 'Trip Voucher Expense',
    //     icon: 'fas fa-money-check-alt',
    //     link: '/accounts/trip-voucher-expense'
    // },
    // {
    //     title: 'Fuel Fillings',
    //     icon: 'fas fa-money-check-alt',
    //     link: '/accounts/fuelfillings'
    // },




];
