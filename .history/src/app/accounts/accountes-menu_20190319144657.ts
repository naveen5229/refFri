import { NbMenuItem } from '@nebular/theme';
import { VoucherComponent } from '../acounts-modals/voucher/voucher.component';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Home Dashboard',
        icon: 'fa fa-home',
        link: '/pages/dashboard',
        home: true,
    },
    {
        title: 'Invoice',
        icon: 'fas fa-file-invoice',
        link: '/accounts/orders'
    },

    {
        title: 'Stock Types',
        icon: 'fas fa-weight-hanging',
        link: '/accounts/stock-types'
    },
    {
        title: 'Stock Sub Types',
        icon: 'fas fa-weight-hanging',
        link: '/accounts/stock-subtypes'
    }
    ,
    {
        title: 'Stock Item',
        icon: 'fa fa-list',
        link: '/accounts/stockitem'
    },
    {
        title: 'Account',
        icon: 'nb-home',
        link: '/accounts/account'
    },
    {
        title: 'Ledger',
        icon: 'nb-home',
        link: '/accounts/ledgers'
    },
    {
        title: 'Company-Branches',
        icon: 'nb-home',
        link: '/accounts/company-branches'
    },
    {
        title: 'Voucher',
        icon: 'nb-star',
        children: [
            {
                title: 'Journal Voucher',
                link: '/accounts/vouchers/-7/Journal Voucher'
            },
            {
                title: 'Cash Receipt Voucher',
                link: '/accounts/vouchers/-4/Cash Receipt Voucher'
            },
            {
                title: 'Bank Receipt Voucher',
                link: '/accounts/vouchers/-2/Bank Receipt Voucher'
            },
            {
                title: 'Cash Payment Voucher',
                link: '/accounts/vouchers/-3/Cash Payment Voucher'
            },
            {
                title: 'Bank Payment Voucher',
                link: '/accounts/vouchers/-1/Bank Payment Voucher'
            },
            {
                title: 'Contra Voucher',
                link: '/accounts/vouchers/-8/Contra Voucher'
            },
        ],
    },
    {
        title: 'Reports',
        icon: 'nb-bar-chart',
        children: [
            {
                title: 'Day Book',
                link: '/accounts/daybooks'
            },
            {
                title: 'Ledger',
                link: '/accounts/ledgerview'
            },
            {
                title: 'Ledger Mapping',
                link: '/accounts/ledgermapping'
            },
            {
                title: 'Invoice Register',
                link: '/accounts/invoiceregister'
            },
            {
                title: 'OutStanding',
                link: '/accounts/outstanding'
            }
        ],
    },
    {
        title: 'Trip Voucher Expense',
        icon: 'nb-home',
        link: '/accounts/trip-voucher-expense'
    }

];
