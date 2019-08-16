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
    console.log('Active event', event);
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

