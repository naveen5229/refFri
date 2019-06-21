import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'financial-toll-summary',
  templateUrl: './financial-toll-summary.component.html',
  styleUrls: ['./financial-toll-summary.component.scss']
})
export class FinancialTollSummaryComponent implements OnInit {
  dates = {
    start: this.common.dateFormatter(new Date()),

    end: this.common.dateFormatter(new Date()),
  };
  table = null;
  data = [];
  balance = [];
  openingBalance = null;
  closingBalance = null;
  vehid = 6754;
  mobileno = this.user._details.mobileno;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {

    //this.getdoubleTollReport();
    // this.getBalance();
    this.getfinancialTollReport();
  }

  ngOnInit() {
  }
  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.dates);
    });
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
        let center_heading = "Financial Report";
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
        let center_heading = "Financial Report";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  setTable() {
    let headings = {
      vehid: { title: 'Vehicle', placeholder: 'Vehicle' },
      transtime: { title: 'Transac Time', placeholder: '	Transac Time' },
      remark: { title: 'Toll Plaza', placeholder: 'Toll Plaza' },
      amount: { title: 'Amount', placeholder: 'Amount' },
      balance: { title: 'Balance', placeholder: 'Balance' },
      entry_type: { title: 'Transaction Type', placeholder: 'Transaction Type' },

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
        vehid: { value: req.vehid },
        transtime: { value: req.transtime },
        remark: { value: req.remark == null ? "-" : req.remark },
        amount: { value: req.amount == null ? "-" : req.amount },
        balance: { value: req.balance == null ? "-" : req.balance },
        entry_type: { value: req.entry_type == null ? "-" : req.entry_type },


      };
      columns.push(column);
    });
    return columns;
  }
  getfinancialTollReport() {
    let params = "startDate=" + this.dates.start + "&endDate=" + this.dates.end;
    // console.log("api hit");
    this.common.loading++;
    this.api.walle8Get('FinancialAccountSummary/getOpeningAndClosingBalance.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        this.balance = res['data'];
        if (this.balance == null) {
          this.balance = [];
        }
        this.openingBalance = this.balance[0].opening_balance;
        this.closingBalance = this.balance[0].closing_balance;

      }, err => {
        this.common.loading--;
        console.log(err);
      });
    let param = "startDate=" + this.dates.start + "&endDate=" + this.dates.end;
    this.common.loading++;
    this.api.walle8Get('FinancialAccountSummary/getFinancialAccountSummary.json?' + param)
      .subscribe(Res => {
        this.common.loading--;
        console.log('Res:', Res);
        this.data = Res['data'];
        if (this.data == null) {
          this.data = [];
          this.table = null;
          return;
        }
        this.table = this.setTable();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  // getdoubleTollReport() {
  //   let params = "&startDate=" + this.dates.start + "&endDate=" + this.dates.end;
  //   // console.log("api hit");
  //   this.common.loading++;
  //   this.api.walle8Get('FinancialAccountSummary/getOpeningAndClosingBalance.json?' + params)
  //     .subscribe(res => {
  //       this.common.loading--;
  //       console.log('Res:', res);
  //       this.data = res['data'];


  //     }, err => {
  //       this.common.loading--;
  //       console.log(err);
  //     });
  // }
}
