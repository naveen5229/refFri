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
import { TransportAreaComponent } from './transport-area/transport-area.component';
import { SiteDetailsComponent } from './site-details/site-details.component';
import { PendingDocumentsComponent } from '../documents/pending-documents/pending-documents.component';
import { UserPreferencesComponent } from './user-preferences/user-preferences.component';
import { RouteGuard, DeactivateGuardService } from '../guards/route.guard';
import { VSCTicketAuditComponent } from './vscticket-audit/vscticket-audit.component';
import { AlertRelatedIssueComponent } from './alert-related-issue/alert-related-issue.component';
import { from } from 'rxjs';
import { GpsSupplierMappingComponent } from './gps-supplier-mapping/gps-supplier-mapping.component';
import { VehiclesViewComponent } from './vehicles-view/vehicles-view.component';
import { CompanyDetailsComponent } from './company-details/company-details.component';
import { TransportAgentsComponent } from './transport-agents/transport-agents.component';
import { DriverListComponent } from '../driver/driver-list/driver-list.component';
import { VehicleGpsTrailComponent } from './vehicle-gps-trail/vehicle-gps-trail.component';
import { FuelFillingsComponent } from './fuel-fillings/fuel-fillings.component';
import { SubSitesComponent } from './sub-sites/sub-sites.component';
import { ActivitySummaryComponent } from './activity-summary/activity-summary.component';
import { VehicleGpsDetailComponent } from './vehicle-gps-detail/vehicle-gps-detail.component';
import { VehicleDistanceComponent } from './vehicle-distance/vehicle-distance.component';
import { TripSiteRuleComponent } from './trip-site-rule/trip-site-rule.component';
import { TripStatusFeedbackLogsComponent } from './trip-status-feedback-logs/trip-status-feedback-logs.component';
import { FuelAverageAnalysisComponent } from '../pages/fuel-average-analysis/fuel-average-analysis.component';
import { RemainingFuelComponent } from './remaining-fuel/remaining-fuel.component';
import { TicketSubscribeComponent } from './ticket-subscribe/ticket-subscribe.component';
import { BeehiveComponent } from './beehive/beehive.component';
import { AddCustomerComponent } from './add-customer/add-customer.component';
import { FuelRulesComponent } from './fuel-rules/fuel-rules.component';
import { PumpStationAreaComponent } from './pump-station-area/pump-station-area.component';
import { TollTransactionSummaryComponent } from './toll-transaction-summary/toll-transaction-summary.component';
import { ManualTollTransactionSummaryComponent } from './manual-toll-transaction-summary/manual-toll-transaction-summary.component';
import { VehiclewiseTolltransactionComponent } from './vehiclewise-tolltransaction/vehiclewise-tolltransaction.component';
import { PendingVehicleComponent } from './pending-vehicle/pending-vehicle.component';
import { HaltDensityComponent } from './halt-density/halt-density.component';
import { PalacementSiteRuleComponent } from './placement-site-rule/palacement-site-rule.component';
import { FuelAverageIssuesComponent } from './fuel-average-issues/fuel-average-issues.component';
import { ConsolidateFuelAverageComponent } from './consolidate-fuel-average/consolidate-fuel-average.component';
import { FuelAnalysisComponent } from './fuel-analysis/fuel-analysis.component';
import { FoFsMappingComponent } from './fo-fs-mapping/fo-fs-mapping.component';
import { TripAnalysisComponent } from './trip-analysis/trip-analysis.component';
import { VehiclesComponent } from './vehicles/vehicles.component';
import { LrDiagnosticsComponent } from './lr-diagnostics/lr-diagnostics.component';
import { VscDiagnosisComponent } from './vsc-diagnosis/vsc-diagnosis.component';
import { ViewModalServiceComponent } from '../vehicle-maintenance/view-modal-service/view-modal-service.component';
import { ViewSubModalServiceComponent } from '../vehicle-maintenance/view-sub-modal-service/view-sub-modal-service.component';
import { ViaRoutesComponent } from './via-routes/via-routes.component';
import { BufferPolylineComponent } from './buffer-polyline/buffer-polyline.component';
import { PodDashboardComponent } from './pod-dashboard/pod-dashboard.component';
import { NearbyPodsComponent } from './nearby-pods/nearby-pods.component';
import { LocationsComponent } from './locations/locations.component';
import { WebActivitySummaryComponent } from './web-activity-summary/web-activity-summary.component';
import { VouchersSummaryComponent } from './vouchers-summary/vouchers-summary.component';
import { UserTemplatesComponent } from './user-templates/user-templates.component';
import { FuelMileageWithOdoComponent } from '../pages/fuel-mileage-with-odo/fuel-mileage-with-odo.component';
import { BatteryModalsComponent } from '../battery/battery-modals/battery-modals.component';
import { FoFuelAverageComponent } from '../pages/fo-fuel-average/fo-fuel-average.component';
import { ChallanPaymentRequestComponent } from '../challan/challan-payment-request/challan-payment-request.component';
import { MvGpsApiReqComponent } from '../challan/mv-gps-api-req/mv-gps-api-req.component';
import { CaptchaComponent } from './captcha/captcha.component';
import { FinancialAccountSummaryComponent } from './financial-account-summary/financial-account-summary.component';
import { TripVerificationComponent } from './trip-verification/trip-verification.component';
import { VehdocmismatchComponent } from './vehdocmismatch/vehdocmismatch.component';
import { LocPreferenceComponent } from './loc-preference/loc-preference.component';
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
            path: 'load-intelligence',
            loadChildren: () => import('../load-intelligence/load-intelligence.module').then(m => m.LoadIntelligenceModule),
            canActivate: [RouteGuard]
        },
        {
            path: 'beehive',
            component: BeehiveComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vehiclestatuschange',
            component: VehicleStatusChangeComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'tripverification',
            component: TripVerificationComponent,
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
            path: 'ticket-subscribe',
            component: TicketSubscribeComponent,
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
            path: 'transport-area',
            component: TransportAreaComponent,
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
            canActivate: [RouteGuard],
        },
        {
            path: 'user-preferences',
            component: UserPreferencesComponent,
            canActivate: [RouteGuard],
            canDeactivate: [DeactivateGuardService]
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
        {
            path: 'transport-agents',
            component: TransportAgentsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'driver-list',
            component: DriverListComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vehicle-gps-trail',
            component: VehicleGpsTrailComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'sub-sites',
            component: SubSitesComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vehicle-distance',
            component: VehicleDistanceComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'activity-summary',
            component: ActivitySummaryComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vehicle-gps-detail',
            component: VehicleGpsDetailComponent,
        },
        {


            path: 'trip-status-feedback-logs',
            component: TripStatusFeedbackLogsComponent,
            canActivate: [RouteGuard]
        },


        {
            path: 'fuel-fillings',
            component: FuelFillingsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'fo-fs-mapping',
            component: FoFsMappingComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'fuel-rules',
            component: FuelRulesComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'pump-station-area',
            component: PumpStationAreaComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'trip-site-rule',
            component: TripSiteRuleComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'fuel-average-analysis',
            component: FuelAverageAnalysisComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'fuel-average-issues',
            component: FuelAverageIssuesComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'consolidate-fuel-average',
            component: ConsolidateFuelAverageComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'fuel-analysis',
            component: FuelAnalysisComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'remaining-fuel',
            component: RemainingFuelComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'add-customer',
            component: AddCustomerComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'toll-transaction-summary',
            component: TollTransactionSummaryComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'manual-toll-transaction-summary',
            component: ManualTollTransactionSummaryComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vehiclewise-tolltransaction',
            component: VehiclewiseTolltransactionComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'pending-vehicle',
            component: PendingVehicleComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'halt-density',
            component: HaltDensityComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'placement-site-rule',
            component: PalacementSiteRuleComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'trip-analysis',
            component: TripAnalysisComponent,
        },
        {
            path: 'vehicles',
            component: VehiclesComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'lr-diagnostics',
            component: LrDiagnosticsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vsc-diagnosis',
            component: VscDiagnosisComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'view-modal-service',
            component: ViewModalServiceComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'view-sub-modal-service',
            component: ViewSubModalServiceComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'via-routes',
            component: ViaRoutesComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'buffer-polyline',
            component: BufferPolylineComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'pod-dashboard',
            component: PodDashboardComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'nearby-pods',
            component: NearbyPodsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'locations',
            component: LocationsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'web-activity-summary',
            component: WebActivitySummaryComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vouchers-summary',
            component: VouchersSummaryComponent,
            canActivate: [RouteGuard]

        },
        {

            path: 'fuel-mileage-with-odo',
            component: FuelMileageWithOdoComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'user-templates',
            component: UserTemplatesComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'fo-fuel-average',
            component: FoFuelAverageComponent,
            canActivate: [RouteGuard]
        },

        {
            path: 'battery-modals',
            component: BatteryModalsComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'captcha',
            component: CaptchaComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'challan-payment-request',
            component: ChallanPaymentRequestComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'mv-gps-api-req',
            component: MvGpsApiReqComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'financial-account-summary',
            component: FinancialAccountSummaryComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'vehdocmismatch',
            component: VehdocmismatchComponent,
            canActivate: [RouteGuard]
        },
        {
            path: 'loc-preference',
            component: LocPreferenceComponent,
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
