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
import{ LedgersComponent } from './ledgers/ledgers.component';
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
        }
    ]
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountsRoutingModule {
}
