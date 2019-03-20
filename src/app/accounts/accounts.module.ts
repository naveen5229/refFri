import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AccountsRoutingModule } from './accounts-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AccountsComponent } from './accounts.component';
import { OrdersComponent } from './orders/orders.component';
import { StockTypesComponent } from './stock-types/stock-types.component';
import { StockSubtypesComponent } from './stock-subtypes/stock-subtypes.component';
import { StockitemsComponent } from './stockitems/stockitems.component';
import { DirectiveModule } from '../directives/directives.module';
import { AccountComponent } from './account/account.component';
import { LedgersComponent } from './ledgers/ledgers.component';
import { CompanyBranchesComponent } from './company-branches/company-branches.component';
import { VouchersComponent } from './vouchers/vouchers.component';
import { DaybooksComponent } from './daybooks/daybooks.component';
import { LedgerviewComponent } from './ledgerview/ledgerview.component';
import { LedgermappingComponent } from './ledgermapping/ledgermapping.component';
import { InvoiceregisterComponent } from './invoiceregister/invoiceregister.component';
import { TripVoucherExpenseComponent } from './trip-voucher-expense/trip-voucher-expense.component';
import { OutstandingComponent } from './outstanding/outstanding.component';
import { BalancesheetComponent } from './balancesheet/balancesheet.component';

const PAGES_COMPONENTS = [
  AccountsComponent,
];


@NgModule({
  imports: [
    AccountsRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    OrdersComponent,
    StockTypesComponent,
    StockSubtypesComponent,
    StockitemsComponent,
    //AccountsComponent,
    AccountComponent,
    LedgersComponent,
    CompanyBranchesComponent,
    VouchersComponent,
    DaybooksComponent,
    LedgerviewComponent,
    LedgermappingComponent,
    InvoiceregisterComponent,
    TripVoucherExpenseComponent,
    OutstandingComponent,
    BalancesheetComponent
    //StockSubtypeComponent
  ],
})
export class AccountsModule { }
