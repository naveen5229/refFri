import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'auto-suggestion',
  templateUrl: './auto-suggestion.component.html',
  styleUrls: ['./auto-suggestion.component.scss']
})
export class AutoSuggestionComponent implements OnInit {
  @Output() onSelected = new EventEmitter();
  @Input() url: string;
  @Input() display: string;
  @Input() className: string;
  @Input() placeholder: string;

  counter = 0;
  searchText = '';
  showSuggestions = false;
  suggestions = [];
  selectedSuggestion = null;

  constructor(public api: ApiService, public common: CommonService) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('URL:', this.url);
    console.log('URL:', this.display);

  }



  getSuggestions() {
    this.showSuggestions = true;
    let params = 'search=' + this.searchText;
    this.api.get(this.url + '?' + params)
      .subscribe(res => {
        console.log(res);
        this.suggestions = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  selectSuggestion(suggestion) {
    this.searchText = suggestion[this.display];
    this.selectedSuggestion = suggestion;
    this.showSuggestions = false;
    this.onSelected.emit(suggestion);
  }


}
