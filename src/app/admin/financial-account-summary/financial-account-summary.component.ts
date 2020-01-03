import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';
import jsPDF from "jspdf";
import html2canvas from 'html2canvas';

@Component({
  selector: 'financial-account-summary',
  templateUrl: './financial-account-summary.component.html',
  styleUrls: ['./financial-account-summary.component.scss']
})
export class FinancialAccountSummaryComponent implements OnInit {
  dates = {
    currentdate: this.common.dateFormatter1(new Date()),

    start: null,

    end: this.common.dateFormatter1(new Date()),
  };
  fo = {
    id: null,
    name: null,
    mobileNo: null
  }
  result = [];
  data = [];
  openingBalance = 0;
  closingBalance = 0;
  creditAmount = 0;
  debitAmount = 0;
  vehid = this.user._details.vehid;
  mobileno = this.user._details.mobileno;
  foAgents = [];
  constructor(public api: ApiService,
    public pdfService: PdfService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal, ) {
      this.common.refresh = this.refresh.bind(this);
    this.dates.start = this.common.dateFormatter1(new Date(new Date().setDate(new Date().getDate() - 15)));
  }

  ngOnInit() {
  }

  refresh() {
    this.getaddTimeFinancialTollReport();
  }

  calculateAmount(arr) {
    let usageStatus = arr[0]['entry_type'];
    let opening_balance_new = arr[0]['balance'];
    let usageAmount = arr[0]['amount'];

    if ((usageStatus).toLowerCase != "usage") {
      this.openingBalance = parseInt(opening_balance_new) + usageAmount;
    }
    else {
      this.openingBalance = parseInt(opening_balance_new) - (usageAmount);
    }
    this.closingBalance = arr[(arr.length - 1)]['balance'];
  }
  getDate(date) {
    this.common.params = { ref_page: "card usage" };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.dates);
    });
  }



  getaddTimeFinancialTollReport() {
    let params = "&startDate=" + this.dates.start + "&endDate=" + this.dates.end + "&mobileno=" + this.fo.mobileNo;
    this.common.loading++;
    this.api.walle8Get('FinancialAccountSummary/getFinancialAccountSummaryAddTime.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res);
        if (res && res['data']) {
          this.result = res['data'];
          this.data = res['data'];
          this.openingBalance = this.data[0]['amount'];
          this.closingBalance = this.data[this.data.length - 1]['amount'];
          this.calculateAmount(this.data);
        }
        else {
          this.common.showError("data not found");
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });

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
  typedKey = '';
  filterData(event) {
    this.data = this.result.filter((ele) => {
      if (!this.typedKey)
        return true;
      else
        return ele.vehid ? ele.vehid.toLowerCase().includes(this.typedKey) : false;
    })
  }

 

}
