import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { BatteryInventoryComponent } from './battery-inventory/battery-inventory.component';
import { BatteryComponent } from './battery.component';
import { BatteryModalsComponent } from './battery-modals/battery-modals.component';
import { VehicleBatteryComponent } from './vehicle-battery/vehicle-battery.component';
import { BatterySummaryComponent } from './battery-summary/battery-summary.component';
import { AuthGuard } from '../guards/auth.guard';
import { RouteGuard } from '../guards/route.guard';


const routes: Routes = [{
    path: '',
    component: BatteryComponent,
    children: [

        {
            path: 'battery-inventory',
            component: BatteryInventoryComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        // {
        //     path: 'battery-modals',
        //     component: BatteryModalsComponent,
        // },
        {
            path: 'vehicle-battery',
            component: VehicleBatteryComponent,
            canActivate: [AuthGuard, RouteGuard]

        },
        {
            path: 'battery-summary',
            component: BatterySummaryComponent,
            canActivate: [AuthGuard, RouteGuard]

        },



    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class BatteryRoutingModule {
}
