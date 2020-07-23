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
  canvas: any;

  constructor(private cdr: ChangeDetectorRef,) {

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
    this.suggestions = JSON.parse(JSON.stringify(this.data)).slice(0, 50);
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
      this.suggestions = JSON.parse(JSON.stringify(this.data)).slice(0, 50);
      return;
    }

    this.suggestions = [];
    let i = 0;
    while (this.suggestions.length < 50 && i < this.data.length) {
      let suggestion = this.data[i];
      let txt = suggestion[this.display].replace(/\s|\.|_|-/g, '').toLowerCase();
      if (txt.includes(searchText.replace(/\s|\.|_|-/g, '').toLowerCase())) this.suggestions.push(suggestion);
      i++;
    }

    return;
  }

  selectSuggestion(suggestion) {
    this.selectedSuggestion = suggestion;
    this.select.emit(suggestion);
    this.activeSuggestion = -1;
    document.getElementById(this.targetId)['value'] = suggestion[this.display];
  }

  handleKeyDown(event) {
    const key = event.key.toLowerCase();
    if (key == 'arrowdown') {
      if (this.activeSuggestion < this.suggestions.length - 1) this.activeSuggestion++;
      else if (this.activeSuggestion > this.suggestions.length - 1) this.activeSuggestion = 0;
      document.getElementById('TJR-auto-suggestion-container').scroll(0, this.calculateScrollY());
      event.preventDefault();
    } else if (key == 'arrowup') {
      if (this.activeSuggestion != 0) this.activeSuggestion--;
      document.getElementById('TJR-auto-suggestion-container').scroll(0, this.calculateScrollY());
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
          if (!suggestion.length) {
            this.selectSuggestion(this.suggestions[0]);
          } else {
            this.selectSuggestion(suggestion[0]);
          }
        }
      }
    }
  }

  calculateScrollY() {
    let scrollY = 0;
    let eles = document.querySelectorAll('.suggestion-option');
    for (let i = 1; i < this.activeSuggestion; i++) {
      scrollY += eles[i]['offsetHeight'] + 1.5;
    }
    return scrollY;
  }


  getTextWidth(text, font) {
    this.canvas = this.canvas || (this.canvas = document.createElement("canvas"));
    let context = this.canvas.getContext("2d");
    context.font = font;
    var metrics = context.measureText(text);
    return metrics.width;
  }


}
