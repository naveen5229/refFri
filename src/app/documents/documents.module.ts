import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DocumentsComponent } from './documents.components';
import { DocumentationDetailsComponent } from './documentation-details/documentation-details.component';
import { DirectiveModule } from '../directives/directives.module';
import { from } from 'rxjs';
import { DocumentsSummaryComponent } from './documents-summary/documents-summary.component';

// import { AddAgentComponent } from './documentation-modals/add-agent/add-agent.component';
import { EditDocumentComponent } from './documentation-modals/edit-document/edit-document.component';
import { PendingDocumentsComponent } from './pending-documents/pending-documents.component';
// /import { ErrorReportComponent } from './documentation-modals/error-report/error-report.component';
import { CrmVehicleDocumentionsComponent } from './crm-vehicle-documentions/crm-vehicle-documentions.component';
import { DatePipe } from '@angular/common';

const PAGES_COMPONENTS = [
  DocumentsComponent,
];


@NgModule({
  imports: [
    DocumentsRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule
  ],
  providers: [DatePipe],
  declarations: [
    ...PAGES_COMPONENTS,

    DocumentationDetailsComponent,
    DocumentsSummaryComponent,
    CrmVehicleDocumentionsComponent,  
    PendingDocumentsComponent,
    CrmVehicleDocumentionsComponent,    
    CrmVehicleDocumentionsComponent
  ],
})
export class DocumentsModule { }
