import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DocumentsComponent } from './documents.components';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
    path: '',
    component: DocumentsComponent,
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
export class DocumentsRoutingModule {
}
