import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { DriverComponent } from './driver.component';
import { DriverListComponent } from './driver-list/driver-list.component';
import {VehicleDriverMappingComponent } from './vehicle-driver-mapping/vehicle-driver-mapping.component';
import {DriverAttendanceComponent } from './driver-attendance/driver-attendance.component';
    import { from } from 'rxjs';
const routes: Routes = [{
    path: '',
    component: DriverComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
        {
            path: 'add-driver',
            component: AddDriverComponent,
        },
        {
            path: 'driver-list',
            component: DriverListComponent,
        },
        {
            path: 'vehicle-driver-mapping',
            component: VehicleDriverMappingComponent,
        },
        {
            path: 'driver-attendance',
            component: DriverAttendanceComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DriverRoutingModule {
}
