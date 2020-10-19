import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';

@Component({
  selector: 'financial-toll-summary',
  templateUrl: './financial-toll-summary.component.html',
  styleUrls: ['./financial-toll-summary.component.scss']
})
export class FinancialTollSummaryComponent implements OnInit {
  startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate = new Date();
  table = null;
  data = [];
  balance = [];
  openingBalance = null;
  closingBalance = null;
  vehid = 6754;
  mobileno = this.user._details.mobileno;
  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    this.getfinancialTollReport();
    this.common.refresh = this.refresh.bind(this);
    }

  ngOnInit() {
  }

  refresh(){
    this.getfinancialTollReport();
  }
  
  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Start Date: '+this.common.dateFormatter(new Date(this.startDate)),'End Date: '+this.common.dateFormatter(new Date(this.endDate)),  'Report: '+'Financial-Toll-Summary']
    ];
    this.pdfService.jrxTablesPDF(['FinancialReport'], 'financial-toll-summary', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,startdate:'Start Date:'+this.common.dateFormatter(new Date(this.startDate)),enddate:'End Date:'+this.common.dateFormatter(new Date(this.endDate)), report:"Report:Financial-Toll-Summary"}
    ];
    this.csvService.byMultiIds(['FinancialReport'], 'financial-toll-summary', details);
  }

  setTable() {
    let headings = {
      vehid: { title: 'Vehicle', placeholder: 'Vehicle' },
      transtime: { title: 'Transaction Time', placeholder: 'Transaction Time' },
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
    let params = "startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate));
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
    let param = "startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate));
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
}
