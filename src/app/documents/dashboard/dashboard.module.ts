import { NgModule } from '@angular/core';


import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { DirectiveModule } from '../../directives/directives.module';

@NgModule({
    imports: [
        ThemeModule,
        Ng2SmartTableModule,
        DirectiveModule
    ],
    declarations: [
        DashboardComponent,
    ],
})
export class DashboardModule { }
