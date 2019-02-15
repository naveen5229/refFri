import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';
// import * as _ from 'lodash';

@Component({
  selector: 'smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent implements OnInit {
  @Input() data: any;
  @Input() settings: any;
  objectKeys = Object.keys;
  headings = null;
  columns = [];

  constructor(private cdr: ChangeDetectorRef, ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.headings = this.data.headings;
    this.columns = this.data.columns
    console.log(this.headings);
    console.log(this.columns);
    this.cdr.detectChanges();
  }

  filterData(key) {
    console.log('Data');
    this.headings[key].value = this.headings[key].value.toUpperCase();
    this.columns = this.data.columns.filter(column => {
      if (column[key].value && column[key].value.toString().toLowerCase().includes(this.headings[key].value.toLowerCase())) {
        return true;
      }
      return false;
    });
  }

  sortColumn(type, key) {
    console.log(type, key);
    this.columns.sort((a, b) => {
      console.log(typeof a[key].value, a[key].value, typeof b[key].value, b[key].value);
      if (typeof(a[key].value) == 'string' || typeof(b[key].value) == 'string') {
        let firstValue = a[key].value ?  a[key].value.toLowerCase() : '';
        let secondValue = b[key].value ?  b[key].value.toLowerCase() : '';
        if (firstValue < secondValue) //sort string ascending
          return -1
        if (firstValue > secondValue)
          return 1
        return 0
      } else {
        return a[key].value - b[key].value;
      }
    });
    console.log('Columns: ', this.columns);
    if (type == 'desc') this.columns.reverse();
  }

}
