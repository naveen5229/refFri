import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'payments-made',
  templateUrl: './payments-made.component.html',
  styleUrls: ['./payments-made.component.scss']
})
export class PaymentsMadeComponent implements OnInit {
  data = [];
  total = 0;
  userId = this.user._details.id;
  dates = {
    start: null,
    end: null,
  }
  table = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    let today = new Date();
    this.dates.start = this.common.dateFormatter1(new Date(today.setDate(today.getDate() - 30)));
    this.dates.end = this.common.dateFormatter1(new Date());
    this.getPaymentMade();
    this.common.refresh = this.refresh.bind(this);
    //this.getPaymentMade();
  }

  ngOnInit() {
  }

  refresh(){
    this.getPaymentMade();
  }
  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (date == 'start') {
        this.dates.start = this.common.dateFormatter(data.date).split(' ')[0];
      }
      if (date == 'end') {
        this.dates.end = this.common.dateFormatter(data.date).split(' ')[0];
      }


    });
  }
  getPaymentMade() {


    let params = "aduserid=" + this.user._details.id + "&mobileno=" + this.user._details.fo_mobileno + "&startdate=" + this.dates.start + "&enddate=" + this.dates.end;

    this.common.loading++;
    let response;
    this.api.walle8Get('PaymentApi/FoPaymentsView.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.data = res['data'];
        this.table = this.setTable();
        for (let i = 0; i < this.data.length; i += 1) {
          this.total += Number(this.data[i].amt);
        }
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
        let center_heading = "Payments Made";
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
        let center_heading = "Payments Made";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  setTable() {
    let headings = {
      dttime: { title: 'Date', placeholder: 'Date' },
      amt: { title: 'Amount', placeholder: 'Amount' },
      rema: { title: 'Remark', placeholder: 'Remark' },


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
        // vehid: { value: req.vehid },
        // transtime: { value: req.transtime },
        dttime: { value: req.dttime == null ? "-" : req.dttime },
        amt: { value: req.amt == null ? "-" : req.amt },
        rema: { value: req.rema == null ? "-" : req.rema },


      };
      columns.push(column);
    });
    return columns;
  }

}
