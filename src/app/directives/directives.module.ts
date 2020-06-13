import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';

import { AutoSuggestionComponent } from './auto-suggestion/auto-suggestion.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { AutoSuggetionInSideComponent } from './auto-suggetion-in-side/auto-suggetion-in-side.component';
import { DateTimePickerComponent } from './date-time-picker/date-time-picker.component';
import { MonthPickerComponent } from './month-picker/month-picker.component';
import { LazyForDirective } from './lazyFor.directive';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule, DateInputsModule,],
    exports: [
        CommonModule,
        FormsModule,
        AutoSuggestionComponent,
        SmartTableComponent,
        AutoSuggetionInSideComponent,
        DateTimePickerComponent,
        MonthPickerComponent,
        LazyForDirective
    ],
    declarations: [AutoSuggestionComponent, SmartTableComponent, AutoSuggetionInSideComponent,
        DateTimePickerComponent,
        MonthPickerComponent,LazyForDirective
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    providers: [],

})
export class DirectiveModule { }