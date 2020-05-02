import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoadIntelligenceRoutingModule } from './load-intelligence-routing.module';
import { LoadIntelligenceComponent } from './load-intelligence.component';
import { ShowRoutesComponent } from './show-routes/show-routes.component';
import { DirectiveModule } from '../directives/directives.module';
import { NbSpinnerModule } from '@nebular/theme';
import { PopulateAltitudeComponent } from './populate-altitude/populate-altitude.component';
import { UploadRoutesComponent } from './upload-routes/upload-routes.component';
import { SpecialAreaComponent } from './special-area/special-area.component';
import { HotspotSummaryComponent } from './hotspot-summary/hotspot-summary.component';
import { FindRouteComponent } from './find-route/find-route.component';
import { PathViewverComponent } from './path-viewver/path-viewver.component';
import { ZoneDetailsComponent } from './zone-details/zone-details.component';
@NgModule({
  declarations: [DashboardComponent, LoadIntelligenceComponent, ShowRoutesComponent, PopulateAltitudeComponent, UploadRoutesComponent, SpecialAreaComponent, HotspotSummaryComponent, FindRouteComponent, PathViewverComponent, ZoneDetailsComponent],
  imports: [
    CommonModule,
    LoadIntelligenceRoutingModule,
    ThemeModule,
    DirectiveModule,
    // NbSpinnerModule

  ]
})
export class LoadIntelligenceModule { }
