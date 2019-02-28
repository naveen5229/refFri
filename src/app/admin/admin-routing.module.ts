import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EscalationMatrixComponent } from './escalation-matrix/escalation-matrix.component';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehicleStatusChangeComponent } from './vehicle-status-change/vehicle-status-change.component';
import { LRViewComponent } from './lrview/lrview.component';
import { GenerateLRComponent } from './generate-lr/generate-lr.component';



const routes: Routes = [{
    path: '',
    component: AdminComponent,
    children: [
        {
            path: 'dashboard',
            component: VehicleStatusChangeComponent,
        },
        {
            path: 'vehiclestatuschange',
            component: VehicleStatusChangeComponent,
        },
        {
            path: 'escalation-matrix',
            component: EscalationMatrixComponent,
        },
        {
            path: 'lrview',
            component: LRViewComponent,
        },
        {
            path: 'generate-lr',
            component: GenerateLRComponent,
        }
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}
