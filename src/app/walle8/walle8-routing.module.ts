import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DashboardComponent } from './dashboard/dashboard.component';
import { Walle8Component } from './walle8.component';
import { CardMappingComponent } from './card-mapping/card-mapping.component';

const routes: Routes = [{
    path: '',
    component: Walle8Component,
    children: [
        {
            path: '',
            component: DashboardComponent,
        },
        {
            path: 'card-mapping',
            component: CardMappingComponent,
        }

    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class Walle8RoutingModule {
}
