import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'auto-suggestion',
  templateUrl: './auto-suggestion.component.html',
  styleUrls: ['./auto-suggestion.component.scss']
})
export class AutoSuggestionComponent implements OnInit {

  @Output() onSelected = new EventEmitter();
  @Output() noDataFound = new EventEmitter();
  @Output() onChange = new EventEmitter();

  @Input() url: string;
  @Input() display: any;
  @Input() className: string;
  @Input() placeholder: string;
  @Input() preSelected: any;
  @Input() seperator: string;
  @Input() data: any;
  @Input() inputId: string;
  @Input() name: string;
  @Input() parentForm: FormGroup;
  @Input() controlName: string;
  @Input() apiHitLimit: Number;
  @Input() isNoDataFoundEmit: boolean;
  @Input() isMultiSelect: boolean;
  counter = 0;
  searchText = '';
  showSuggestions = false;
  suggestions = [];
  selectedSuggestion = null;
  displayType = 'string';
  searchForm = null;
  activeSuggestion = -1;
  selectedSuggestions = [];

  constructor(public api: ApiService,
    private cdr: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    public common: CommonService) {

  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });
  }

  ngAfterViewInit() {
    console.log('URL:', this.url);
    console.log('URL:', this.display);
    if (this.preSelected) this.handlePreSelection();

    console.log('Is Array:', Array.isArray(this.display));
    if (Array.isArray(this.display)) {
      this.displayType = 'array';
    }
    console.log('Data:', this.data);
    console.log('Parent Form: ', this.parentForm);
    if (this.parentForm) {
      this.searchForm = this.parentForm;
    }
    this.cdr.detectChanges();

  }

  ngOnChanges(changes) {
    console.log("--------------------+++++++++", changes);
    if (changes.preSelected) {
      this.preSelected = changes.preSelected.currentValue;
      this.handlePreSelection();
    }

  }

  handlePreSelection() {
    console.log('Preselected:');
    this.selectedSuggestion = this.preSelected;
    if (typeof (this.display) != 'object')
      this.searchText = this.preSelected[this.display];
    else {
      let index = 0;
      for (const dis of this.display) {
        this.searchText += (index != 0 ? (" " + this.seperator + " ") : " ") + this.preSelected[dis];
        index++;
      }
    }
  }

  getSuggestions() {
    console.log("apiHitLimit", this.apiHitLimit, this.searchText.length);
    this.onChange.emit(this.searchText);
    this.apiHitLimit = this.apiHitLimit ? this.apiHitLimit : 3;

    this.showSuggestions = true;
    if (this.data) {
      this.suggestions = this.data.filter(data => data[this.display].toLowerCase().includes(this.searchText.toLowerCase()));
      this.suggestions.splice(10, this.suggestions.length - 1);
      return;
    }
    if (this.searchText.length < this.apiHitLimit) return;
    let params = '?';
    console.log(this.url, typeof this.url);
    if (this.url.includes('?')) {
      params = '&'
    }
    params += 'search=' + this.searchText;
    console.log('Params: ', params);
    this.api.get(this.url + params)
      .subscribe(res => {
        console.log(res);
        this.suggestions = res['data'];
        if (this.isNoDataFoundEmit && !this.suggestions.length) this.noDataFound.emit({ search: this.searchText });
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  selectSuggestion(suggestion) {
    // this.searchText = suggestion[this.display];
    if (this.isMultiSelect) {
      this.selectedSuggestions.push(suggestion);
      this.onSelected.emit(this.selectedSuggestions);
      this.searchText = '';
    } else {
      this.selectedSuggestion = suggestion;
      this.onSelected.emit(suggestion);
      this.searchText = this.generateString(suggestion);
    }

    this.showSuggestions = false;
    this.activeSuggestion = -1;
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

  handleKeyDown(event) {
    // console.log('Event:', event);
    const key = event.key.toLowerCase();
    if (!this.showSuggestions) return;
    if (key == 'arrowdown') {
      if (this.activeSuggestion != this.suggestions.length - 1) this.activeSuggestion++;
      else this.activeSuggestion = 0;
      event.preventDefault();
    } else if (key == 'arrowup') {
      if (this.activeSuggestion != 0) this.activeSuggestion--;
      else this.activeSuggestion = this.suggestions.length - 1;
      event.preventDefault();
    } else if (key == 'enter' || key == 'tab') {
      if (this.activeSuggestion !== -1) {
        this.selectSuggestion(this.suggestions[this.activeSuggestion]);
      } else {
        this.selectSuggestion(this.suggestions[0]);
      }
    }


  }


}
