import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AutoSuggestionComponent } from './auto-suggestion/auto-suggestion.component';
import { SmartTableComponent } from './smart-table/smart-table.component';

@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [
        CommonModule,
        FormsModule,
        AutoSuggestionComponent,
        SmartTableComponent
    ],
    declarations: [AutoSuggestionComponent, SmartTableComponent],
})
export class DirectiveModule { }