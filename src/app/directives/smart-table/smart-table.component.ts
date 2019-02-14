import { Component, OnInit, EventEmitter, Output, Input, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss']
})
export class SmartTableComponent implements OnInit {
  @Input() data: any;
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

}
