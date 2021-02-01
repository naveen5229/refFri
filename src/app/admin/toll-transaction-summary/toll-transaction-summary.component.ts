import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'toll-transaction-summary',
  templateUrl: './toll-transaction-summary.component.html',
  styleUrls: ['./toll-transaction-summary.component.scss']
})
export class TollTransactionSummaryComponent implements OnInit {
  table = null;
  dates = {
    startTime: this.common.dateFormatter(new Date()),
    endTime: this.common.dateFormatter(new Date()),
  }
  data = [];
  constructor(
    public router: Router,
    private modalservice: NgbModal,
    public common: CommonService,
    public api: ApiService,
    public user: UserService,
  ) {
    this.gettollTransactionSummary();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.gettollTransactionSummary();
  }
  getDate(time) {
    const activeModal = this.modalservice.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[time] = this.common.dateFormatter(data.time).split('')[0];
      console.log('Date:', this.dates[time]);
      // .split(' ')[0];
    });

  }
  setTable() {
    let headings = {
      regno: { title: 'Vehicle Number', placeholder: 'Vehicle Number' },
      transtime: { title: 'transit Time ', placeholder: 'Transit Time ' },
      amount: { title: 'amount', placeholder: 'Amount' },
      plaza_name: { title: 'plaza  ', placeholder: 'Plaza ' },
      txnid: { title: 'transaction id', placeholder: 'Transaction id' },

    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.data.map(summary => {

      let column = {

        regno: { value: summary.regno },
        transtime: { value: summary.transtime == null ? "-" : this.common.changeDateformat(summary.transtime) },
        amount: { value: summary.amount == null ? "-" : summary.amount },
        plaza_name: { value: summary.plaza_name == null ? "-" : summary.plaza_name },
        txnid: { value: summary.txnid == null ? "-" : summary.txnid },
        rowActions: {}
      };


      columns.push(column);
    });
    return columns;
  }

  gettollTransactionSummary() {
    let params = {
      startTime: this.dates.startTime,
      endTime: this.dates.endTime,
    }
    this.common.loading++;
    let response;
    this.api.post('Toll/getTollTxn', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

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
        let center_heading = "Toll Transaction Summary";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, null, '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCSV(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Toll Transaction Summary";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, null, '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
