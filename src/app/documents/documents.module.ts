import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { Ng2SmartTableModule} from 'ng2-smart-table';
import { DocumentsComponent } from './documents.components';
import { DocumentationDetailsComponent } from './documentation-details/documentation-details.component';
import { DirectiveModule } from '../directives/directives.module';
import { SmartTableComponent } from './smart-table/smart-table.component';
  import { from } from 'rxjs';
<<<<<<< HEAD
import { DocumentsSummaryComponent } from './documents-summary/documents-summary.component';
// import { AddAgentComponent } from './documentation-modals/add-agent/add-agent.component';
=======
import { EditDocumentComponent } from './documentation-modals/edit-document/edit-document.component';
// /import { ErrorReportComponent } from './documentation-modals/error-report/error-report.component';

>>>>>>> 0e37fb84aea3cb3f1b29834fb347c004a70e65f2

const PAGES_COMPONENTS = [
  DocumentsComponent,
];


@NgModule({
  imports: [
    DocumentsRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    Ng2SmartTableModule,
   
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    DocumentationDetailsComponent,
    DocumentsSummaryComponent,
    // AddAgentComponent,


    SmartTableComponent,
    
   
    
  ],
})
export class DocumentsModule { }
