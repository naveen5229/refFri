import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import jsPDF from "jspdf";
import "jspdf-autotable";
import { CsvService } from '../../services/csv/csv.service';
import { DatePipe } from '@angular/common';
import { ExcelService } from '../../services/excel/excel.service';
import { PdfService } from '../../services/pdf/pdf.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'financial-toll-summary-addtime',
  templateUrl: './financial-toll-summary-addtime.component.html',
  styleUrls: ['./financial-toll-summary-addtime.component.scss']
})
export class FinancialTollSummaryAddtimeComponent implements OnInit {

  dates = {
    currentdate: this.common.dateFormatter1(new Date())
  };
  startDate = (new Date(new Date().setDate(new Date().getDate() - 7)));
  minDate = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
  endDate = new Date();

  fo = {
    id: null,
    name: null,
    mobileNo: null
  }
  foid = null;
  regno = null;
  typedKey = '';
  vehId = '';
  result = [];
  data = [];
  openingBalance = 0;
  closingBalance = 0;
  creditAmount = 0;
  debitAmount = 0;
  vehid = this.user._details.vehid;
  mobileno = this.user._details.fo_mobileno;
  foAgents = [];
  table = null;

  constructor(public api: ApiService,
    private cdr: ChangeDetectorRef,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
    private datePipe: DatePipe,
    private pdfService: PdfService,
    private excelService: ExcelService,
    private csvService: CsvService) {
    console.log("this.user._details.", this.user._details);
    this.fo.id = this.user._loggedInBy == 'admin' ? this.user._customer.foid : this.user._details.foid;
    this.fo.mobileNo = this.user._details.fo_mobileno;
    this.fo.name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.foName;
    console.log("FoName:", this.user._details.username);
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnDestroy() { }
  ngOnInit() {
  }

  selectVehicle(vehData) {
    this.vehId = vehData.id;
    this.regno = vehData.regno;
    this.data = this.result.filter((ele) => {
      if (!this.regno) {
        return true;
      } else {
        console.log("ele", ele);
        return ele.vehid == this.regno ? true : false;
      }
    })
    console.log(this.data);
  }

  refresh() {
    this.getaddTimeFinancialTollReport();
  }

  calculateAmount(arr) {
    let usageStatus = arr[0]['entry_type'];
    let opening_balance_new = arr[0]['balance'];
    let usageAmount = arr[0]['amount'];
    console.log("usageStatus", (usageStatus).toLowerCase, "opening_balance_new", opening_balance_new, "usageAmount", usageAmount)
    if ((usageStatus).toLowerCase() == "usage" || (usageStatus).toLowerCase() == "balance recharge") {
      this.openingBalance = parseInt(opening_balance_new) - usageAmount;
    } else {
      this.openingBalance = parseInt(opening_balance_new) + (usageAmount);
    }
    this.closingBalance = arr[(arr.length - 1)]['balance'];
  }

  getaddTimeFinancialTollReport() {
    this.openingBalance = 0;
    this.closingBalance = 0;
    this.data = [];
    console.log("mobile no", this.mobileno);
    if (this.mobileno) {
      let params = "&startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate)) + "&mobileno=" + this.mobileno + "&vehid=" + this.vehId;
      this.common.loading++;
      this.api.walle8Get('FinancialAccountSummary/getFinancialAccountSummaryAddTime.json?' + params)
        .subscribe(res => {
          this.common.loading--;
          console.log('Res:', res);
          if (res && res['data'] && res['data'].length > 0) {
            this.result = res['data'];
            this.data = res['data'];
            this.table = this.setTable();
            this.calculateAmount(this.data);
          } else {
            this.common.showError("data not found");
          }
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  }

  setTable() {
    let headings = {
      vehicle: { title: 'Vehicle', placeholder: 'Vehicle' },
      accountingTime: { title: 'Accounting Time', placeholder: 'Accounting Time' },
      transactionTime: { title: 'Transaction Time', placeholder: 'Transaction Time' },
      tollPlaza: { title: 'Toll Plaza', placeholder: 'Toll Plaza' },
      amountCR: { title: 'Amount(CR)', placeholder: 'Amount(CR)' },
      amountDR: { title: 'Amount(DR)', placeholder: 'Amount(DR)' },
      transactionType: { title: 'Transaction Type', placeholder: 'Transaction Type' },
      balance: { title: 'Balance', placeholder: 'Balance' },
      transactionId: { title: 'Transaction Id', placeholder: 'Transaction Id' },
    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns(),
      },
      settings: {
        pagination: true,
        hideHeader: true,
        tableHeight: "70vh"
      },
      pages: {
        limit: 200
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.data.map(doc => {
      let column = {
        vehicle: { value: doc.vehid },
        accountingTime: { value: doc.addtime },
        transactionTime: { value: doc.transtime },
        tollPlaza: { value: doc.remark },
        amountCR: { value: doc.amount_credit },
        amountDR: { value: doc.amount_debit },
        transactionType: { value: doc.entry_type },
        balance: { value: doc.balance },
        transactionId: { value: doc.txn_id },
      };
      columns.push(column);
    });
    return columns;
  }

  selectFo(fo) {
    this.fo.id = fo.foid;
    this.fo.name = fo.name;
    this.fo.mobileNo = fo.mobileno;
  }

  getFoAgents() {
    let search = document.getElementById('agentFo')['value'];
    console.log("searvh ", search)
    this.api.walle8Get('Suggestion/getFoAgents.json?search=' + search)
      .subscribe(res => {
        console.log("res", res);
        this.foAgents = res['data'];
        console.log("-0-0-0", this.foAgents);
      }, err => {
        console.log(err);
      });
  }

  filterData(event) {
    console.log('typedKey', this.typedKey)
    this.data = this.result.filter((ele) => {
      if (!this.typedKey) {
        return true;
      } else {
        console.log("ele", ele);
        return ele.vehid ? ele.vehid.toLowerCase().includes(this.typedKey) : false;
      }
    })
  }

  printCsv() {
    let startDate = this.common.dateFormatter1(this.startDate);
    let endDate = this.common.dateFormatter1(this.endDate);
    let foName = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.name;
    let headerDetails = [];
    headerDetails = [
      { sDate: startDate },
      { eDate: endDate },
      { name: foName }
    ]
    let headersArray = ["Vehicle", "Accounting Time", "Transaction Time", "Toll Plaza", "Amount(CR)", "Amount(DR)", "Transaction Type", "Balance", "Transaction ID"];
    let json = this.data.map(fts => {
      return {
        "Vehicle": fts['vehid'],
        "Accounting Time": fts['addtime'],
        "Transaction Time": fts['transtime'],
        "Toll Plaza": fts['remark'],
        "Amount(CR)": fts['amount_credit'],
        "Amount(DR)": fts['amount_debit'],
        "Transaction Type": fts['entry_type'],
        "Balance": fts['balance'],
        "Transaction ID": fts['txn_id'],
      };
    });
    this.excelService.jrxExcel("Financial Toll Summary Add Time", headerDetails, headersArray, json, 'Financial Toll Summary Add Time', false);
  }

  generatePDF() {
    this.table.settings = {
      pagination: true,
      hideHeader: true,
      tableHeight: "70vh",
      pageLimit: this.data.length
    }
    setTimeout(() => {
      this.common.loading++;
      let name = this.user._loggedInBy == 'admin' ? this.user._details.username : this.user._details.foName;
      let details = [
        ['Name: ' + name, 'Start Date: ' + this.common.dateFormatter1(this.startDate), 'End Date: ' + this.common.dateFormatter1(this.endDate), 'Report: ' + 'Financial Toll Summary Add Time']
      ];
      this.pdfService.jrxTablesPDF(['provider', 'customer', 'account', 'tblData'], 'Financial Toll Summary Add Time', details);
      this.table.settings = {
        pagination: true,
        hideHeader: true,
        tableHeight: "70vh",
        pageLimit: 200
      }
    }, 2000);
    this.common.loading--;
  }
}
