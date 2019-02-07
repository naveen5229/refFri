import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
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
  @Input() display: any;
  @Input() className: string;
  @Input() placeholder: string;
  @Input() preSelected: any;
  @Input() seperator: string;

  counter = 0;
  searchText = '';
  showSuggestions = false;
  suggestions = [];
  selectedSuggestion = null;
  displayType = 'string';

  constructor(public api: ApiService,
    private cdr: ChangeDetectorRef,
    public common: CommonService) {

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    console.log('URL:', this.url);
    console.log('URL:', this.display);
    if (this.preSelected) {
      this.selectSuggestion = this.preSelected;
      this.searchText = this.preSelected[this.display];
    }

    console.log('Is Array:', Array.isArray(this.display));
    if (Array.isArray(this.display)) {
      this.displayType = 'array';
    }
    this.cdr.detectChanges();
  }



  getSuggestions() {
    this.showSuggestions = true;
    let params = '?';
    if (this.url.includes('?')) {
      params = '&'
    }
    params += 'search=' + this.searchText;

    this.api.get(this.url + params)
      .subscribe(res => {
        console.log(res);
        this.suggestions = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  selectSuggestion(suggestion) {
    // this.searchText = suggestion[this.display];
    this.searchText = this.generateString(suggestion);
    this.selectedSuggestion = suggestion;
    this.showSuggestions = false;
    this.onSelected.emit(suggestion);
  }

  generateString(suggestion) {
    let displayText = '';
    if (this.displayType == 'array') {
      this.display.map((display, index) => {
        if (index != this.display.length - 1) {
          displayText += suggestion[display] + ' ' + this.seperator + ' ';
        } else {
          displayText += suggestion[display];
        }
      });
    } else {
      displayText = suggestion[this.display];
    }
    return displayText;
  }


}
