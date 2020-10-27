import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BidSystemComponent } from './bid-system-component';


import { AuthGuard } from '../guards/auth.guard';
import { RouteGuard } from '../guards/route.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { OpenOrdersComponent } from './open-orders/open-orders.component';
import { OrderBoardsComponent } from './order-boards/order-boards.component';
import { OrdersWonComponent } from './orders-won/orders-won.component';
import { OrderTripManagementComponent } from './order-trip-management/order-trip-management.component';


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
            {
                path: 'orders-won',
                component: OrdersWonComponent
            },
            {
                path: 'order-trip-management',
                component: OrderTripManagementComponent
            },
        ],
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BidsRoutingModule {
}