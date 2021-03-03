import { Component, OnInit } from "@angular/core";
import { ApiService } from "../../services/api.service";
import { CommonService } from "../../services/common.service";


@Component({
  selector: 'tickets-report',
  templateUrl: './tickets-report.component.html',
  styleUrls: ['./tickets-report.component.scss']
})
export class TicketsReportComponent implements OnInit {

  headings = [];
  valobj = {};
  alertDropDownData = [];
  reportFilterData = {
    id: '1000',
    startTime: new Date(),
    endTime: new Date()
  }
  smartTableData = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true,
      pagination: true
    }
  };

  constructor(private api: ApiService, private common: CommonService) {
    this.reportFilterData.startTime = new Date();
    this.reportFilterData.endTime = new Date();
    this.getAlertDropData();

  }
  ngOnInit() { }

  getAlertDropData() {
    ++this.common.loading;
    this.api.get('Suggestion/getAllFoIssueTypes')
      .subscribe(res => {
        --this.common.loading;
        console.log(res);
        this.alertDropDownData = res['data']
      }, err => {
        --this.common.loading;
        console.error(err);
      })
  }

  submit() {
    ++this.common.loading;
    let params = {
      foIssueTypeId: this.reportFilterData.id,
      startTime: this.common.dateFormatter(this.reportFilterData.startTime),
      endTime: this.common.dateFormatter(this.reportFilterData.endTime)
    }
    console.log('params are :', params);

    this.api.get(`Tickets/getAllTicketLogs?foIssueTypeId=${params.foIssueTypeId}&startTime=${params.startTime}&endTime=${params.endTime}`)
      .subscribe(res => {
        --this.common.loading;
        this.smartTableData = res['data']
        console.log("smart table data: ", this.smartTableData);
        this.gettingTableHeader(this.smartTableData);
      }, err => {
        --this.common.loading;
        console.error(err);
      }
      )
  }

  gettingTableHeader(tableData) {

    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true,
        pagination: true
      },

    };

    let first_rec = tableData[0];
    for (var key in first_rec) {
      if (key.charAt(0) != "_") {
        this.headings.push(key);
        let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
        this.table.data.headings[key] = headerObj;
      }
    }

    this.table.data.columns = this.getTableColumns(tableData);
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  getTableColumns(tableData) {
    // this.headings.push('Action');
    // this.table.data.headings['Action'] = { title: 'Action', placeholder: 'Action' };
    this.valobj = {};
    let columns = [];
    tableData.map(tbldt => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: tbldt[this.headings[i]], class: 'black', action: '' };
      }
      columns.push(this.valobj);
    });
    return columns;
  }


}