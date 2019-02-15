import { NbMenuItem } from '@nebular/theme';
import { VoucherComponent } from '../acounts-modals/voucher/voucher.component';

export const MENU_ITEMS: NbMenuItem[] = [
    {
        title: 'Dashboard',
        icon: 'nb-home',
        link: '/accounts/dashboard',
        home: true,
    },
    {
        title: 'Invoice',
        icon: 'nb-home',
        link: '/accounts/orders'
    },
    {
        title: 'Day Book',
        icon: 'nb-home',
        link: '/accounts/daybooks'
    },
    {
        title: 'Stock Types',
        icon: 'nb-home',
        link: '/accounts/stock-types'
    },
    {
        title: 'Stock Sub Types',
        icon: 'nb-home',
        link: '/accounts/stock-subtypes'
    }
    ,
    {
        title: 'Stock Item',
        icon: 'nb-home',
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
    }



];
