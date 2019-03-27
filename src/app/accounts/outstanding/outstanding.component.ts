import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import * as _ from 'lodash';


@Component({
  selector: 'outstanding',
  templateUrl: './outstanding.component.html',
  styleUrls: ['./outstanding.component.scss']
})
export class OutstandingComponent implements OnInit {
  vouchertypedata = [];
  branchdata = [];
  outStanding = {
    endDate: this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    startDate: this.common.dateFormatter(new Date(), 'ddMMYYYY', false, '-'),
    ledger: {
      name: '',
      id: ''
    },
    branch: {
      name: '',
      id: ''
    },
  };

  ledgerData = [];
  voucherEntries = [];
  ledgerList=[];
  activeId = '';

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.getBranchList();
    this.getLedgerList();
    this.setFoucus('branch');

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
  getLedgerList() {
    let params = {
      search: 123
    };
    this.common.loading++;
    this.api.post('Suggestion/GetAllLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerList = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      }); 

  }

  getLedgerView() {
    console.log('Ledger:', this.outStanding);
    let params = {
      startdate: this.outStanding.startDate,
      enddate: this.outStanding.endDate,
      ledger: this.outStanding.ledger.id,
      branch: this.outStanding.branch.id
    };

    this.common.loading++;
    this.api.post('Accounts/GetOutStandingList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.ledgerData = res['data'];
        this.generalizeData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.outStanding[date] = this.common.dateFormatter(data.date).split(' ')[0];
      console.log(this.outStanding[date]);
    });
  }

  onSelected(selectedData, type, display) {
    this.outStanding[type].name = selectedData[display];
    this.outStanding[type].id = selectedData.id;
    // console.log('order User: ', this.DayBook);
  }


  filterData(dayDatas) {
    let yCodes = [];
    // dayDatas.map(dayData => {
    //   if (yCodes.indexOf(dayData.y_particulars) !== -1) {
    //     dayData.y_particulars = 0;
    //   } else {
    //     yCodes.push(dayData.y_particulars);
    //   }
    // });
    return dayDatas;
  }

  generalizeData() {
    this.voucherEntries = [];
    let allGroups = _.groupBy(this.ledgerData, 'y_particulars');
    let allKeys = Object.keys(allGroups);
    allKeys.map((key, index) => {
      this.voucherEntries[index] = {
        name: key,
        amount: {
          debit: 0,
          credit: 0
        },
        vouchers: allGroups[key]
      };
      allGroups[key].map(data => {
        this.voucherEntries[index].amount.debit += parseFloat(data.y_dramunt);
        this.voucherEntries[index].amount.credit += parseFloat(data.y_cramunt);
      });
    });
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    if (key == 'enter') {
      if (this.activeId.includes('branch')) {
        this.setFoucus('ledger');
      }else  if (this.activeId.includes('ledger')) {
        this.setFoucus('startdate');
      }else  if (this.activeId.includes('startdate')) {
        this.setFoucus('enddate');
      }else  if (this.activeId.includes('enddate')) {
        this.setFoucus('submit');
      }
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
