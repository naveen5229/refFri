import { NgModule } from '@angular/core';
import { FuelFillingsComponent } from './admin/fuel-fillings/fuel-fillings.component';
import { FuelAverageAnalysisComponent } from './pages/fuel-average-analysis/fuel-average-analysis.component';
import { ThemeModule } from './@theme/theme.module';
import { DashboardModule } from './partner/dashboard/dashboard.module';
import { DirectiveModule } from './directives/directives.module';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ImageViewerModule } from 'ng2-image-viewer';
import { RemainingFuelComponent } from './admin/remaining-fuel/remaining-fuel.component';
import { VehicleTripStagesComponent } from './pages/vehicle-trip-stages/vehicle-trip-stages.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


const PAGES_COMPONENTS = [
    FuelFillingsComponent,
    FuelAverageAnalysisComponent,
    RemainingFuelComponent,
    VehicleTripStagesComponent
];


@NgModule({
    imports: [
        ThemeModule,
        DashboardModule,
        DirectiveModule,
        OwlDateTimeModule,
        OwlNativeDateTimeModule,
        ImageViewerModule
    ],
    exports: [...PAGES_COMPONENTS],
    providers: [],
    declarations: [...PAGES_COMPONENTS],
    entryComponents: [...PAGES_COMPONENTS]

})
export class SharedModule { }
