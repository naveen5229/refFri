import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BidSystemComponent } from './bid-system-component';


import { AuthGuard } from '../guards/auth.guard';
import { RouteGuard } from '../guards/route.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OpenOrdersComponent } from './open-orders/open-orders.component';
import { OrderBoardsComponent } from './order-boards/order-boards.component';


const routes: Routes = [
    {
        path: '',
        component: BidSystemComponent,
        children: [
            {
                path: '',
                component: DashboardComponent,
            },
            {
                path: 'dashboard',
                component: DashboardComponent
            },
            {
                path: 'open-orders',
                component: OpenOrdersComponent
            },
            {
                path: 'order-boards',
                component: OrderBoardsComponent
            },
        ],
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BidsRoutingModule {
}