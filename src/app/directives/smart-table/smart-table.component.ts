import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
// import * as _ from 'lodash';

@Component({
  selector: 'smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss', '../../pages/pages.component.css']
})
export class SmartTableComponent implements OnInit {
  @Input() data: any;
  @Input() settings: any;
  objectKeys = Object.keys;
  headings = null;
  columns = [];
  sortType = '';
  activeRow = -1;

  constructor(private cdr: ChangeDetectorRef, ) { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    console.log('Changes: ', changes);
    this.data = changes.data.currentValue;
    this.settings = changes.settings.currentValue;
    console.log('Data', this.data);
    this.setData();
  }

  ngAfterViewInit() {
    this.setData();
  }

  setData() {
    this.headings = this.data.headings;
    this.columns = this.data.columns
    console.log(this.headings);
    console.log(this.columns);
    this.cdr.detectChanges();
  }

  filterData(key) {
    let search = this.headings[key].value.toLowerCase().replace(/ /g, '');
    this.columns = this.data.columns.filter(column => {
      if (!search.length) return true;
      let value = column[key].value;
      if (search.includes('>') || search.includes('<') || search.includes('!')) {
        if (search.length == 1) return true;
        if (search[0] == '>') return value && value > search.split('>')[1]
        else if (search[0] == '<') return value && value < search.split('<')[1];
        else if (search[0] == '!') return value && value != search.split('!')[1];
      } else if (value && value.toString().toLowerCase().includes(search.toLowerCase())) return true;
      return false;
    });

    if (search.includes('>') || search.includes('<') || search.includes('!')) {
      if (search.includes('>')) this.sortColumn(key, 'asc')
      else this.sortColumn(key, 'desc')
    }
  }

  sortColumn(key, sortType?) {
    this.columns.sort((a, b) => {
      // console.log(typeof a[key].value, a[key].value, typeof b[key].value, b[key].value);
      if (typeof (a[key].value) == 'string' || typeof (b[key].value) == 'string') {
        let firstValue = a[key].value ? a[key].value.toLowerCase() : '';
        let secondValue = b[key].value ? b[key].value.toLowerCase() : '';
        if (firstValue < secondValue) //sort string ascending
          return -1
        if (firstValue > secondValue)
          return 1
        return 0
      } else {
        return a[key].value - b[key].value;
      }
    });

    if (sortType == 'desc' || this.sortType == 'desc') this.columns.reverse();
    this.sortType = this.sortType == 'desc' ? 'asc' : 'desc';
  }

  handleRowClick(column, index) {
    if (column.rowActions.click == 'selectRow') {
      this.activeRow = index;
    } else {
      column.rowActions.click()
    }
  }


  handleColDoubleClick(column, heading) {
    console.log('Column :', column);
    if (column[heading].colActions && column[heading].colActions.dblclick) {
      column[heading].colActions.dblclick()
    }
  }

}
