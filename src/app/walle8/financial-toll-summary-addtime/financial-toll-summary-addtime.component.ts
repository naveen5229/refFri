import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'financial-toll-summary-addtime',
  templateUrl: './financial-toll-summary-addtime.component.html',
  styleUrls: ['./financial-toll-summary-addtime.component.scss']
})
export class FinancialTollSummaryAddtimeComponent implements OnInit {
  dates = {
    start: null,

    end: this.common.dateFormatter(new Date()),
  };
  fo = {
    id : null,
    name: null,
    mobileNo:null
  }
  table = null;
  data = [];
  balance = [];
  openingBalance = null;
  closingBalance = null;
  vehid = this.user._details.vehid;
  mobileno = this.user._details.mobileno;
  foAgents=[];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal, ) {
    this.dates.start = this.common.dateFormatter1(new Date(new Date().setDate(new Date().getDate() - 15)));
    // this.getaddTimeFinancialTollReport();
    // this.common.refresh = this.refresh.bind(this);
    console.log("user",this.user._details);
    console.log("customer",this.user._customer);

  }

  ngOnInit() {
  }

  refresh(){
    //this.getaddTimeFinancialTollReport();
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
        let center_heading = "Financial Report AddTime";
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
        let center_heading = "Financial Report AddTime";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  setTable() {
    let headings = {
      vehid: { title: 'Vehicle', placeholder: 'Vehicle' },
      addtime: { title: 'AddTime', placeholder: 'AddTime' },
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
        addtime: { value: req.addtime },
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
  getaddTimeFinancialTollReport() {
    let params = "&startDate=" + this.dates.start + "&endDate=" + this.dates.end+"&mobileNo="+this.fo.mobileNo;
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
    let param = "startDate=" + this.dates.start + "&endDate=" + this.dates.end+"&mobileNo="+this.fo.mobileNo;
    this.common.loading++;
    this.api.walle8Get('FinancialAccountSummary/getFinancialAccountSummaryAddTime.json?' + param)
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

  selectFo(fo)
  {
    this.fo.id = fo.id;
    this.fo.name = fo.name;
    this.fo.mobileNo = fo.mobileno;
  }

  getFoAgents(){
  let  search= document.getElementById('agentFo')['value'];
 console.log("searvh ",search)
    this.api.walle8Get('Suggestion/getFoAgents.json?search='+search)
      .subscribe(res => {
        console.log("res",res);
        this.foAgents=res['data'];
        console.log("-0-0-0",this.foAgents);
      }, err => {
        console.log(err);
      });
  }
}
