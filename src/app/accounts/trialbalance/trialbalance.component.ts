import { Component, OnInit, HostListener, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { VoucherdetailComponent } from '../../acounts-modals/voucherdetail/voucherdetail.component';
import { ProfitlossComponent } from '../../acounts-modals/profitloss/profitloss.component';
import { LedgerviewComponent } from '../../acounts-modals/ledgerview/ledgerview.component';
import * as _ from 'lodash';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { AccountService } from '../../services/account.service';
@Component({
  selector: 'trail-tree',
  templateUrl: './trail.tree.html',
  styleUrls: ['./trialbalance.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'keyHandler($event)'
  }
})
export class TrailTreeComponent {
  @Input() data: any;
  @Input() active: boolean;
  @Input() labels: string;
  @Input() action: any;
  @Input() actionabs: any;
  @Input() isExpandAll: boolean;
  @Input() color: number = 0;
  @Input() getaction: any;
  activeIndex: boolean = false;
  selectedRow: number = -1;
  colors = ['#5d6e75', '#6f8a96', '#8DAAB8', '#a4bbca', 'bfcfd9'];
  deletedId = 0;
  items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  constructor(public common: CommonService,
    public modalService: NgbModal,
    public user: UserService,
    public accountService: AccountService) {
  }

  lastClickHandler(event, index) {
    this.selectedRow = parseInt(index);
    event.stopPropagation();
  }

  ngAfterViewInit() {
    // console.log('--------,', this.active);
  }

  ngOnChanges(changes) {
    // console.log('Changes: ', changes);
    // console.log(changes.active)
  }

  clickHandler(event, index) {
    event.stopPropagation();
    this.activeIndex = this.activeIndex !== index ? index : -1
  }

  doubleClickHandler(event, data) {
    event.stopPropagation();
    //  console.log('data suggestion',data);
    this.action(data);

  }
  setabsHandler(a) {
    //  console.log('data suggestion',data);
    return Math.abs(a);

  }
  keyHandler(event) {
    event.stopPropagation();
    const key = event.key.toLowerCase();
    if ((key.includes('arrowup') || key.includes('arrowdown')) && this.data.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.data.length - 1 && key === 'arrowdown') this.selectedRow++;
    }
  }
}

@Component({
  selector: 'trialbalance',
  templateUrl: './trialbalance.component.html',
  styleUrls: ['./trialbalance.component.scss']
})
export class TrialbalanceComponent implements OnInit {
  selectedName = '';
  voucherEntries = [];
  trial = {
    endDate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startDate: ((((new Date()).getMonth()) + 1) > 3) ? this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-') : this.common.dateFormatternew(((new Date().getFullYear()) - 1) + '-04-01', 'ddMMYYYY', false, '-'),
    ledger: {
      name: 'All',
      id: 0
    },
    voucherType: {
      name: 'All',
      id: 0
    }

  };

