import { NgModule } from '@angular/core';


import { ThemeModule } from '../../@theme/theme.module';
// import { DocumentDashboardComponent } from './dashboard.component';
import { DirectiveModule } from '../../directives/directives.module';
import { DocumentDashboardComponent } from './dashboard.component';

@NgModule({
    imports: [
        ThemeModule,
        DirectiveModule
    ],
    declarations: [
        // DocumentDashboardComponent,
    ],

})
export class DashboardModule { }
