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
import { PendingDocumentsComponent } from './pending-documents/pending-documents.component';
import { DatePipe } from '@angular/common';
import { ChangeHistoryComponent } from './change-history/change-history.component';
import { ImageViewerModule } from 'ng2-image-viewer';
//import { DocumentHistoryComponent } from './documentation-modals/document-history/document-history.component';

const PAGES_COMPONENTS = [
  DocumentsComponent,
];


@NgModule({
  imports: [
    DocumentsRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    ImageViewerModule
  ],
  providers: [DatePipe],
  declarations: [
    ...PAGES_COMPONENTS,

    DocumentationDetailsComponent,
    DocumentsSummaryComponent,
    PendingDocumentsComponent,
    ChangeHistoryComponent,
    //DocumentHistoryComponent,
  ],
})
export class DocumentsModule { }
