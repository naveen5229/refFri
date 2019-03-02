import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { DriverComponent } from './driver.component';

const routes: Routes = [{
    path: '',
    component: DriverComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DriverRoutingModule {
}
