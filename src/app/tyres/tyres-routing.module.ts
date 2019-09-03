import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { TyresComponent } from './tyres.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InputsComponent } from './inputs/inputs.component';
import { TyreHealthCheckUpComponent } from './tyre-health-check-up/tyre-health-check-up.component';
import { AddTrollyComponent } from './add-trolly/add-trolly.component';
import { VehicleTrollyMappingComponent } from './vehicle-trolly-mapping/vehicle-trolly-mapping.component';
import { TyreModalsComponent } from './tyre-modals/tyre-modals.component';
import { VehicleTyresComponent } from './vehicle-tyres/vehicle-tyres.component';
import { TyreSummaryComponent } from './tyre-summary/tyre-summary.component';
import { TyreSummaryDetailsComponent } from './tyre-summary-details/tyre-summary-details.component';
import { AuthGuard } from '../guards/auth.guard';
import { RouteGuard } from '../guards/route.guard';

const routes: Routes = [{
    path: '',
    component: TyresComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
            canActivate: [AuthGuard, RouteGuard]
        },
        // {
        //     path: 'inventory',
        //     component: InventoryComponent,
        // },
        {
            path: 'inputs',
            component: InputsComponent,
            canActivate: [AuthGuard, RouteGuard]

        },
        {
            path: 'tyre-health-check-up',
            component: TyreHealthCheckUpComponent,
            canActivate: [AuthGuard, RouteGuard]

        },
        {
            path: 'add-trolly',
            component: AddTrollyComponent,
            canActivate: [AuthGuard, RouteGuard]

        },
        {
            path: 'vehicle-trolly-mapping',
            component: VehicleTrollyMappingComponent,
            canActivate: [AuthGuard, RouteGuard]

        },
        {
            path: 'tyre-modals',
            component: TyreModalsComponent,
            canActivate: [AuthGuard, RouteGuard]

        },
        {
            path: 'vehicle-tyres',
            component: VehicleTyresComponent,
            canActivate: [AuthGuard, RouteGuard]

        },
        {
            path: 'tyre-summary',
            component: TyreSummaryComponent,
            canActivate: [AuthGuard, RouteGuard]

        },
        {
            path: 'tyre-summary-details',
            component: TyreSummaryDetailsComponent,
            canActivate: [AuthGuard, RouteGuard]

        },

    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TyresRoutingModule {
}
