import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'tyre-summary-details',
  templateUrl: './tyre-summary-details.component.html',
  styleUrls: ['./tyre-summary-details.component.scss']
})
export class TyreSummaryDetailsComponent implements OnInit {

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 7));
  tyre = {
    tyreSummary: [],
    tyrePendingCount: [],
  }
  tables = {
    tyreSummary: {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    },
    tyrePendingCount: {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    }
  };
  typeListId=-1;

  constructor(public common:CommonService,
    public api:ApiService) { }

  ngOnInit() {
  }

  getTyreSummary() {
    if(!this.startDate && !this.endDate){
      this.common.showError("Please Enter StartDate And Enddate");
    }else if(!this.startDate){
       this.common.showError("Please Enter StartDate")
    }else if(!this.endDate){
      this.common.showError("Please Enter EndDate");
    }else if(this.startDate>this.endDate){
      this.common.showError("StartDate Should Be Less Then EndDate")
    }else{
    this.common.loading++;
    let params="mapped="+this.typeListId+"&startDate="+this.common.dateFormatter(this.startDate)+"&endDate="+this.common.dateFormatter(this.endDate);
    this.api.get('tyres/getTyreInventry?' + params)
      .subscribe(res => {
        console.log('Res:', res);
        this.common.loading--;
        if (!res['data']) {
          return;
        }
        this.clearAllTableData();
        this.tyre.tyreSummary = res['data']['Summary'];
        console.log("tyres", this.tyre.tyreSummary);
        this.tyre.tyrePendingCount = res['data']['Result']
        this.setTable('tyreSummary');
        this.setTable('tyrePendingCount');
      },
        err => {
          this.common.loading--;
          this.common.showError(err);
        });
      }
  }

  setTable(type: 'tyreSummary' | 'tyrePendingCount') {
    this.tables[type].data = {
      headings: this.generateHeadings(type == 'tyreSummary' ? this.tyre.tyreSummary[0] : this.tyre.tyrePendingCount[0]),
      columns: this.getColumns(type == 'tyreSummary' ? this.tyre.tyreSummary : this.tyre.tyrePendingCount, type == 'tyreSummary' ? this.tyre.tyreSummary[0] : this.tyre.tyrePendingCount[0],)
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

  getColumns(list, type) {
    let columns = [];
    list.map(item => {
      let column = {};
      for (let key in this.generateHeadings(type)) {
        if (key == "Tyre Num") {
          column[key] = { value: item[key], class: 'text-blue', action:'' };
        } else {
          column[key] = { value: item[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  clearAllTableData() {
    this.tables = {
      tyreSummary: {
        data: {
          headings: {},
          columns: []
        },
        settings: {
          hideHeader: true
        }
      },
      tyrePendingCount: {
        data: {
          headings: {},
          columns: []
        },
        settings: {
          hideHeader: true
        }
      }
    };

  }


}
