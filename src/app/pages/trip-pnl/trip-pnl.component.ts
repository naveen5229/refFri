import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'trip-pnl',
  templateUrl: './trip-pnl.component.html',
  styleUrls: ['./trip-pnl.component.scss']
})
export class TripPnlComponent implements OnInit {

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
  TripPNLData=[];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  }

  constructor(public common: CommonService,
    public api: ApiService) {

  }

  ngOnInit() {
  }

  getPnlSummary() {
    console.log('_________________________________=====+++++++++++++++_________________');

     if(!this.startDate && !this.endDate){
      this.common.showError("Please Enter StartDate And Enddate");
    }else if(!this.startDate){
       this.common.showError("Please Enter StartDate")
    }else if(!this.endDate){
      this.common.showError("Please Enter EndDate");
    }else if(this.startDate>this.endDate){
      this.common.showError("StartDate Should Be Less Then EndDate")
    }else{
      let params = {
        startDate: this.common.dateFormatter(this.startDate) ,
        endDate: this.common.dateFormatter(this.endDate)
      }
      this.common.loading++;
      this.api.post('TripsOperation/getPnlSummary', params)
        .subscribe(res => {
          console.log('Res:', res);
          this.common.loading--;
          if (!res['data']) {
            return;
          }
          this.TripPNLData=res['data'];
          this.clearAllTableData();
          this.setTable();
        },
          err => {
            this.common.loading--;
            this.common.showError(err);
          });
    }
   
  }
  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.TripPNLData[0]),
      columns: this.getColumns(this.TripPNLData,this.TripPNLData[0])
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
          column[key] = { value: item[key], class: 'black', action: '' };
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
    }
  }

}
