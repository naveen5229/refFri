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
  selector: 'double-toll-report',
  templateUrl: './double-toll-report.component.html',
  styleUrls: ['./double-toll-report.component.scss']
})
export class DoubleTollReportComponent implements OnInit {
  // dates = {
  //   start: null,

  //   end: this.common.dateFormatter(new Date()),
  // };
  startDate = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endDate = new Date();
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  // table = null;
  data = [];
  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    private csvService: CsvService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal,
  ) {
    this.getdoubleTollReport();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh(){
    this.getdoubleTollReport();
  }
  
  setTable() {
    let headings = {
      vehreg: { title: 'Vehicle', placeholder: 'Vehicle' },
      remark: { title: 'TOll Plaza', placeholder: '	Toll Plaza' },
      transtime: { title: 'Transaction Time', placeholder: 'Transaction Time' },
      amount: { title: 'Amount', placeholder: 'Amount' },
      action: { title: 'Action', placeholder: 'Action' },
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
        vehreg: { value: req.vehreg },
        remark: { value: req.remark },
        regno: { value: req.regno == null ? "-" : req.regno },
        transtime: { value: req.transtime == null ? "-" : req.transtime },
        amount: { value: req.amount == null ? "-" : req.amount },
        action: { value: "", action: null, html: true,
        icons: this.actionIcons(req)}
      };
      columns.push(column);
    });
    return columns;
  }

  actionIcons(data) {
    let icons = [];
    
      icons.push({
        class: "icon fa fa-eye gray",
        action: this.raiseIssue.bind(this, data),
      });
    return icons;
  }

  getdoubleTollReport() {
    let foid=this.user._loggedInBy=='admin' ? this.user._customer.foid : this.user._details.foid;
    let params = "mobileno=" + this.user._details.fo_mobileno +"&startDate=" + this.common.dateFormatter(new Date(this.startDate)) + "&endDate=" + this.common.dateFormatter(new Date(this.endDate))+"&foid="+foid;
    // console.log("api hit");
    this.common.loading++;
    this.api.walle8Get('TollSummary/getDoubleTollReport.json?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res333:', res['data']);
        this.data = res['data'];
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

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.foName;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Start Date: '+this.common.dateFormatter(new Date(this.startDate)),'End Date: '+this.common.dateFormatter(new Date(this.endDate)),  'Report: '+'Double-Toll']
    ];
    this.pdfService.jrxTablesPDF(['doubleToll'], 'double-toll', details);
  }

  printCSV(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.foName;
    let details = [
      { name: 'Name:' + name,startdate:'Start Date:'+this.common.dateFormatter(new Date(this.startDate)),enddate:'End Date:'+this.common.dateFormatter(new Date(this.endDate)), report:"Report:Double-Toll"}
    ];
    this.csvService.byMultiIds(['doubleToll'], 'double-toll', details);
  }



  raiseIssue(data) { 
    if (!confirm("Do you want to submit this entry ?")) {
      return;
    }
    const params = {
      tollUseId: data.id,
      tollProof: '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',
      issueId: 1,
      remark: 'Auto Identified'
    };
    console.log("params",params);
    const subURL = 'IssueRequestApi/insertTollIsuue.json?';
    this.common.loading++;
    this.api.walle8Post(subURL, params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success'] == false) {
          this.common.showError(res['msg']);
          return
        }
        this.common.showToast(res['msg']);
      }, err => {
        this.common.loading--;
        this.common.showError();
        console.log(err);
      });

  }
}
