import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { AddDriverComponent } from './add-driver/add-driver.component';
import { DriverComponent } from './driver.component';
import { DriverListComponent } from './driver-list/driver-list.component';

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
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DriverRoutingModule {
}
