import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { UserCallHistoryComponent } from '../../modals/user-call-history/user-call-history.component';
import { CsvService } from '../../services/csv/csv.service';
import { PdfService } from '../../services/pdf/pdf.service';
import { ExcelService } from '../../services/excel/excel.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'user-call-summary',
  templateUrl: './user-call-summary.component.html',
  styleUrls: ['./user-call-summary.component.scss']
})
export class UserCallSummaryComponent implements OnInit {
  fromDate = this.common.dateFormatter1(new Date());
  endDate = this.common.dateFormatter1(new Date());;
  title = '';
  showTable = false;
  data = [];
  headings = [];
  valobj = {};
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private csvService:CsvService,
    private pdfService:PdfService) {

    console.log(this.fromDate);
    console.log(this.endDate);
    this.getCallSummary();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh() {

    this.getCallSummary();
  }

  getDate(date) {
    this.common.params = { ref_page: 'user-call-summary' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        console.log("data date:");
        console.log(data.date);
        if (date == 'startdate') {
          this.fromDate = this.common.dateFormatter1(data.date).split(' ')[0];
          console.log('Date:', this.fromDate);
        } else {
          this.endDate = this.common.dateFormatter1(data.date).split(' ')[0];
          console.log('Date:', this.endDate);
        }
      }
    });
  }

  getCallSummary() {
    this.common.loading++;
    this.data = [];
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    let stDate = this.fromDate;
    let enDate = this.endDate;
    this.api.post('Drivers/getUserCallSummary', { x_start_date: stDate, x_end_date: enDate + ' 23:59:00' })
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        console.log("data:");
        console.log(this.data);
        if (this.data == null) {
          this.data = [];
          return;
        }
        let first_rec = this.data[0];
        console.log("first_Rec", first_rec);

        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
        console.log("table:");
        console.log(this.table);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.data.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        if (j != 0 && this.headings[j] != 'User Name') {
          if(this.data[i][this.headings[j]]){
          this.valobj[this.headings[j]] = {
            value: `<div style="color: black;" class="${this.data[i][this.headings[j]] ? 'blue' : 'black'}"><span>${this.data[i][this.headings[j]] || ''}</span></div>`,
            action: this.openHistoryModel.bind(this, this.data[i],this.headings[j]), isHTML: true,
          }
        }else{
          this.valobj[this.headings[j]] = {
            value: `<div style="color: black;" class="${this.data[i][this.headings[j]] ? 'blue' : 'black'}"><span>${this.data[i][this.headings[j]] || ''}</span></div>`,
            isHTML: true,
          }
        }
        } else {
          this.valobj[this.headings[j]] = { value: this.data[i][this.headings[j]], class: 'black', action: '' };

        }
      }

      columns.push(this.valobj);
    }
    return columns;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }


  openHistoryModel(data,type) {
    let endDate = this.endDate + ' 23:59:00';
    console.log("data------------------/", endDate);

    let callData = {
      vehicleId: 0,
      foAdminUserId: data._foadmusr_id,
      currentDay: this.common.dateFormatter1(this.fromDate),
      nextDay: this.common.dateFormatter(endDate),
      type : type
    }
    this.common.params = { callData: callData };
    console.log("calldatas =", this.common.params.callData);
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    const activeModal = this.modalService.open(UserCallHistoryComponent, {
      size: "lg",
      container: "nb-layout",
    });
    activeModal.result.then(
      data => console.log("data", data)
      // this.reloadData()
    );
  }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name, 'Start Date: '+this.fromDate,'End Date: '+this.endDate,  'Report: '+'User Call Summary']
    ];
    this.pdfService.jrxTablesPDF(['userCallSummary'], 'User Call Summary', details);
  }

  printCSV(){
    // let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    // let details = [
    //   { name: 'Name:' + name,startdate:"Start Date:"+this.fromDate,enddate:"End Date: "+this.endDate, report:"Report:User Call Summary"}
    // ];
    // this.csvService.byMultiIds(['userCallSummary'], 'User Call Summary', details);


    let foName =   this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    let headerDetails=[];
    headerDetails=[
        {sDate:''},
        {eDate:''},
        {name:foName}
    ]
    let headersArray = ["User Name", "Driver Incoming (Duration)", "Driver Outgoing (Duration)", "Employee Incoming (Duration)", "Employee Outgoing (Duration)",
     "Customer Incoming (Duration)", "Customer Outgoing (Duration)","Others Incoming (Duration)","Others Outgoing (Duration)","Unanswered (Count)","Missed Call (Count)","Total Call (Duration)"];
    let json = this.data.map(calhistory => {
      return {
        "User Name": calhistory['User Name'],
        "Driver Incoming (Duration)":calhistory['Driver Incoming (Duration)'],
        "Driver Outgoing (Duration)": calhistory['Driver Outgoing (Duration)'],
        "Employee Incoming (Duration)": calhistory['Employee Incoming (Duration)'],
        "Employee Outgoing (Duration)": calhistory['Employee Outgoing (Duration)'],
        "Customer Incoming (Duration)": calhistory['Customer Incoming (Duration)'],
        "Customer Outgoing (Duration)": calhistory['Customer Outgoing (Duration)'],
        "Others Incoming (Duration)": calhistory['Others Incoming (Duration)'],
        "Others Outgoing (Duration)": calhistory['Others Outgoing (Duration)'],
        "Unanswered (Count)": calhistory['Unanswered (Count)'],
        "Missed Call (Count)": calhistory['Missed Call (Count)'],
        "Total Call (Duration)": calhistory['Total Call (Duration)'],
      };
    });
    this.excelService.jrxExcel("User Call Summary",headerDetails,headersArray, json, 'userCallSummary', false);
  }
}