  TrialData = [];
  ledgerList = [];
  activeId = 'voucherType';
  selectedRow = -1;
  allowBackspace = true;
  showDateModal = false;
  f2Date = 'startDate';
  activedateid = '';
  lastActiveId = '';
  trialBalanceData = [];
  active = {
    trialBalanceData: {
      mainGroup: [],
      subGroup: []
    }

  };
  viewType = 'main';
  isExpandMainGroup: boolean = false;
  isExpandAll: boolean = false;
  isExpand: string = '';
  openingbal =0;
  closingbal = 0;
  debitbal = 0;
  creditbal =0;
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public pdfService: PdfService,
    public csvService: CsvService,
    public accountService: AccountService,
    public modalService: NgbModal) {
    this.accountService.fromdate = (this.accountService.fromdate) ? this.accountService.fromdate : this.trial.startDate;
    this.accountService.todate = (this.accountService.todate) ? this.accountService.todate : this.trial.endDate;

    this.common.refresh = this.refresh.bind(this);

    //this.getVoucherTypeList();
    // this.getLedgerList();
    this.setFoucus('startDate');
    this.common.currentPage = 'Trial Balance';
  }

  ngOnInit() {
  }
  refresh() {
    // this.getVoucherTypeList();
    // this.getLedgerList();
    this.setFoucus('startDate');
  }



  getTrial() {
    this.trial.startDate = this.accountService.fromdate;
    this.trial.endDate = this.accountService.todate;

    console.log('Ledger:', this.trial);
    let params = {
      startdate: this.trial.startDate,
      enddate: this.trial.endDate
    };

    this.common.loading++;
    this.api.post('Accounts/getTrialBalance', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.TrialData = res['data'];
        // this.formattData(); 
        this.generalizeData();
        if (this.TrialData.length) {
          document.activeElement['blur']();
          this.selectedRow = 0;
        }
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  generalizeData() {
    this.openingbal =0;
    this.closingbal = 0;
    this.voucherEntries = [];
    for (let i = 0; i < this.TrialData.length; i++) {
      let ledgerRegister = this.TrialData[i];
     // console.log('ledgerRegister',ledgerRegister);
      let labels = ledgerRegister.y_path.split('-->');
      ledgerRegister.labels = labels.splice(1, labels.length);
      let index = this.voucherEntries.findIndex(voucher => voucher.name === labels[0]);
      if (index === -1) {
        this.voucherEntries.push({
          name: labels[0],
          data: [ledgerRegister] || ledgerRegister.y_ledger_name,
          debit: (parseFloat(ledgerRegister.y_dr_bal)),
          credit: (parseFloat(ledgerRegister.y_cr_bal)),
          opnbal: parseFloat(ledgerRegister.y_openbal),
          clobal: parseFloat(ledgerRegister.y_closebal),
          opnbaltype: ledgerRegister.y_openbaltype,
          clobaltype: ledgerRegister.y_closebaltype
        })
        
      } else {
        this.voucherEntries[index].debit += parseFloat(ledgerRegister.y_dr_bal);
        this.voucherEntries[index].credit += parseFloat(ledgerRegister.y_cr_bal);
        this.voucherEntries[index].opnbal += parseFloat(ledgerRegister.y_openbal);
        this.voucherEntries[index].clobal += parseFloat(ledgerRegister.y_closebal);
        this.voucherEntries[index].data.push(ledgerRegister);
      }
      this.openingbal += parseFloat(ledgerRegister.y_openbal);
      this.closingbal += parseFloat(ledgerRegister.y_closebal);
      this.debitbal += parseFloat(ledgerRegister.y_dr_bal);
      this.creditbal += parseFloat(ledgerRegister.y_cr_bal);
    }

    this.voucherEntries.map(voucher => voucher.data = this.findChilds(voucher.data));
    console.log('voucherEntries', this.voucherEntries,this.closingbal,'ds',this.openingbal);
  }
  findChilds(data) {
    let childs = [];
    for (let i = 0; i < data.length; i++) {
      if (data[i].labels.length) {
        let ledgerRegister = data[i];
        let labels = ledgerRegister.labels;
        ledgerRegister.labels = labels.splice(1, labels.length);
        let index = childs.findIndex(voucher => voucher.name === labels[0]);
        if (index === -1) {
          childs.push({
            name: labels[0],
            data: [ledgerRegister],
            debit: ledgerRegister.y_ledger_name ? parseFloat(ledgerRegister.y_dr_bal) : 0,
            credit: ledgerRegister.y_ledger_name ? parseFloat(ledgerRegister.y_cr_bal) : 0,
            opnbal: ledgerRegister.y_ledger_name ? parseFloat(ledgerRegister.y_openbal) : 0,
            clobal: ledgerRegister.y_ledger_name ? parseFloat(ledgerRegister.y_closebal) : 0,
            opnbaltype: ledgerRegister.y_openbaltype,
            clobaltype: ledgerRegister.y_closebaltype


          })
        } else {
          childs[index].debit += ledgerRegister.y_ledger_name ? parseFloat(ledgerRegister.y_dr_bal) : 0;
          childs[index].credit += ledgerRegister.y_ledger_name ? parseFloat(ledgerRegister.y_cr_bal) : 0;
          childs[index].opnbal += ledgerRegister.y_ledger_name ? parseFloat(ledgerRegister.y_openbal) : 0;
          childs[index].clobal += ledgerRegister.y_ledger_name ? parseFloat(ledgerRegister.y_closebal) : 0;
          childs[index].opnbaltype = (childs[index].opnbal < 0) ? 'Cr' : 'Dr';
          childs[index].clobaltype = (childs[index].clobal < 0) ? 'Cr' : 'Dr';
          if (ledgerRegister.y_ledger_name) {
            childs[index].data.push(ledgerRegister);
          }
        }
      } else { 
        childs.push({
          ledgerName: data[i].y_ledger_name,
          data: [],
          debit: data[i].y_dr_bal || 0,
          credit: data[i].y_cr_bal || 0,
          opnbal: data[i].y_openbal || 0,
          clobal: data[i].y_closebal || 0,
          ledgerid:data[i].y_ledgerid,
          opnbaltype: data[i].y_openbaltype,
          clobaltype: data[i].y_closebaltype
        });
      }
    }
    if (childs.length) {
      return childs.map(child => {
        if (child.data.length) {
          return {
            name: child.name,
            data: this.findChilds(child.data),
            debit: child.debit,
            credit: child.credit,
            opnbal: child.opnbal,
            clobal: child.clobal,
            opnbaltype: child.y_openbaltype,
            clobaltype: child.y_closebaltype
          }
        } else {
          return child;
        }
      }).sort((a, b)=>{
        if(a.length > b.length) return 1;
        return -1;
      });
    } else {
      let info = [];
      let groups = _.groupBy(data, 'y_ledger_name');
      // console.log('Groups:', groups);
      for (let group in groups) {
        if (groups[group].length > 1) {
          let details = {
            // name: group,
            ledgerName: group,
            data: groups[group].map(ledger => {
              ledger.y_ledger_name = '';
              return ledger;
            }),
            debit: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_dr_bal);
              return a;
            }, 0),
            credit: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_cr_bal);
              return a;
            }, 0),
            opnbal: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_openbal);
              return a;
            }, 0),
            clobal: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_closebal);
              return a;
            }, 0)
          }
          info.push(details);
        } else {
          // info.push(...groups[group]);
          let details = {
            //name: group,
            ledgerName: group,
            data: groups[group].map(ledger => {
              ledger.y_ledger_name = '';
              return ledger;
            }),
            debit: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_dr_bal);
              return a;
            }, 0),
            credit: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_cr_bal);
              return a;
            }, 0),
            opnbal: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_openbal);
              return a;
            }, 0),
            clobal: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_closebal);
              return a;
            }, 0)
          }
          info.push(details);
        }
      }
      return info;
    }
  }
  positiveLookingValue(a){
    return Math.abs(a);
  }
  changeViewType() {
    console.log('____________');
    this.active.trialBalanceData.mainGroup = [];
    this.active.trialBalanceData.subGroup = [];


    if (this.viewType == 'sub') {
      this.trialBalanceData.forEach((liability, i) => this.active.trialBalanceData.mainGroup.push('mainGroup' + i + 0));

    } else if (this.viewType == 'all') {
      this.trialBalanceData.forEach((trail, i) => {
        this.active.trialBalanceData.mainGroup.push('mainGroup' + i + 0);
        trail.subGroups.forEach((subGroup, j) => this.active.trialBalanceData.subGroup.push('subGroup' + i + j));
      });
    }
  }
  handleExpandation(event, index, type, section, parentIndex?) {
    console.log(index, section, parentIndex, this.active[type][section], section + index + parentIndex, this.active[type][section].indexOf(section + index + parentIndex));
    event.stopPropagation();
    if (this.active[type][section].indexOf(section + index + parentIndex) === -1) this.active[type][section].push(section + index + parentIndex)
    else {
      this.active[type][section].splice(this.active[type][section].indexOf(section + index + parentIndex), 1);
    }
  }
  formattData() {
    let primaryGroup = Object.keys(_.groupBy(this.TrialData, 'primary_groupname')).map(primaryGroupKey => {
      return {
        name: primaryGroupKey,
        amount: 0,
        dramount: 0,
        cramount: 0,
        openingamount: 0,
        openingType: '',
        closingType: '',
        subGroups: Object.keys(_.groupBy(_.groupBy(this.TrialData, 'primary_groupname')[primaryGroupKey], 'groupname')).map(subGroupKey => {
          return {
            name: subGroupKey,
            amount: 0,
            dramount: 0,
            cramount: 0,
            openingamount: 0,
            openingType: '',
            closingType: '',
            trialBalances: _.groupBy(_.groupBy(this.TrialData, 'primary_groupname')[primaryGroupKey], 'groupname')[subGroupKey]
          };
        })
      };
    });
    this.trialBalanceData = primaryGroup;
    console.log('trialBalanceData @@@', this.trialBalanceData);
    for (let key in primaryGroup) {

      primaryGroup.map(value => {
        let totalclosing = 0;
        let totaldr = 0;
        let totalcr = 0;
        let totalopening = 0;
        let openingType = '';
        let closingType = '';
        console.log('map value', value.subGroups);
        if (value.subGroups && value.subGroups.length > 0) {
          value.subGroups.map(valuenew => {

            let subtotalclosing = 0;
            let subtotaldr = 0;
            let subtotalcr = 0;
            let subtotalopening = 0;
            valuenew.trialBalances.map(trailvalue => {
              // console.log('trial map',trailvalue);
              openingType = trailvalue.y_openbaltype;
              closingType = trailvalue.y_closebaltype;
              if (trailvalue.y_closebal) {
                totalclosing += parseFloat(trailvalue.y_closebal);
                subtotalclosing += parseFloat(trailvalue.y_closebal);
              }
              if (trailvalue.y_dr_bal) {
                totaldr += parseFloat(trailvalue.y_dr_bal);
                subtotaldr += parseFloat(trailvalue.y_dr_bal);
              }
              if (trailvalue.y_cr_bal) {
                totalcr += parseFloat(trailvalue.y_cr_bal);
                subtotalcr += parseFloat(trailvalue.y_cr_bal);
              }
              if (trailvalue.y_openbal) {
                totalopening += parseFloat(trailvalue.y_openbal);
                subtotalopening += parseFloat(trailvalue.y_openbal);
              }
            })
            valuenew.amount = subtotalclosing;
            valuenew.dramount = subtotaldr;
            valuenew.cramount = subtotalcr;
            valuenew.openingamount = subtotalopening;
            valuenew.openingType = openingType;
            valuenew.closingType = closingType;
            // console.log('subgroup map',valuenew);
            // if (valuenew.y_amount) totalclosing += parseFloat(valuenew.y_amount);
          })
        }

        value.amount = totalclosing;
        value.dramount = totaldr;
        value.cramount = totalcr;
        value.openingamount = totalopening;
        value.openingType = openingType;
        value.closingType = closingType;
      });

    }
    console.log('trialBalanceData @@@', this.trialBalanceData);
    // this.trialBalanceData = [];
    // for (let key in firstGroup) {
    //   let groups = _.groupBy(firstGroup[key], 'y_ledger_name');
    //   let traildatas = [];
    //   let totalopening = 0;
    //   let totaldr = 0;
    //   let totalcr = 0;
    //   let totalclosing = 0;
    //   let y_closebaltype = '';
    //   let y_openbaltype = '';
    //   for (let groupKey in groups) {

    //     groups[groupKey].map(info => {
    //       if (info.y_openbal) totalopening += parseFloat(info.y_openbal);
    //       if (info.y_dr_bal) totaldr += parseFloat(info.y_dr_bal);
    //       if (info.y_closebal) totalcr += parseFloat(info.y_closebal);
    //       if (info.y_closebal) totalclosing += parseFloat(info.y_closebal);
    //       y_closebaltype = info.y_closebaltype;
    //       y_openbaltype = info.y_openbaltype;
    //       traildatas.push(info);
    //     });
    //   }

    //   this.trialBalanceData.push({
    //     name: key,
    //     totalopening,
    //     totaldr,
    //     totalcr,
    //     totalclosing,
    //     y_openbaltype,
    //     y_closebaltype,
    //     traildatas
    //   });


    // }




    console.log('First Section:', this.trialBalanceData);
    console.log('Second Section:', this.trialBalanceData);
    this.changeViewType();

  }
  pdfFunction() {
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        // this.Vouchers = res['data'];
        let address = res['data'][0].addressline + '\n';
        let remainingstring1 = (res['data'][0].phonenumber) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
        let remainingstring2 = (res['data'][0].panno) ? ', PAN No -  ' + res['data'][0].panno : '';
        let remainingstring3 = (res['data'][0].gstno) ? ', GST NO -  ' + res['data'][0].gstno : '';

        let cityaddress = address + remainingstring1 + remainingstring3;
        this.common.getPDFFromTableIdnew('table', res['data'][0].foname, cityaddress, '', '');

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  csvFunction() {
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        // this.Vouchers = res['data'];
        let address = res['data'][0].addressline + '\n';
        let remainingstring1 = (res['data'][0].phonenumber) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
        let remainingstring2 = (res['data'][0].panno) ? ', PAN No -  ' + res['data'][0].panno : '';
        let remainingstring3 = (res['data'][0].gstno) ? ' GST NO -  ' + res['data'][0].gstno : '';

        let cityaddress = address + remainingstring1;
        this.common.getCSVFromTableIdNew('table', res['data'][0].foname, cityaddress, '', '', remainingstring3);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.trial[date] = this.common.dateFormatternew(data.date).split(' ')[0];
      console.log(this.trial[date]);
    });
  }


  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    if (key == 'enter' && !this.activeId && this.TrialData.length && this.selectedRow != -1) {
      /***************************** Handle Row Enter ******************* */
      this.getBookDetail(this.TrialData[this.selectedRow]);
      return;
    }
    // if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startDate') || this.activeId.includes('endDate'))) {
    //   // document.getElementById("voucher-date").focus();
    //   // this.voucher.date = '';
    //   this.lastActiveId = this.activeId;
    //   this.setFoucus('voucher-date-f2', false);
    //   this.showDateModal = true;
    //   this.f2Date = this.activeId;
    //   this.activedateid = this.lastActiveId;
    //   return;
    // }
    else if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      this.handleVoucherDateOnEnter(this.activeId);
      this.setFoucus(this.lastActiveId);

      return;
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startDate') || this.activeId.includes('endDate'))) {
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('voucherType')) {
        this.setFoucus('ledger');
      } else if (this.activeId.includes('ledger')) {
        this.setFoucus('startDate');
      } else if (this.activeId.includes('startDate')) {
        this.trial.startDate = this.common.handleDateOnEnterNew(this.trial.startDate);
        this.setFoucus('endDate');
      } else if (this.activeId.includes('endDate')) {
        this.trial.endDate = this.common.handleDateOnEnterNew(this.trial.endDate);
        this.setFoucus('submit');
      }
    }
    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'endDate') this.setFoucus('startDate');
      if (this.activeId == 'startDate') this.setFoucus('ledger');
      if (this.activeId == 'ledger') this.setFoucus('voucherType');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((this.activeId == 'startDate' || this.activeId == 'endDate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }

    else if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.TrialData.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.TrialData.length - 1) this.selectedRow++;

    }
  }


  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startDate') ? 'startDate' : 'endDate';
    if (this.trial[datestring].includes('-')) {
      dateArray = this.trial[datestring].split('-');
    } else if (this.trial[datestring].includes('/')) {
      dateArray = this.trial[datestring].split('/');
      separator = '/';
    } else {
      this.common.showError('Invalid Date Format!');
      return;
    }
    let date = dateArray[0];
    date = date.length == 1 ? '0' + date : date;
    let month = dateArray[1];
    month = month.length == 1 ? '0' + month : month;
    let year = dateArray[2];
    year = year.length == 1 ? '200' + year : year.length == 2 ? '20' + year : year;
    console.log('Date: ', date + separator + month + separator + year);
    this.trial[datestring] = date + separator + month + separator + year;
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


  getBookDetail(vcrdata) {
    console.log('vouher id', vcrdata);
    //  this.common.params = voucherId;
    if (vcrdata.ledgerName.includes('Profit & Loss A/c')) {
      this.getProfitLoss();
    } else {
      this.common.params = {
        startdate: this.trial.startDate,
        enddate: this.trial.endDate,
        ledger: vcrdata.ledgerid,
        vouchertype: 0,
        ledgername: vcrdata.ledgerName

      };
      const activeModal = this.modalService.open(LedgerviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          return;
          //   if (stocksubType) {

          //     this.updateStockSubType(stocksubType.id, data.stockSubType);
          //     return;
          //   }
          //  this.addStockSubType(data.stockSubType)
        }
      });
    }
  }

  getProfitLoss() {
    this.common.params = {
      startdate: this.trial.startDate,
      enddate: this.trial.endDate
    };
    console.log('start date and date', this.common.params);
    //  this.common.params = voucherId;

    const activeModal = this.modalService.open(ProfitlossComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        return;

      }
    });
  }

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }
  generateCsvData() {
    let liabilitiesJson = [];
    liabilitiesJson.push(Object.assign({ Ledger: "Ledger", OpeningBalance: 'Opening Balance', amountdr: 'Amount(Debit)', amountcr: 'Amount(Credit)', amount: 'Closing Balance' }));
    this.trialBalanceData.forEach(liability => {
      liabilitiesJson.push({ Ledger: '(MG)' + liability.name, OpeningBalance: liability.openingamount, amountdr: liability.dramount, amountcr: liability.cramount, amount: liability.amount });
      liability.subGroups.forEach(subGroup => {
        liabilitiesJson.push({ Ledger: '(SG)' + subGroup.name, OpeningBalance: subGroup.openingamount, amountdr: subGroup.dramount, amountcr: subGroup.cramount, amount: subGroup.amount });
        subGroup.trialBalances.forEach(trailbalance => {
          liabilitiesJson.push({ Ledger: '(L)' + trailbalance.y_ledger_name, OpeningBalance: trailbalance.y_openbal, amountdr: trailbalance.y_dr_bal, amountcr: trailbalance.y_cr_bal, amount: trailbalance.y_closebal });
        });
      });
    });
    liabilitiesJson.push(Object.assign({}, { "": 'MG = Main Group ,SG = Sub Group, L = Ledger' }))

    // let mergedArray = [];
    // for (let i = 0; i < liabilitiesJson.length || i < assetsJson.length; i++) {
    //   if (liabilitiesJson[i] && assetsJson[i] && i < liabilitiesJson.length - 1 && i < assetsJson.length - 1) {
    //     mergedArray.push(Object.assign({}, liabilitiesJson[i], assetsJson[i]));
    //   } else if (liabilitiesJson[i] && i < liabilitiesJson.length - 1) {
    //     mergedArray.push(Object.assign({}, liabilitiesJson[i], { asset: '', assetAmount: '' }));
    //   } else if (assetsJson[i] && i < assetsJson.length - 1) {
    //     mergedArray.push(Object.assign({}, { liability: '', liabilityAmount: '' }, assetsJson[i]));
    //   }
    // }
    // mergedArray.push(Object.assign({}, liabilitiesJson[liabilitiesJson.length - 1], assetsJson[assetsJson.length - 1]))

    this.csvService.jsonToExcel(liabilitiesJson);
    console.log('Merged:', liabilitiesJson);
  }


}

