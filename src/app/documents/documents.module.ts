import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DocumentsRoutingModule } from './documents-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DocumentsComponent } from './documents.components';
import { DocumentationDetailsComponent } from './documentation-details/documentation-details.component';

const PAGES_COMPONENTS = [
  DocumentsComponent,
];


@NgModule({
  imports: [
    DocumentsRoutingModule,
    ThemeModule,
    DashboardModule,
  ],
  declarations: [
    ...PAGES_COMPONENTS,
    DocumentationDetailsComponent,

  ],
})
export class DocumentsModule { }
