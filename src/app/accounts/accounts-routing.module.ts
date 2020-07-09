import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AccountsComponent } from './accounts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { StockTypesComponent } from './stock-types/stock-types.component';
import { StockSubtypesComponent } from './stock-subtypes/stock-subtypes.component';
import { StockTypeComponent } from '../acounts-modals/stock-type/stock-type.component';
import { StockitemsComponent } from './stockitems/stockitems.component';
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
import {  DaybookpendingComponent } from './daybookpending/daybookpending.component';
import {  GstreportComponent } from './gstreport/gstreport.component';
import { TallyexportComponent } from './tallyexport/tallyexport.component';
import { TripExpenseTallyComponent } from './trip-expense-tally/trip-expense-tally.component';
import { StaticsComponent } from './statics/statics.component';
import { LedgerapproveComponent } from './ledgerapprove/ledgerapprove.component';
import { AccountEntryApprovalComponent } from './account-entry-approval/account-entry-approval.component';
import { StoclsummaryComponent } from './stoclsummary/stoclsummary.component';
import { CountryComponent } from './country/country.component';
import { StateComponent } from './state/state.component';
import { LedgerregidterComponent } from './ledgerregidter/ledgerregidter.component';
import { ServiceComponent } from './service/service.component';
import { ReportconfigComponent } from './reportconfig/reportconfig.component';

const routes: Routes = [{
    path: '',
    component: AccountsComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
        {
            path: 'orders',
            component: OrdersComponent,
        },
        {
            path: 'orders/:id/:name',
            component: OrdersComponent
        },
        {
            path: 'stock-types',
            component: StockTypesComponent,
        },
        {
            path: 'stock-subtypes',
            component: StockSubtypesComponent
        },
        {
            path: 'stockitem',
            component: StockitemsComponent
        },
        {
            path: 'account',
            component: AccountComponent
        },
        {
            path: 'ledgers',
            component: LedgersComponent
        },
        {
            path: 'ledgers/:id',
            component: LedgersComponent
        },
        {
            path: 'company-branches',
            component: CompanyBranchesComponent
        },
        {
            path: 'vouchers',
            component: VouchersComponent
        },
        {
            path: 'vouchers/:id/:name',
            component: VouchersComponent
        },
        {
            path: 'daybooks',
            component: DaybooksComponent
        },
        {
            path: 'daybooks/:id',
            component: DaybooksComponent
        },
        {
            path: 'ledgerview',
            component: LedgerviewComponent
        },
        {
            path: 'ledgermapping',
            component: LedgermappingComponent
        },
        {
            path: 'trip-expense-tally',
            component:TripExpenseTallyComponent
        },
        {
            path: 'invoiceregister',
            component: InvoiceregisterComponent
        },
        {
            path: 'trip-voucher-expense',
            component: TripVoucherExpenseComponent
        },
        {
            path: 'trip-voucher-expense/:id',
            component: TripVoucherExpenseComponent
        },
        {
            path: 'outstanding',
            component: OutstandingComponent
        },
        {
            path: 'balancesheet',
            component: BalancesheetComponent
        },
        {
            path: 'profitloss',
            component: ProfitlossComponent
        },
        {
            path: 'stockavailable',
            component: StockavailableComponent
        },
        {
            path: 'ware-house',
            component: WareHouseComponent
        },
        {
            path: 'cashbook',
            component: CashbookComponent,
        },
        {
            path: 'bank-books',
            component: BankbooksComponent,
        },
        {
            path: 'city',
            component: CityComponent
        },
        {
            path: 'storerequisitions',
            component: StorerequisitionsComponent
        },
        {
            path: 'trading',
            component: TradingComponent
        },
        {
            path: 'openingstock',
            component: OpeningstockComponent
        },
        {
            path: 'storerequisitions/:id',
            component: StorerequisitionsComponent
        },
        {
            path: 'trialbalance',
            component: TrialbalanceComponent
        },
        {
            path: 'costcenter',
            component: CostcenterComponent
        },
        {
            path: 'cost-center-report',
            component: CostCenterReportComponent,
        },
        {
            path: 'voucheredited',
            component: VouchereditedComponent
        },
        {
            path: 'fuelfillings',
            component: FuelfillingsComponent
        },
        {
            path: 'vehicle-cost-center-list',
            component: VehicleCostCenterListComponent
        },
        {
            path: 'mapped-fuel-voucher',
            component: MappedFuelVoucherComponent
        },
        {
            path: 'vehicle-ledgers',
            component: VehicleLedgersComponent
        },
        {
            path:'daybookpending',
            component: DaybookpendingComponent
        },
        {
            path:'gstreport',
            component: GstreportComponent
        },
        {
            path:'tallyexport',
            component:TallyexportComponent
        },
        {
            path:'statics',
            component:StaticsComponent
        },
        {
            path:'ledgerapprove',
            component:LedgerapproveComponent
        },
        {
            path: 'account-entry-approval',
            component: AccountEntryApprovalComponent
        },
        {
            path :'stoclsummary',
            component: StoclsummaryComponent
        },
        {
            path :'country',
            component: CountryComponent
        },
        {
            path :'state',
            component: StateComponent
        },
        {
            path :'ledgerregidter',
            component: LedgerregidterComponent
        },
        // {
        //     path :'service',
        //     component: ServiceComponent
        // },
        {
            path: 'service/:id/:name',
            component: ServiceComponent
        }, 
        {
            path: 'reportconfig',
            component: ReportconfigComponent
        }, 
        
    ],

}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountsRoutingModule {
}
