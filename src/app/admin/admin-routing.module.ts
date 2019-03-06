import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EscalationMatrixComponent } from './escalation-matrix/escalation-matrix.component';
import { GroupManagementsComponent } from './group-managements/group-managements.component';
import { TicketPropertiesComponent} from './ticket-properties/ticket-properties.component';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehicleStatusChangeComponent } from './vehicle-status-change/vehicle-status-change.component';
import { IssueAlertsComponent } from './issue-alerts/issue-alerts.component';


import { LorryReceiptDetailsComponent } from './lorry-receipt-details/lorry-receipt-details.component';
import { LRViewComponent } from '../lorry-receipt/lrview/lrview.component';
import { GenerateLRComponent } from '../lorry-receipt/generate-lr/generate-lr.component';
import { SiteFencingComponent } from './site-fencing/site-fencing.component';


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
            path: 'issue-alerts',
            component: IssueAlertsComponent,
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
        },
        {
            path: 'group-managements',
            component: GroupManagementsComponent,
        },
        {
            path: 'ticket-properties',
            component: TicketPropertiesComponent,
        },
        {
            path: 'lorry-receipt-details',
            component: LorryReceiptDetailsComponent,
        },
        {
            path: 'site-fencing',
            component: SiteFencingComponent,
        }
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}
