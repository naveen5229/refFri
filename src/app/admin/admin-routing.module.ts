import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { EscalationMatrixComponent } from './escalation-matrix/escalation-matrix.component';
import { GroupManagementsComponent } from './group-managements/group-managements.component';
import { TicketPropertiesComponent } from './ticket-properties/ticket-properties.component';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VehicleStatusChangeComponent } from './vehicle-status-change/vehicle-status-change.component';
import { IssueAlertsComponent } from './issue-alerts/issue-alerts.component';
import { DiagnosticsComponent } from './diagnostics/diagnostics.component';
import { LorryReceiptDetailsComponent } from './lorry-receipt-details/lorry-receipt-details.component';
import { GenerateLRComponent } from '../lorry-receipt/generate-lr/generate-lr.component';
import { SiteFencingComponent } from './site-fencing/site-fencing.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { PendingDocumentsComponent } from '../documents/pending-documents/pending-documents.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { RouteGuard } from '../guards/route.guard';
import { VSCTicketAuditComponent } from './vscticket-audit/vscticket-audit.component';
import { AlertRelatedIssueComponent } from './alert-related-issue/alert-related-issue.component';
import { from } from 'rxjs';
import { GpsSupplierMappingComponent } from './gps-supplier-mapping/gps-supplier-mapping.component';
import { VehiclesViewComponent } from './vehicles-view/vehicles-view.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';


const routes: Routes = [{
    path: '',
    component: AdminComponent,
    children: [
        {
            path: 'dashboard',
            component: VehicleStatusChangeComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vehiclestatuschange',
            component: VehicleStatusChangeComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vscticketaudit',
            component: VSCTicketAuditComponent,
        },
        {
            path: 'issue-alerts',
            component: IssueAlertsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'escalation-matrix',
            component: EscalationMatrixComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'generate-lr',
            component: GenerateLRComponent,
        },
        {
            path: 'group-managements',
            component: GroupManagementsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'ticket-properties',
            component: TicketPropertiesComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'lorry-receipt-details',
            component: LorryReceiptDetailsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'site-fencing',
            component: SiteFencingComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'diagnostics',
            component: DiagnosticsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'site-details',
            component: SiteDetailsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'pending-documents',
            component: PendingDocumentsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'user-preferences',
            component: UserPreferencesComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'alert-related-issue',
            component: AlertRelatedIssueComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'gps-supplier-mapping',
            component: GpsSupplierMappingComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vehicles-view',
            component: VehiclesViewComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'company-details',
            component: CompanyDetailsComponent,
            canActivate: [RouteGuard]
        },

    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminRoutingModule {
}
