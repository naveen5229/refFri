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
import { OutstandingComponent,outStandingTreeComponent } from './outstanding/outstanding.component';
import { BalancesheetComponent,BalanceSheetTreeComponent } from './balancesheet/balancesheet.component';
import { ProfitlossComponent } from './profitloss/profitloss.component';
import { StockavailableComponent } from './stockavailable/stockavailable.component';
import { WareHouseComponent } from './ware-house/ware-house.component';
import { CashbookComponent } from './cashbook/cashbook.component';
import { BankbooksComponent } from './bankbooks/bankbooks.component';
import { CityComponent } from './city/city.component';
import { StorerequisitionsComponent } from './storerequisitions/storerequisitions.component';
import { TradingComponent } from './trading/trading.component';
import { OpeningstockComponent } from './openingstock/openingstock.component';
import { TrialbalanceComponent } from './trialbalance/trialbalance.component';
import { CostcenterComponent } from './costcenter/costcenter.component';
import { CostCenterReportComponent } from './cost-center-report/cost-center-report.component';
import { VouchereditedComponent } from './voucheredited/voucheredited.component';
import { FuelfillingsComponent } from './fuelfillings/fuelfillings.component';
import { VehicleCostCenterListComponent } from './vehicle-cost-center-list/vehicle-cost-center-list.component';
import { MappedFuelVoucherComponent } from './mapped-fuel-voucher/mapped-fuel-voucher.component';
import { VehicleLedgersComponent } from './vehicle-ledgers/vehicle-ledgers.component';
import { DaybookpendingComponent } from './daybookpending/daybookpending.component';
import { GstreportComponent } from './gstreport/gstreport.component';
import { TallyexportComponent } from './tallyexport/tallyexport.component';
import { TripExpenseTallyComponent } from './trip-expense-tally/trip-expense-tally.component';
import { StaticsComponent } from './statics/statics.component';
import { LedgerapproveComponent } from './ledgerapprove/ledgerapprove.component';
import { AccountEntryApprovalComponent } from './account-entry-approval/account-entry-approval.component';
import { StoclsummaryComponent } from './stoclsummary/stoclsummary.component';
import { CountryComponent } from './country/country.component';
import { StateComponent } from './state/state.component';
import { LedgerregidterComponent,ledgerRegisterTreeComponent } from './ledgerregidter/ledgerregidter.component';
import { ServiceComponent } from './service/service.component';
import { ReportconfigComponent } from './reportconfig/reportconfig.component';

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
    BalancesheetComponent,
    ProfitlossComponent,
    StockavailableComponent,
    WareHouseComponent,
    CashbookComponent,
    BankbooksComponent,
    CityComponent,
    StorerequisitionsComponent,
    TradingComponent,
    OpeningstockComponent,
    TrialbalanceComponent,
    CostcenterComponent,
    CostCenterReportComponent,
    VouchereditedComponent,
    FuelfillingsComponent,
    VehicleCostCenterListComponent,
    MappedFuelVoucherComponent,
    VehicleLedgersComponent,
    DaybookpendingComponent,
    GstreportComponent,
    TallyexportComponent,
    TripExpenseTallyComponent,
    StaticsComponent,
    LedgerapproveComponent,
    AccountEntryApprovalComponent,
    StoclsummaryComponent,
    CountryComponent,
    StateComponent,
    LedgerregidterComponent,
    ledgerRegisterTreeComponent,
    outStandingTreeComponent,
    ServiceComponent,
    ReportconfigComponent,
    BalanceSheetTreeComponent
  ],
  entryComponents:[
    StockitemsComponent,
    StockSubtypesComponent,
    LedgersComponent
  ]
})
export class AccountsModule { }
