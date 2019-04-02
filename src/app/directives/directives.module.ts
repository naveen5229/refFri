import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AutoSuggestionComponent } from './auto-suggestion/auto-suggestion.component';
import { SmartTableComponent } from './smart-table/smart-table.component';
import { AutoSuggetionInSideComponent } from './auto-suggetion-in-side/auto-suggetion-in-side.component';

@NgModule({
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    exports: [
        CommonModule,
        FormsModule,
        AutoSuggestionComponent,
        SmartTableComponent,
        AutoSuggetionInSideComponent
    ],
    declarations: [AutoSuggestionComponent, SmartTableComponent, AutoSuggetionInSideComponent],
})
export class DirectiveModule { }