import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BatteryInventoryComponent } from './battery-inventory/battery-inventory.component';
import { BatteryComponent } from './battery.component';
import { BatteryModalsComponent } from './battery-modals/battery-modals.component';


const routes: Routes = [{
    path: '',
    component: BatteryComponent,
    children: [
        // {
        //     path: 'dashboard',
        //     component: DashboardComponent,
        // },
        {
            path: 'battery-inventory',
            component: BatteryInventoryComponent,
        },
        {
            path: 'battery-modals',
            component: BatteryModalsComponent,
        },


    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BatteryRoutingModule {
}
