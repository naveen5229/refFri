import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DocumentsComponent } from './documents.components';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentationDetailsComponent } from './documentation-details/documentation-details.component';
import { DocumentsSummaryComponent } from './documents-summary/documents-summary.component';
import { PendingDocumentsComponent } from './pending-documents/pending-documents.component';
import { ChangeHistoryComponent } from '../documents/change-history/change-history.component';

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
            path: 'pending-documents',
            component: PendingDocumentsComponent,
        },     
        {
            path: 'change-history',
            component: ChangeHistoryComponent,
        },
    ],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class DocumentsRoutingModule {
}
