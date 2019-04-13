import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import * as _ from 'lodash';

@Component({
  selector: 'profitloss',
  templateUrl: './profitloss.component.html',
  styleUrls: ['./profitloss.component.scss']
})
export class ProfitlossComponent implements OnInit {

  plData = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    // branch: {
    //   name: '',
    //   id: 0
    // }

  };
  branchdata = [];
  profitLossData = [];
  activeId = "";


  liabilities = [];
  assets = [];
  allowBackspace = true;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    // this.getBalanceSheet();
    this.getBranchList();
    this.setFoucus('startdate');
    this.common.currentPage = 'Profit & Loss A/C';
  }

  ngOnInit() {
  }

  getBranchList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetBranchList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.branchdata = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getBalanceSheet() {
    console.log('Balance Sheet:', this.plData);
    let params = {
      startdate: this.plData.startdate,
      enddate: this.plData.enddate,
      // branch: this.plData.branch.id,
    };

    this.common.loading++;
    this.api.post('Company/GetProfitLossData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.profitLossData = res['data'];
        this.formattData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  formattData() {
    let assetsGroup = _.groupBy(this.profitLossData, 'y_is_assets');
    let firstGroup = _.groupBy(assetsGroup['0'], 'y_name');
    let secondGroup = _.groupBy(assetsGroup['1'], 'y_name');

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
        profitLossData: firstGroup[key].filter(profitLossData => { return profitLossData.y_ledger_name; })
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
        profitLossData: secondGroup[key].filter(profitLossData => { return profitLossData.y_ledger_name; })
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
        this.plData.startdate = this.common.handleDateOnEnterNew(this.plData.startdate);
        this.setFoucus('enddate');
      } else if (this.activeId.includes('enddate')) {
        this.plData.enddate = this.common.handleDateOnEnterNew(this.plData.enddate);
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
