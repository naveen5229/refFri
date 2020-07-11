import { NbMenuItem } from '@nebular/theme';

export const ACCOUNTS_MENU_ITEMS = JSON.stringify([
    {
        title: 'Home Dashboard',
        icon: 'fa fa-home',
        link: '/pages/dashboard',
        home: true,
    },
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
                title: 'Ledger (F1)',
                link: '/accounts/ledgers/0'
            },
            {
                title: 'Country',
                link: '/accounts/country'
            },
            {
                title: 'State',
                link: '/accounts/state'
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
            {
                title: 'Report Configure',
                link: '/accounts/reportconfig'
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
                title: 'Day Book (Ctrl+1)',
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
                title: 'Ledger View (Ctrl+2)',
                link: '/accounts/ledgerview'
            },
            {
                title: 'Cost Category',
                link: '/accounts/cost-center-report'
            },
            {
                title: 'Trading Account (Ctrl+5)',
                link: '/accounts/trading'
            },
            {
                title: 'Profit & Loss A/C (Ctrl+3)',
                link: '/accounts/profitloss'
            },
            {
                title: 'Balance Sheet (Ctrl+4)',
                link: '/accounts/balancesheet'
            },
            {
                title: 'Trial Balance (Ctrl+6)',
                link: '/accounts/trialbalance'
            },
            {
                title: 'Ledger Mapping (Ctrl+0)',
                link: '/accounts/ledgermapping'
            },
            {
                title: 'OutStanding',
                link: '/accounts/outstanding'
            },
            {
                title: 'Mapped Fuel Voucher',
                link: '/accounts/mapped-fuel-voucher'
            },
            {
                title: 'Ledger Register',
                link: '/accounts/ledgerregidter'
            },
            
            

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
                title: 'Tally Export',
                link: '/accounts/tallyexport'
            },
            {
                title: 'Voucher Audit',
                link: '/accounts/voucheredited'
            },
            {
                title: 'Voucher Audit',
                link: '/accounts/voucheredited'
            },
            {
                title: 'Ledger Approve',
                link: '/accounts/ledgerapprove'
            },
            {
                title: 'Accounts Entry Approval',
                link: '/accounts/account-entry-approval'
            },
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
            // {
            //     title: 'Sales Invoice',
            //     link: '/accounts/orders/-104/Sales Invoice'
            // },
            {
                title: 'Sales Invoice',
                link: '/accounts/service/-104/Sales Invoice'
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
                link: '/accounts/service/-106/Credit Note'
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
            {
                title:' Store Register',
                link: '/accounts/stoclsummary'
            }
        ],
    },
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
            {
                title: 'Opening Stock',
                link: '/accounts/storerequisitions/-101'
            }

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
                title: 'Trip Voucher Expense (F10)',
                link: '/accounts/trip-voucher-expense'
            },
            {
                title: 'Trip Voucher Expense(Short) (F11)',
                link: '/accounts/trip-voucher-expense/1'
            },
            {
                title: 'Fuel Fillings (F12)',
                link: '/accounts/fuelfillings'
            },
        ]
    },
]);
