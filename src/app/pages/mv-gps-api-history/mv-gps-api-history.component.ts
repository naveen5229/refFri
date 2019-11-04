import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'mv-gps-api-history',
  templateUrl: './mv-gps-api-history.component.html',
  styleUrls: ['./mv-gps-api-history.component.scss']
})
export class MvGpsApiHistoryComponent implements OnInit {
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  gpsApiHistory = [];
  constructor(public common: CommonService,
    public api: ApiService) {
    this.getGpsApiHistory();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }
  refresh() {
    this.getGpsApiHistory();
  }

  getGpsApiHistory() {
    this.common.loading++;
    this.api.get('GpsData/getGpsApiHistory')
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        this.resetTable();
        if (!res['data']) {
          this.common.showError("Data Not Found");
          return;
        }
        this.gpsApiHistory = res['data'] || [];
        this.setTable();
      },
        err => {
          this.common.loading--;
          this.common.showError(err);
        });

  }


  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.gpsApiHistory[0]),
      columns: this.getColumns(this.gpsApiHistory, this.gpsApiHistory[0])
    };
  }

  generateHeadings(keyObject) {
    let headings = {};
    for (var key in keyObject) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }


  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getColumns(historyList, headings) {
    let columns = [];
    historyList.map(item => {
      let column = {};
      for (let key in this.generateHeadings(headings)) {
        if (key == "Action") {
          column[key] = { value: "", action: null }
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }


  resetTable() {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
  }


}
