import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AccountsComponent } from './accounts.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OrdersComponent } from './orders/orders.component';
import { StockTypesComponent } from './stock-types/stock-types.component';

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
            component: OrdersComponent
        },
        {
            path: 'stock-types',
            component: StockTypesComponent
        }
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AccountsRoutingModule {
}
