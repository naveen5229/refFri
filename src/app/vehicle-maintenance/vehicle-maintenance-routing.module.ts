import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { VehicleMaintenanceComponent } from '../vehicle-maintenance/vehicle-maintenance-components';
import { ViewModalServiceComponent } from '../vehicle-maintenance/view-modal-service/view-modal-service.component';
import { AddVehicleMaintenanceComponent } from './add-vehicle-maintenance/add-vehicle-maintenance.component';
// import { MaintenanaceDashboardComponent } from './maintenanace-dashboard/maintenanace-dashboard.component';
import { MaintenanceSummaryComponent } from './maintenance-summary/maintenance-summary.component';

const routes: Routes = [{
    path: '',
    component: VehicleMaintenanceComponent,
    children: [
        {
            path: 'add-vehicle-maintenance',
            component: AddVehicleMaintenanceComponent,
        },
        // {
        //     path: 'maintenanace-dashboard',
        //     component: MaintenanaceDashboardComponent,
        // },
        {
            path: 'maintenance-summary',
            component: MaintenanceSummaryComponent,
        },
        {
            path: 'view-modal-service',
            component: ViewModalServiceComponent,
        },


    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VehicleMaintenanceRoutingModule {
}