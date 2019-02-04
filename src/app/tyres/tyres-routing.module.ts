import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { TyresComponent } from './tyres.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InputsComponent } from './inputs/inputs.component';
import { TyreHealthCheckUpComponent } from './tyre-health-check-up/tyre-health-check-up.component';
import { AddTrollyComponent } from './add-trolly/add-trolly.component';


const routes: Routes = [{
    path: '',
    component: TyresComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
        {
            path: 'inventory',
            component: InventoryComponent,
        },
        {
            path: 'inputs',
            component: InputsComponent,
        },
        {
            path: 'tyre-health-check-up',
            component: TyreHealthCheckUpComponent,
        },
        {
            path: 'add-trolly',
            component: AddTrollyComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class TyresRoutingModule {
}
