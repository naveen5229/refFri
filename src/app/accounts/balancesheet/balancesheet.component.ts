import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import * as _ from 'lodash';


@Component({
  selector: 'balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.scss']
})
export class BalancesheetComponent implements OnInit {

  balanceData = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-'),

    // branch: {
    //   name: '',
    //   id: 0
    // }

  };
  branchdata = [];
  balanceSheetData = [];
  activeId = '';

  liabilities = [];
  assets = [];
  allowBackspace = true;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.setFoucus('startdate');
    this.common.currentPage = 'Balance Sheet';
  }

  ngOnInit() {
  }

  getBalanceSheet() {
    let params = {
      startdate: this.balanceData.startdate,
      enddate: this.balanceData.enddate,
    };

    this.common.loading++;
    this.api.post('Company/GetBalanceData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.balanceSheetData = res['data'];
        this.formattData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  formattData() {
    let assetsGroup = _.groupBy(this.balanceSheetData, 'y_is_assets');
    let firstGroup = _.groupBy(assetsGroup['0'], 'y_groupname');
    let secondGroup = _.groupBy(assetsGroup['1'], 'y_groupname');

    console.log('A:', assetsGroup);
    console.log('B:', firstGroup);
    console.log('C:', secondGroup);
    this.liabilities = [];
    for (let key in firstGroup) {
      let total = 0;
      firstGroup[key].map(value => {
        if (value.y_amount) total += parseInt(value.y_amount);
      });

      this.liabilities.push({
        name: key,
        amount: total,
        balanceSheets: firstGroup[key].filter(balanceSheet => { return balanceSheet.y_ledger_name; })
      })
    }

    this.assets = [];
    for (let key in secondGroup) {
      let total = 0;
      secondGroup[key].map(value => {
        if (value.y_amount) total += parseInt(value.y_amount);
      });

      this.assets.push({
        name: key,
        amount: total,
        balanceSheets: secondGroup[key].filter(balanceSheet => { return balanceSheet.y_ledger_name; })
      })
    }

    console.log('first Section:', this.liabilities);
    console.log('last Section:', this.assets);


  }

  filterData(assetdata, slug) {
    return assetdata.filter(data => { return (data.y_is_assets === slug ? true : false) });
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('startdate')) {
        this.balanceData.startdate = this.common.handleDateOnEnterNew(this.balanceData.startdate);
        this.setFoucus('enddate');
      } else if (this.activeId.includes('enddate')) {
        this.balanceData.enddate = this.common.handleDateOnEnterNew(this.balanceData.enddate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'enddate') this.setFoucus('startdate');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }

  }

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }
}
