import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { CardMappingComponent } from './card-mapping/card-mapping.component';

@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    DashboardComponent,
    CardMappingComponent,
  ],
})
export class DashboardModule { }
