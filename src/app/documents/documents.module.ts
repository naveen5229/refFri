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
import { CrmVehicleDocumentionsComponent } from './crm-vehicle-documentions/crm-vehicle-documentions.component';


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
    SmartTableComponent,
    CrmVehicleDocumentionsComponent,
    
   
    
  ],
})
export class DocumentsModule { }
