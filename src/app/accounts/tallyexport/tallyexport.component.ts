import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import * as _ from 'lodash';
import { CsvService } from '../../services/csv/csv.service';
import { AccountService } from '../../services/account.service';
import { UserService } from '../../services/user.service';
import { VoucherdetailComponent } from '../../acounts-modals/voucherdetail/voucherdetail.component';
import { OrderdetailComponent } from '../../acounts-modals/orderdetail/orderdetail.component';
import { TripdetailComponent } from '../../acounts-modals/tripdetail/tripdetail.component';

// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/toPromise';
// import { saveAs } from 'file-saver/FileSaver';
import { saveAs } from 'file-saver';
import { ExcelService } from '../../services/excel/excel.service';
import { constructor } from 'vfile-message';


@Component({
  selector: 'tallyexport',
  templateUrl: './tallyexport.component.html',
  styleUrls: ['./tallyexport.component.scss']
})
export class TallyexportComponent implements OnInit {
  headingName = '';
  branchname='';
  branchData=[];
  branchType={
    name:'',
    id:0
  }
  endDate= this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-');
  startDate= this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-');
  
  allowBackspace = true;
  f2Date = 'startdate';
  lastActiveId = '';
  showDateModal = false;
  activedateid = '';

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public excelService: ExcelService,
    public csvService: CsvService,
    public accountService: AccountService,
    private http: Http,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
  
    this.common.currentPage = 'Tally Export';
    this.headingName = this.user._customer.name;
    this.branchname = this.accountService.selected.branch.name;
    setTimeout(() => {
    this.branchData=this.accountService.branches;
    console.log('branchesw',this.branchData);
    this.setFoucus('startDate');
    }, 3000);
  }

  activeGroup = [];

  ngOnInit() {
  }
  refresh() {
    this.branchname = this.accountService.selected.branch.name;   
    console.log('financial year 122 :',(this.accountService.selected.financialYear['name']).split('-')[1]);
  }


  onSelected(selectedData, type, display) {
    console.log('selected data',selectedData);
    this.branchType.name = selectedData[display];
    this.branchType.id = selectedData.id;
    this.setFoucus('startDate');
    // console.log('order User: ', this.DayBook);
  }

  
  keyHandler(event) {
    const key = event.key.toLowerCase();
    let activeId = document.activeElement.id;
    console.log('Active event1111', event);
    if ((key == 'f2' && !this.showDateModal) && (activeId.includes('startDate') || activeId.includes('endDate'))) {
      // document.getElementById("voucher-date").focus();
      // this.voucher.date = '';
      this.lastActiveId = activeId;
      this.setFoucus('voucher-date-f2', false);
      this.showDateModal = true;
      this.f2Date = (activeId== 'startDate') ? this.startDate : this.endDate;
      this.activedateid = this.lastActiveId;
      return;
    } else if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.f2Date,this.lastActiveId,activeId);
      this.handleVoucherDateOnEnter(activeId);
      this.setFoucus(this.lastActiveId);

      return;
    } else if ((key != 'enter' && this.showDateModal) && (activeId.includes('startdate') || activeId.includes('enddate'))) {
      return;
    }
    
    if (key == 'enter') {
     // this.allowBackspace = true;
      if (activeId.includes('branchType')) {
        this.setFoucus('startDate');
      } else if (activeId.includes('startDate')) {
        this.setFoucus('endDate');
      }else if (activeId.includes('endDate')) {
        this.setFoucus('master');
      }
  }
}

handleVoucherDateOnEnter(iddate) {
  let dateArray = [];
  let separator = '-';

  //let datestring = (this.activedateid == 'startDate') ? this.startDate : this.endDate;
  let datestring = this.f2Date;
  if (datestring.includes('-')) {
    dateArray = datestring.split('-');
  } else if (datestring.includes('/')) {
    dateArray = datestring.split('/');
    separator = '/';
  } else {
    this.common.showError('Invalid Date Format!');
    return;
  }
  let date = dateArray[0];
  date = date.length == 1 ? '0' + date : date;
  let month = dateArray[1];
  month = month.length == 1 ? '0' + month : month;

  
  let finacialyear = (month < '04')? (this.accountService.selected.financialYear['name']).split('-')[0] :(this.accountService.selected.financialYear['name']).split('-')[1];
  console.log('financial year',finacialyear,month);
  let year = dateArray[2];
  year = (year) ? (year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year) : finacialyear;
  console.log('Date: ', date + separator + month + separator + year);
  if(this.activedateid == 'startDate'){
    this.startDate = date + separator + month + separator + year;
  }else{
    this.endDate = date + separator + month + separator + year;
  }
  

}

  getTallyData(type,filename) {
    return new Promise((resolve, reject) => {
      const params = {
        tallyType: type,
        branchid: this.branchType.id,
        startDate:this.startDate,
        endDate:this.endDate
      };
      this.common.loading++;
      this.api.post('Voucher/getTallyData', params)
        .subscribe(res => {
          console.log(res);
          this.common.loading--;
          this.excelService.saveAsXMLFile('', filename,res['data'][0]['tally_export']);
      
        }, err => {
          console.log(err);
          this.common.loading--;
          this.common.showError();
          reject();
        });
    });
  }

  
  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
    }, 100);
  }
}

