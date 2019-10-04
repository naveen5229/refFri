import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'pending-challan',
  templateUrl: './pending-challan.component.html',
  styleUrls: ['./pending-challan.component.scss']
})
export class PendingChallanComponent implements OnInit {
  startDate = new Date();
  endDate = new Date();
  challanStatus = '-1';
  challan = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(public common: CommonService,
    public api: ApiService) { }

  ngOnInit() {
  }

  getPendingChallans() {
    let params = "fromTime=" + this.common.dateFormatter(this.startDate) + "&toTime=" + this.common.dateFormatter(this.endDate) + "&viewType=" + this.challanStatus;
    this.common.loading++;
    this.api.get('RcDetails/getPendingChallans?' + params)
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        // if (!res['data']){
        //   return;
        // } 
        this.clearAllTableData();
        this.challan = res['data'];
        this.setTable();
      },
        err => {
          this.common.loading--;
          this.common.showError(err);
        });

  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.challan[0]),
      columns: this.getColumns(this.challan, this.challan[0])
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

  getColumns(challanList, chHeadings) {
    let columns = [];
    challanList.map(item => {
      let column = {};
      for (let key in this.generateHeadings(chHeadings)) {
        if (key == "Action") {
          
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  clearAllTableData() {
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
