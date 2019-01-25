import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PartnerComponent } from './partner.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
    path: '',
    component: PartnerComponent,
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
export class PartnerRoutingModule {
}
