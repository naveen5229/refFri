import { Component, OnInit, Output, Input, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'auto-suggetion-in-side',
  templateUrl: './auto-suggetion-in-side.component.html',
  styleUrls: ['./auto-suggetion-in-side.component.scss']
})
export class AutoSuggetionInSideComponent implements OnInit {

  @Output() select = new EventEmitter();
  @Input() display: any;
  @Input() seperator: string;
  @Input() data: any;
  @Input() targetId: string;

  suggestions = [];
  selectedSuggestion = null;
  displayType = 'string';
  activeSuggestion = -1;

  constructor(private cdr: ChangeDetectorRef, ) {

  }

  ngOnChanges(changes) {
    if (changes.data) {
      this.data = changes.data.currentValue;
    }
    if (changes.display) {
      this.display = changes.display.currentValue;
    }
    if (changes.seperator) {
      this.seperator = changes.seperator.currentValue;
    }
    if (changes.targetId) {
      this.targetId = changes.targetId.currentValue;
    }
    this.initialize();
  }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.initialize();
  }

  initialize() {
    if (Array.isArray(this.display)) this.displayType = 'array';
    this.suggestions = this.data;
    this.activeSuggestion = -1;
    this.cdr.detectChanges();
    setTimeout(this.handleTargetId.bind(this), 500);
  }

  handleTargetId() {
    let ele = document.getElementById(this.targetId);
    if (ele) {
      ele.oninput = () => this.filterData(document.getElementById(this.targetId)['value']);
      ele.onkeydown = this.handleKeyDown.bind(this);
    }

  }

  filterData(searchText) {
    if (!searchText) {
      this.suggestions = JSON.parse(JSON.stringify(this.data));
      this.suggestions.splice(10, this.suggestions.length - 11);
      return;
    }
    this.suggestions = this.data.filter(suggestion => {
      return suggestion[this.display].toLowerCase().includes(searchText.toLowerCase());
    });
    this.suggestions.splice(10, this.suggestions.length - 11);
    return;
  }

  selectSuggestion(suggestion) {
    this.selectedSuggestion = suggestion;
    this.select.emit(suggestion);
    this.activeSuggestion = -1;
    document.getElementById(this.targetId)['value'] = suggestion[this.display];
  }

  handleKeyDown(event) {
    // console.log('Event:', event);
    const key = event.key.toLowerCase();
    if (key == 'arrowdown') {
      if (this.activeSuggestion < this.suggestions.length - 1) this.activeSuggestion++;
      else if (this.activeSuggestion > this.suggestions.length - 1) this.activeSuggestion = 0;
      document.getElementById('TJR-auto-suggestion-container').scroll(0, (this.activeSuggestion - 3) * 4.5 - (this.activeSuggestion > 11 ? (this.activeSuggestion - 13) * 0.5 : 0));
      event.preventDefault();
    } else if (key == 'arrowup') {
      if (this.activeSuggestion != 0) this.activeSuggestion--;
      document.getElementById('TJR-auto-suggestion-container').scroll(0, (this.activeSuggestion - 3) * 4.5 - (this.activeSuggestion > 11 ? (this.activeSuggestion - 13) * 0.5 : 0));
      event.preventDefault();
    } else if (key == 'enter' || key == 'tab') {
      if (this.activeSuggestion !== -1) {
        this.selectSuggestion(this.suggestions[this.activeSuggestion]);
      } else {


        let value = document.getElementById(this.targetId)['value'];
        if (!value) {
          this.selectSuggestion(this.suggestions[0]);
        } else {
          let suggestion = this.data.filter(s => s[this.display].toLowerCase() === value.toLowerCase());
          console.log(suggestion);
          if (!suggestion.length) {
            this.selectSuggestion(this.suggestions[0]);
          } else {
            this.selectSuggestion(suggestion[0]);
          }
       }



      }
    }
  }


}
