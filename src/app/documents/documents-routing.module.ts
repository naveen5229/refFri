import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DocumentsComponent } from './documents.components';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentationDetailsComponent} from './documentation-details/documentation-details.component';
import { DocumentsSummaryComponent} from './documents-summary/documents-summary.component';
 import { SmartTableComponent } from './smart-table/smart-table.component';

const routes: Routes = [{
    path: '',
    component: DocumentsComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
        {
            path: 'documentation-details',
            component: DocumentationDetailsComponent,
        },
        {
            path: 'documents-summary',
            component: DocumentsSummaryComponent,
        },
        {
            path: 'smart-table',
            component: SmartTableComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DocumentsRoutingModule {
}
