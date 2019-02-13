import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AutoSuggestionComponent } from './auto-suggestion/auto-suggestion.component';

@NgModule({
    imports: [CommonModule, FormsModule],
    exports: [
        CommonModule,
        FormsModule,
        AutoSuggestionComponent
    ],
    declarations: [AutoSuggestionComponent],
})
export class DirectiveModule { }