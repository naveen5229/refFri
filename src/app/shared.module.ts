import { NgModule } from '@angular/core';
import { FuelFillingsComponent } from './admin/fuel-fillings/fuel-fillings.component';
import { FuelAverageAnalysisComponent } from './pages/fuel-average-analysis/fuel-average-analysis.component';
import { ThemeModule } from './@theme/theme.module';
import { DashboardModule } from './partner/dashboard/dashboard.module';
import { DirectiveModule } from './directives/directives.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime-ex';
import { RemainingFuelComponent } from './admin/remaining-fuel/remaining-fuel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentationDetailsComponent } from './documents/documentation-details/documentation-details.component';
import { DocumentsSummaryComponent } from './documents/documents-summary/documents-summary.component';
import { DocumentDashboardComponent } from './documents/dashboard/dashboard.component';
import { ConsolidateFuelAverageComponent } from './admin/consolidate-fuel-average/consolidate-fuel-average.component';
import { DriverPerformanceComponent } from './driver/driver-performance/driver-performance.component';
import { VehicleDistanceComponent } from './admin/vehicle-distance/vehicle-distance.component';
import { UserActivityStatusComponent } from './pages/user-activity-status/user-activity-status.component';
import { ViewModalServiceComponent } from './vehicle-maintenance/view-modal-service/view-modal-service.component';
import { ViewSubModalServiceComponent } from './vehicle-maintenance/view-sub-modal-service/view-sub-modal-service.component';
import { DriverModule } from './driver/driver.module';
import { VehiclesComponent } from './admin/vehicles/vehicles.component';
import { ViaRoutesComponent } from './admin/via-routes/via-routes.component';
import { PodDashboardComponent } from './admin/pod-dashboard/pod-dashboard.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler/src/core';
import { ChartModule } from 'angular2-chartjs';
import { NearbyPodsComponent } from './admin/nearby-pods/nearby-pods.component';
import { FuelMileageWithOdoComponent } from './pages/fuel-mileage-with-odo/fuel-mileage-with-odo.component';
import { WebActivitySummaryComponent } from './admin/web-activity-summary/web-activity-summary.component';
import { FoFuelAverageComponent } from './pages/fo-fuel-average/fo-fuel-average.component';
import { ChallanPaymentRequestComponent } from './challan/challan-payment-request/challan-payment-request.component';
import { MvGpsApiReqComponent } from './challan/mv-gps-api-req/mv-gps-api-req.component';
import { VehicleStatusChangeComponent } from './admin/vehicle-status-change/vehicle-status-change.component';
import { TmgComponent } from './pages/tmg/tmg.component';
import { TmgChallanComponent } from './pages/tmg-challan/tmg-challan.component';
import { TmgAlertsComponent } from './pages/tmg-alerts/tmg-alerts.component';
import { TmgCallsComponent } from './pages/tmg-calls/tmg-calls.component';
import { TmgDocumentsComponent } from './pages/tmg-documents/tmg-documents.component';
import { TmgTrafficComponent } from './pages/tmg-traffic/tmg-traffic.component';
import { TmgTripComponent } from './pages/tmg-trip/tmg-trip.component';
import { TmgTrafficAnalysisComponent } from './pages/tmg-traffic-analysis/tmg-traffic-analysis.component';
import { TmgLoadingAnalysisComponent } from './pages/tmg-loading-analysis/tmg-loading-analysis.component';
import { TmgTransporterAnalysisComponent } from './pages/tmg-transporter-analysis/tmg-transporter-analysis.component';
import { TmgUnloadingAnalysisComponent } from './pages/tmg-unloading-analysis/tmg-unloading-analysis.component';
import { PlacementoptimizationComponent } from './pages/placementoptimization/placementoptimization.component';
import { NightDriveReportComponent } from './pages/night-drive-report/night-drive-report.component';


const PAGES_COMPONENTS = [
    FuelFillingsComponent,
    FuelAverageAnalysisComponent,
    ConsolidateFuelAverageComponent,
    RemainingFuelComponent,
    DocumentationDetailsComponent,
    DocumentsSummaryComponent,
    DocumentDashboardComponent,
    DriverPerformanceComponent,
    VehicleDistanceComponent,
    UserActivityStatusComponent,
    ViewModalServiceComponent,
    ViewSubModalServiceComponent,
    VehiclesComponent,
    ViaRoutesComponent,
    PodDashboardComponent,
    NearbyPodsComponent,
    FuelMileageWithOdoComponent,
    WebActivitySummaryComponent,
    FoFuelAverageComponent,
    ChallanPaymentRequestComponent,
    MvGpsApiReqComponent,
    VehicleStatusChangeComponent,
    TmgComponent,
    TmgChallanComponent,
    TmgAlertsComponent,
    TmgCallsComponent,
    TmgDocumentsComponent,
    TmgTrafficComponent,
    TmgTripComponent,
    TmgTrafficAnalysisComponent,
    TmgLoadingAnalysisComponent,
    TmgTransporterAnalysisComponent,
    TmgUnloadingAnalysisComponent,
    PlacementoptimizationComponent,
    NightDriveReportComponent,
    
];


@NgModule({
    imports: [
        ThemeModule,
        DashboardModule,
        DirectiveModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ChartModule,
    ],
    exports: [...PAGES_COMPONENTS],
    providers: [],
    declarations: [...PAGES_COMPONENTS],
    entryComponents: [...PAGES_COMPONENTS],
    // schemas: [CUSTOM_ELEMENTS_SCHEMA]


})
export class SharedModule { }
