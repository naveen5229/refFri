import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { TyresComponent } from './tyres.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
    path: '',
    component: TyresComponent,
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
export class TyresRoutingModule {
}
