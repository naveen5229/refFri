import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'financial-main-summary',
  templateUrl: './financial-main-summary.component.html',
  styleUrls: ['./financial-main-summary.component.scss']
})
export class FinancialMainSummaryComponent implements OnInit {
  // dates = {
  //   start: null,

  //   end: this.common.dateFormatter(new Date()),
  // };
  startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate = new Date();
  table = null;
  data = [];
  mobileNo = null;
  //vehid = 6754;
  //mobileno = 9812929999;
  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    console.log("this.user._customer",this.user._customer);
    // this.dates.start = this.common.dateFormatter1(new Date(new Date().setDate(new Date().getDate() - 30)));
    this.getfinancialMainSummary();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.getfinancialMainSummary();
  }
  // getDate(date) {
  //   this.common.params = { ref_page: "card usage" };
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     this.dates[date] = this.common.dateFormatter(data.date).split(' ')[0];
  //     console.log('Date:', this.dates);
  //   });
  // }
  
  setTable() {
    let headings = {
      vehid: { title: 'Vehicle', placeholder: 'Vehicle' },
      transtime: { title: 'Transaction Time', placeholder: 'Transaction Time' },
      remark: { title: 'Remark', placeholder: 'Remark' },
      amount: { title: 'Amount', placeholder: 'Amount' },
      balance: { title: 'Balance', placeholder: 'Balance' },
      // entry_type: { title: 'Transaction Type', placeholder: 'Transaction Type' },

    };
    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "60vh"
      }
    }
  }
  getTableColumns() {
    let columns = [];
    this.data.map(req => {
      let column = {
        vehid: { value: req.vehid },
        transtime: { value: this.common.changeDateformat4(req.transtime)},
        remark: { value: req.remark == null ? "-" : req.remark },
        amount: { value: req.amount == null ? "-" : req.amount },
        balance: { value: req.balance == null ? "-" : req.balance },
        // entry_type: { value: req.entry_type == null ? "-" : req.entry_type },


      };
      columns.push(column);
    });
    return columns;
  }
  getfinancialMainSummary() {
    let mobileNo = this.user._customer.mobileNo;
    if (this.user._loggedInBy == "customer")
      mobileNo = this.user._details.mobileNo;

      let foid=this.user._loggedInBy=='admin' ? this.user._customer.foid : this.user._details.foid;
    let param = "startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate))+"&mobileno=" + this.user._details.fo_mobileno+"&foid="+foid;
    this.common.loading++;
    this.api.walle8Get('FinancialAccountSummary/getFinancialAccountMainSummary.json?' + param)
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
        // this.table = this.setTable();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Start Date: '+this.common.dateFormatter(new Date(this.startDate)),'End Date: '+this.common.dateFormatter(new Date(this.endDate)),  'Report: '+'Financial-Main-Summary']
    ];
    this.pdfService.jrxTablesPDF(['FinancialReport'], 'financial-main-summary', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let details = [
      { name: 'Name:' + name,startdate:'Start Date:'+this.common.dateFormatter(new Date(this.startDate)),enddate:'End Date:'+this.common.dateFormatter(new Date(this.endDate)), report:"Report:Financial-Main-Summary"}
    ];
    this.csvService.byMultiIds(['FinancialReport'], 'financial-main-summary', details);
  }

}
