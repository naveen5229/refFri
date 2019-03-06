import { NgModule } from '@angular/core';


import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { DirectiveModule } from '../../directives/directives.module';
// import { AddDriverComponent}  from '../add-driver/add-driver.component';
@NgModule({
    imports: [
        ThemeModule,
        DirectiveModule
    ],
    declarations: [
        DashboardComponent,
        // AddDriverComponent
        
    ],
})
export class DashboardModule { }
