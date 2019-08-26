import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { WareHouseComponent } from './ware-house-component';
import { WareHouseDashbordComponent } from './ware-house-dashbord/ware-house-dashbord.component';
import { WareHouseReceiptsComponent } from './ware-house-receipts/ware-house-receipts.component';
import { WarehouseInventoryComponent } from './warehouse-inventory/warehouse-inventory.component';
import { StateLogsComponent } from './state-logs/state-logs.component';
import { ManageStockExchangeComponent } from './manage-stock-exchange/manage-stock-exchange.component';
import { AuthGuard } from '../guards/auth.guard';
import { RouteGuard } from '../guards/route.guard';


const routes: Routes = [
    {
        path: '',
        component: WareHouseComponent,
        children: [

            {
                path: 'ware-house-dashbord',
                component: WareHouseDashbordComponent,
                canActivate: [AuthGuard, RouteGuard]
            },
            {
                path: 'ware-house-receipts',
                component: WareHouseReceiptsComponent,
                canActivate: [AuthGuard, RouteGuard]

            },
            {
                path: 'warehouse-inventory',
                component: WarehouseInventoryComponent,
                canActivate: [AuthGuard, RouteGuard]

            },
            {
                path: 'state-logs',
                component: StateLogsComponent,
                canActivate: [AuthGuard, RouteGuard]

            }
            ,
            {
                path: 'manage-stock-exchange',
                component: ManageStockExchangeComponent,
                canActivate: [AuthGuard, RouteGuard]

            }


        ],
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WareHouseRoutingModule {
}