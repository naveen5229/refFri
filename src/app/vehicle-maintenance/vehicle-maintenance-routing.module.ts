import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { VehicleMaintenanceComponent } from '../vehicle-maintenance/vehicle-maintenance-components';
import { ViewModalServiceComponent } from '../vehicle-maintenance/view-modal-service/view-modal-service.component';
import { ViewSubModalServiceComponent } from '../vehicle-maintenance/view-sub-modal-service/view-sub-modal-service.component';
import { AddVehicleMaintenanceComponent } from './add-vehicle-maintenance/add-vehicle-maintenance.component';
// import { MaintenanaceDashboardComponent } from './maintenanace-dashboard/maintenanace-dashboard.component';
import { MaintenanceSummaryComponent } from './maintenance-summary/maintenance-summary.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../guards/auth.guard';
import { RouteGuard } from '../guards/route.guard';

const routes: Routes = [

    {
        path: '',
        component: VehicleMaintenanceComponent,
        children: [
            {
                path: 'home',
                component: DashboardComponent,
                canActivate: [AuthGuard, RouteGuard]
            },
            {
                path: 'add-vehicle-maintenance',
                component: AddVehicleMaintenanceComponent,
                canActivate: [AuthGuard, RouteGuard]

            },
            // {
            //     path: 'maintenanace-dashboard',
            //     component: MaintenanaceDashboardComponent,
            // },
            {
                path: 'maintenance-summary',
                component: MaintenanceSummaryComponent,
                canActivate: [AuthGuard, RouteGuard]

            },
            {
                path: 'view-modal-service',
                component: ViewModalServiceComponent,
                canActivate: [AuthGuard, RouteGuard]

            },
            {
                path: 'view-sub-modal-service',
                component: ViewSubModalServiceComponent,
                canActivate: [AuthGuard, RouteGuard]

            },



        ],
    }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VehicleMaintenanceRoutingModule {
}