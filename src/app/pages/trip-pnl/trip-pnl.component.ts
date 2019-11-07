import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'trip-pnl',
  templateUrl: './trip-pnl.component.html',
  styleUrls: ['./trip-pnl.component.scss']
})
export class TripPnlComponent implements OnInit {

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 10));
  TripPNLData = [];
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
    private datePipe: DatePipe,
    public user: UserService,
    public api: ApiService) {

  }

  ngOnInit() {
  }

  getPnlSummary() {
    let startDate=this.common.dateFormatter(this.startDate);
    let endDate=this.common.dateFormatter(this.endDate);
    console.log('_________________________________=====+++++++++++++++_________________');

    if (!startDate && !endDate) {
      this.common.showError("Please Enter StartDate And Enddate");
    } else if (!startDate) {
      this.common.showError("Please Enter StartDate")
    } else if (!this.endDate) {
      this.common.showError("Please Enter EndDate");
    } else if (startDate > endDate) {
      this.common.showError("StartDate Should Be Less Then EndDate")
    } else {
      let params = {
        startDate: this.common.dateFormatter(startDate),
        endDate: this.common.dateFormatter(endDate)
      }
      this.common.loading++;
      this.api.post('TripsOperation/getPnlSummary', params)
        .subscribe(res => {
          console.log('Res:', res);
          this.common.loading--;
          if (!res['data']) {
            return;
          }
          this.TripPNLData = res['data'];
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
      columns: this.getColumns(this.TripPNLData, this.TripPNLData[0])
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


  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Trip Profit And Loss";
        let time = "Start Date:"+this.datePipe.transform(this.startDate, 'dd-MM-yyyy')+"  End Date:"+this.datePipe.transform(this.endDate, 'dd-MM-yyyy');
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], time);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCsv(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = "FoName:" + fodata['name'];
        let center_heading = "Report:" + "Trip Profit And Loss";
        let time = "Start Date:"+this.datePipe.transform(this.startDate, 'dd-MM-yyyy')+"  End Date:"+this.datePipe.transform(this.endDate, 'dd-MM-yyyy');
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, null, time);
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }

}
