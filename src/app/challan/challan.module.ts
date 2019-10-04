import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ThemeModule } from '../@theme/theme.module';
import { DashboardModule } from '../documents/dashboard/dashboard.module';
import { DirectiveModule } from '../directives/directives.module';
import { ImageViewerModule } from 'ng2-image-viewer';
import { ChartModule } from 'angular2-chartjs';
import { ResizableModule } from 'angular-resizable-element';
import { ChallanRoutingModule } from './challan-routing.module';
import { ChallanComponent } from './challan-component';
import { PendingChallanComponent } from './pending-challan/pending-challan.component';

const PAGES_COMPONENTS = [
  ChallanComponent,
];
@NgModule({

  imports: [
    ChallanRoutingModule,
    ThemeModule,
    DashboardModule,
    DirectiveModule,
    ImageViewerModule,
    ChartModule,
    ResizableModule
  ],
  providers: [DatePipe],
  declarations: [
    ...PAGES_COMPONENTS,
    PendingChallanComponent,
  
  ],
  entryComponents: [
  
  ],
  exports: [
 

  ],
})
export class ChallanModule { }
