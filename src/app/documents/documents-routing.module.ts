import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { DocumentsComponent } from './documents.components';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentationDetailsComponent} from './documentation-details/documentation-details.component';
import { DocumentsSummaryComponent} from './documents-summary/documents-summary.component';
import { PendingDocumentsComponent} from './pending-documents/pending-documents.component';
 import { SmartTableComponent } from './smart-table/smart-table.component';
 import {CrmVehicleDocumentionsComponent } from './crm-vehicle-documentions/crm-vehicle-documentions.component';

const routes: Routes = [{
    path: '',
    component: DocumentsComponent,
    children: [
        {
            path: 'dashboard',
            component: DashboardComponent,
        },
        {
            path: 'crm-vehicle-documentions',
            component: CrmVehicleDocumentionsComponent,
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
            path: 'pending-documents',
            component: PendingDocumentsComponent,
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
