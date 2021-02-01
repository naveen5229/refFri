import { Component, OnInit } from '@angular/core';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router'
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehiclewise-tolltransaction',
  templateUrl: './vehiclewise-tolltransaction.component.html',
  styleUrls: ['./vehiclewise-tolltransaction.component.scss']
})
export class VehiclewiseTolltransactionComponent implements OnInit {
  dates = {
    start: this.common.dateFormatter(new Date()),
    end: this.common.dateFormatter(new Date()),
  }
  vehicle_id = null;
  data = [];
  table = null;
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
  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalservice.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.dates);
    });
  }
  selectVehicle(user) {
    this.vehicle_id = user.id;

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
        let center_heading = "vehicle Wise Toll Transaction Summary";
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
        let center_heading = "vehicle Wise Toll Transaction Summary";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, null, '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  gettollTransactionSummary() {
    let params = {
      vehicle_id: this.vehicle_id,
      startDate: this.dates.start,
      endDate: this.dates.end,
    }
    this.common.loading++;
    let response;
    this.api.post('Toll/getVehicleWiseTollTxn', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];

        this.table = this.setTable();
        // this.table = this.setTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }

  setTable() {
    let headings = {
      transtime: { title: 'Transaction Time', placeholder: 'Transaction Time' },
      plaza_name: { title: 'TOll Plaza', placeholder: '	Toll Plaza' },
      amount: { title: 'amount', placeholder: 'Amount' },

    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "auto"
      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.data.map(req => {
      let column = {
        transtime: { value: req.transtime == null ? "-" : this.common.changeDateformat(req.transtime) },
        plaza_name: { value: req.plaza_name },
        amount: { value: req.amount == null ? "-" : req.amount },



      };
      columns.push(column);
    });
    return columns;
  }
}
