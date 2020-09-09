import { NgModule } from '@angular/core';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DirectiveModule } from '../directives/directives.module';

import { DatePipe } from '@angular/common';
import { DriverComponent } from './driver.component';
import { DriverRoutingModule } from './driver-routing.module';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import { VehicleDriverMappingComponent } from './vehicle-driver-mapping/vehicle-driver-mapping.component';
import { DriverAttendanceComponent } from './driver-attendance/driver-attendance.component';
import { DriverDocumentComponent } from './driver-document/driver-document.component';
// import { ImageViewerModule } from 'ng2-image-viewer';

const PAGES_COMPONENTS = [
  DriverComponent,
];


@NgModule({
  imports: [
    DriverRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    // ImageViewerModule
  ],
  exports: [
    DriverListComponent,
  ],
  providers: [DatePipe],
  declarations: [
    ...PAGES_COMPONENTS,
    AddDriverComponent,
    DriverListComponent,
    VehicleDriverMappingComponent,
    DriverAttendanceComponent,
    DriverDocumentComponent,

  ],
})
export class DriverModule { }
