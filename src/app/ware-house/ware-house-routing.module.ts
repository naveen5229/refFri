import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { WareHouseComponent } from './ware-house-component';
import { WareHouseDashbordComponent } from './ware-house-dashbord/ware-house-dashbord.component';
import { WareHouseReceiptsComponent } from './ware-house-receipts/ware-house-receipts.component';
import { WarehouseInventoryComponent } from './warehouse-inventory/warehouse-inventory.component';


const routes: Routes = [
    {
        path: '',
        component: WareHouseComponent,
        children: [

            {
                path: 'ware-house-dashbord',
                component: WareHouseDashbordComponent
            },

            {
                path:'ware-house-dashbord',
                component:WareHouseDashbordComponent
            },
            {
                path:'ware-house-receipts',
                component:WareHouseReceiptsComponent
            },
            {
                path: 'warehouse-inventory',
                component: WarehouseInventoryComponent
            }



        ],
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class WareHouseRoutingModule {
}