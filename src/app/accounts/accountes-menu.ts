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
        title: 'Account Group',
        icon: 'fa fa-university',
        link: '/accounts/account'
    },
    {
        title: 'Ledger',
        icon: 'fas fa-file-invoice-dollar',
        link: '/accounts/ledgers'
    },
    {
        title: 'Company-Branches',
        icon: 'fa fa-building-o',
        link: '/accounts/company-branches'
    },
    {
        title: 'Ware House',
        icon: 'fas fa-warehouse',
        link: '/accounts/ware-house'
    },
    // {
    //     title:'Store Requisition',
    //     icon :'fa fa-building-o',
    //     link: '/accounts/storerequisitions'
    // },
    {
        title: 'Voucher',
        icon: 'fas fa-ticket-alt',
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
        title: 'Account Reports',
        icon: 'fa fa-file-excel',
        children: [
            {
                title: 'Day Book',
                link: '/accounts/daybooks'
            },
            {
                title: 'Ledger View',
                link: '/accounts/ledgerview'
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
                title: 'Balance Sheet',
                link: '/accounts/balancesheet'
            },
            {
                title:'Profit & Loass A/C',
                link: '/accounts/profitloss'
            },
            {
                title:'Cash Book',
                link: '/accounts/cashbook'
            },
            {
                title: 'Bank Book',
                link: '/accounts/bank-books'
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
                title:'Stock Available',
                link: '/accounts/stockavailable'
            },
          
            
        ],
    },
    {
        title: 'Trip Voucher Expense',
        icon: 'fas fa-money-check-alt',
        link: '/accounts/trip-voucher-expense'
    },  {
        title: 'City',
        icon: 'fas fa-city',
        link: '/accounts/city'
    },
  
  


];
