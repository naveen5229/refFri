import { Component, OnInit, EventEmitter, ChangeDetectionStrategy, Input, Output, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'smart-table',
  templateUrl: './smart-table.component.html',
  styleUrls: ['./smart-table.component.scss', '../../pages/pages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SmartTableComponent implements OnInit {
  @Input() data: any;
  @Input() settings: any;
  @Output() action = new EventEmitter();
  objectKeys = Object.keys;
  headings = null;
  columns = [];
  sortType = '';
  activeRow = -1;
  activeRows = [];
  customPagevalue = true;
  search = {
    key: '',
    txt: ''
  };

  pages = {
    count: 0,
    active: 1,
    limit: 200,
  };
  isTableHide = false;
  edit = {
    row: -1,
    column: null,
    heading: ''
  };
  filtertimer: any;
  constructor(private cdr: ChangeDetectorRef,
    public common: CommonService) { }

  ngOnInit() {
  }

  ngOnChanges(changes) {
    console.log('Changes: ', changes);
    this.data = changes.data.currentValue;
    if (changes.settings)
      this.settings = changes.settings.currentValue;
    console.log('Data', this.data);
    this.setData();
    this.activeRow = -1;
  }

  ngAfterViewInit() {
    this.setData();
  }

  setData() {
    this.data.columns.map((column, index) => column._smartId = index);
    this.headings = this.data.headings;
    if (this.settings.pagination) {
      this.handlePagination(this.pages.active);
      this.pages.count = Math.floor(this.data.columns.length / this.pages.limit);
      if (this.data.columns.length % this.pages.limit) {
        this.pages.count++;
      }
    } else {
      this.columns = this.data.columns
    }

    this.cdr.detectChanges();
    if (this.search.txt && this.search.key) {
      this.headings[this.search.key].value = this.search.txt;
      this.filterData(this.search.key)
    };
  }

  filterData(key) {
    clearTimeout(this.filtertimer);
    this.filtertimer = setTimeout(() => {
      console.log('filterData:', key, this.headings[key].value, this.data.columns.length);
      let search = this.headings[key].value.toLowerCase();
      this.search = { key, txt: search };
      console.log('--', this.headings[key].value, search);
      this.columns = [];
      if (!search.length) {
        if (this.settings.pagination) {
          this.columns = this.data.columns.slice(0, this.pages.limit);
        } else {
          this.columns = this.data.columns;
        }
      } else {
        for (let i = 0; i < this.data.columns.length; i++) {
          let value = this.data.columns[i][key].value;
          if (search.includes('>') || search.includes('<') || search.includes('!')) {
            if (search.length == 1) {
              this.columns.push(this.data.columns[i]);
            } else if (search[0] == '>' && value && value > search.split('>')[1]) {
              this.columns.push(this.data.columns[i]);
            } else if (search[0] == '<' && value && value < search.split('<')[1]) {
              this.columns.push(this.data.columns[i]);
            } else if (search[0] == '!' && value && value != search.split('!')[1]) {
              this.columns.push(this.data.columns[i]);
            }
          } else if (value && value.toString().toLowerCase().includes(search.toLowerCase())) {
            this.columns.push(this.data.columns[i]);
          }
          if (this.settings.pagination && this.columns.length >= this.pages.limit) {
            break;
          }

        }
      }

      if (search.includes('>') || search.includes('<') || search.includes('!')) {
        if (search.includes('>')) this.sortColumn(key, 'asc')
        else this.sortColumn(key, 'desc')
      }
      this.cdr.detectChanges();
    }, this.data.columns.length > 150 ? 500 : 300);

  }

  sortColumn(key, sortType?) {
    let counts = {
      object: 0,
      string: 0,
      number: 0,
      time: 0,
      date: 0
    };

    const numberPattern = new RegExp(/^[+-]?\d+(\.\d+)?$/);
    // const numberPattern = new RegExp(/^([0-9])*(\.)([0-9])*$/);
    const datePattern = new RegExp(/([0-2][0-9]|(3)[0-1])( |\/|-|)([a-zA-Z]{3})( |\/|-|)(([0-1][0-9])|([2][0-3]){2})(:)([0-5][0-9])$/);
    const timePattern = new RegExp(/^([0-9])*(\:)([0-9])*$/);

    this.columns.forEach(column => {
      let value = column[key].value
      if (datePattern.test(value)) counts.date++
      else if (numberPattern.test(value)) counts.number++;
      else if (timePattern.test(value)) counts.time++;
      else if (typeof value == 'string') counts.string++;
      else counts.object++;
    });


    console.info('Sort Counts:', counts);
    this.columns.sort((a, b) => {
      if (this.headings[key].type === 'date') {
        let firstDate = a[key].value ? this.common.dateFormatter(a[key].value) : 0;
        let secondDate = b[key].value ? this.common.dateFormatter(b[key].value) : 0;
        return firstDate > secondDate ? 1 : -1;
      } else if (counts.time > counts.number) {
        let firstValue = a[key].value ? parseFloat(a[key].value.replace(':', '.')) : 0;
        let secondValue = b[key].value ? parseFloat(b[key].value.replace(':', '.')) : 0;
        return firstValue - secondValue;
      } else if (!counts.number) {
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
    if (column.rowActions.click == 'selectRow') this.activeRow = column._smartId;
    else if (column.rowActions.click == 'selectMultiRow') {
      if (this.activeRows.indexOf(column._smartId) === -1) {
        this.activeRows.push(column._smartId);
      } else {
        this.activeRows.splice(this.activeRows.indexOf(column._smartId), 1);
      }
    } else column.rowActions.click();
  }

  isItActive(column) {
    if (column.rowActions) {
      if (column.rowActions.click == 'selectRow' && column._smartId === this.activeRow)
        return true;
      else if (column.rowActions.click == 'selectMultiRow' && this.activeRows.indexOf(column._smartId) !== -1)
        return true;
    }
    return false;
  }


  handleColDoubleClick(column, heading) {
    console.log('Column :', column);
    if (column[heading].colActions && column[heading].colActions.dblclick) {
      column[heading].colActions.dblclick()
    }
  }

  handleMouseHover(column, heading) {
    if (column[heading] && column[heading].colActions && column[heading].colActions.mouseover) {
      column[heading].colActions.mouseover()
    }
  }

  /**
   * 
   * @param column Previous Column 
   * @param heading Column key
   */
  handleMouseOut(column, heading) {
    if (column[heading] && column[heading].colActions && column[heading].colActions.mouseout) {
      column[heading].colActions.mouseout()
    }
  }

  /**
   * @param page Clicked Page
   */
  handlePagination(page) {
    this.pages.active = page;
    let startIndex = this.pages.limit * (this.pages.active - 1);
    let lastIndex = (this.pages.limit * this.pages.active);
    this.columns = this.data.columns.slice(startIndex, lastIndex);
  }

  customPage() {
    this.common.loading++;
    this.isTableHide = true;
    this.setData();
    setTimeout(() => {
      this.common.loading--;
      this.isTableHide = false;
    }, 100);
  }

  /**
   * @param column Table Column
   * @param heading Table Heading Name
   * @param rowIndex Clicked row index
   */
  handleColumnClick(column: any, heading: string, rowIndex: number) {
    if (column[heading].isCheckbox || column[heading].isAutoSuggestion) return;
    if (column[heading].action) column[heading].action();
    else if (this.settings.editable) {
      this.edit.row = rowIndex;
      this.edit.column = JSON.parse(JSON.stringify(column));
      this.edit.heading = heading;
    }
  }

  /**
   * @param column Current Value
   */
  resetColumn(column?) {
    this.columns[this.edit.row] = column || this.edit.column;
    this.edit.row = -1;
    this.edit.column = null;
    this.edit.heading = '';
  }

  /**
   * @param editedColumn Current Values of column
   */
  saveEdit(editedColumn: any) {
    this.settings.editableAction({ current: editedColumn, old: this.edit.column });
    this.resetColumn(editedColumn);
  }

  /**
   * Hanle row selection
   * @param event - Checkbox change event
   * @param action - Action to perform on checkbox click
   */
  handleCheckboxChange(event, action) {
    action(event.target.checked);
    event.stopPropagation();
  }

  isEventBinding(column, property, event) {
    column[property] && column[property](event);
  }

  isPropertyBinding(column, property, byDefault = '') {
    if (column[property]) return column[property];
    return byDefault;
  }


  jrxActionHandler(event, actionLevel: 'row' | 'col' | 'icon', actionType: 'click' | 'dblclick' | 'mouseover' | 'mouseout',
    column: any, heading?, index?, icon?) {
    if (actionLevel === 'row') {
      if (this.settings.selectRow) {
        this.activeRow = column._smartId
      } else if (this.settings.selectMultiRow) {
        if (this.activeRows.indexOf(column._smartId) === -1) {
          this.activeRows.push(column._smartId);
        } else {
          this.activeRows.splice(this.activeRows.indexOf(column._smartId), 1);
        }
      }
    }

    event.stopPropagation();
    if (actionType == 'mouseover' || actionType == 'mouseout') {
      return;
    }

    if (this.settings.oneAction) {
      this.action.emit({
        actionLevel,
        actionType,
        column,
        heading,
        index
      });
      return
    }
    if (actionLevel === 'row') {
      this.jrxRowActions(actionType, column);
    } else if (actionLevel === 'col') {
      this.jrxColumActions(actionType, column, heading, index);
    } else if (actionLevel === 'icon') {
      icon.action && icon.action();
    }

  }

  jrxRowActions(actionType, column: any) {
    if (actionType === 'click') {
      if (column.rowActions && column.rowActions.click) {
        column.rowActions.click();
      }
    } else if (actionType === 'dblclick') {
      if (column.rowActions && column.rowActions.dblclick) {
        column.rowActions.dblclick()
      }
    }
  }

  jrxColumActions(actionType, column, heading, index) {
    if (actionType === 'click') {
      this.handleColumnClick(column, heading, index);
    } else if (actionType === 'dblclick') {
      this.handleColDoubleClick(column, heading)
    } else if (actionType === 'mouseover') {
      this.handleMouseHover(column, heading);
    } else if (actionType === 'mouseout') {
      this.handleMouseOut(column, heading)
    }
  }

}
