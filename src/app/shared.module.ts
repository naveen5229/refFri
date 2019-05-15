import { NgModule } from '@angular/core';
import { FuelFillingsComponent } from './admin/fuel-fillings/fuel-fillings.component';
import { FuelAverageAnalysisComponent } from './pages/fuel-average-analysis/fuel-average-analysis.component';
import { ThemeModule } from './@theme/theme.module';
import { DashboardModule } from './partner/dashboard/dashboard.module';
import { DirectiveModule } from './directives/directives.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ImageViewerModule } from 'ng2-image-viewer';
import { RemainingFuelComponent } from './admin/remaining-fuel/remaining-fuel.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { DocumentationDetailsComponent } from './documents/documentation-details/documentation-details.component';
import { DocumentsSummaryComponent } from './documents/documents-summary/documents-summary.component';
import { DocumentDashboardComponent } from './documents/dashboard/dashboard.component';
import { DriverPerformanceComponent } from './driver/driver-performance/driver-performance.component';
import { VehicleDistanceComponent } from './admin/vehicle-distance/vehicle-distance.component';
import { UserActivityStatusComponent } from './pages/user-activity-status/user-activity-status.component';
const PAGES_COMPONENTS = [
    FuelFillingsComponent,
    FuelAverageAnalysisComponent,
    RemainingFuelComponent,
    DocumentationDetailsComponent,
    DocumentsSummaryComponent,
    DocumentDashboardComponent,
    DriverPerformanceComponent,
    VehicleDistanceComponent,
    UserActivityStatusComponent

];


@NgModule({
    imports: [
        ThemeModule,
        DashboardModule,
        DirectiveModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ImageViewerModule,



    ],
    exports: [...PAGES_COMPONENTS],
    providers: [],
    declarations: [...PAGES_COMPONENTS],
    entryComponents: [...PAGES_COMPONENTS]

})
export class SharedModule { }
