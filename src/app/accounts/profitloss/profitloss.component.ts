import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import * as _ from 'lodash';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { LedgerviewComponent } from '../../acounts-modals/ledgerview/ledgerview.component';

@Component({
  selector: 'profitloss',
  templateUrl: './profitloss.component.html',
  styleUrls: ['./profitloss.component.scss']
})
export class ProfitlossComponent implements OnInit {
  selectedName = '';
  plData = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-'),
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

  f2Date = 'startdate';
  lastActiveId = '';
  showDateModal = false;
  activedateid = '';
  active = {
    liabilities: {
      mainGroup: [],
      subGroup: []
    },
    asset: {
      mainGroup: [],
      subGroup: []
    }
  };
  viewType = 'sub';

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public pdfService: PdfService,
    public csvService: CsvService,
    public modalService: NgbModal) {
    // this.getBalanceSheet();
    this.getBranchList();
    this.setFoucus('startdate');
    this.common.currentPage = 'Profit & Loss A/C';
   // this.common.handleModalSize('class', 'modal-lg', '1150', 'px', 0);

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
    let assetsGroup = _.groupBy(this.profitLossData, 'y_is_income');
    let firstGroup = _.groupBy(assetsGroup['0'], 'y_groupname');
    let secondGroup = _.groupBy(assetsGroup['1'], 'y_groupname');
    let subFirstGroup = _.groupBy(assetsGroup['0'], 'y_subgroupname');
    let subSecondGroup = _.groupBy(assetsGroup['1'], 'y_subgroupname');

    console.log('A:', assetsGroup);
    console.log('B:', firstGroup);
    console.log('C:', secondGroup);
    this.liabilities = [];
    for (let key in firstGroup) {
      let total = 0;
      firstGroup[key].map(value => {
        if (value.y_amount) total += parseFloat(value.y_amount);
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
        if (value.y_amount) total += parseFloat(value.y_amount);
      });

      this.assets.push({
        name: key,
        amount: total,
        profitLossData: secondGroup[key].filter(profitLossData => { return profitLossData.y_ledger_name; })
      })
    }

    console.log('first Section:', this.liabilities);
    console.log('last Section:', this.assets);

    this.liabilities.map(libility => {
      let subGroups = _.groupBy(libility.profitLossData, 'y_subgroupname');
      libility.subGroups = [];
      if (Object.keys(subGroups).length) {
        Object.keys(subGroups).forEach(key => {
          let total = 0;
          subGroups[key].forEach(profitLossData => {
            total += parseFloat(profitLossData.y_amount)
          });
          libility.subGroups.push({
            name: key,
            profitLossData: subGroups[key],
            total
          });

        });
      }
      delete libility.profitLossData;
    });

    console.log('first Section------:', this.liabilities);

    this.assets.map(asset => {
      let subGroups = _.groupBy(asset.profitLossData, 'y_subgroupname');
      asset.subGroups = [];
      if (Object.keys(subGroups).length) {
        Object.keys(subGroups).forEach(key => {
          let total = 0;
          subGroups[key].forEach(profitLossData => {
            total += parseFloat(profitLossData.y_amount)
          });
          asset.subGroups.push({
            name: key,
            profitLossData: subGroups[key],
            total
          });

          console.log(subGroups[key], total);
        });
      }
      delete asset.profitLossData;
    });
    this.changeViewType();
  }

  filterData(assetdata, slug) {
    return assetdata.filter(data => { return (data.y_is_assets === slug ? true : false) });
  }
  handleExpandation(event, index, type, section, parentIndex?) {
    console.log(index, section, parentIndex, this.active[type][section], section + index + parentIndex, this.active[type][section].indexOf(section + index + parentIndex));
    event.stopPropagation();
    if (this.active[type][section].indexOf(section + index + parentIndex) === -1) this.active[type][section].push(section + index + parentIndex)
    else {
      this.active[type][section].splice(this.active[type][section].indexOf(section + index + parentIndex), 1);
    }
  }
  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);

    if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
      // document.getElementById("voucher-date").focus();
      // this.voucher.date = '';
      this.lastActiveId = this.activeId;
      this.setFoucus('voucher-date-f2', false);
      this.showDateModal = true;
      this.f2Date = this.activeId;
      this.activedateid = this.lastActiveId;
      return;
    } else if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      console.log('Last Ac: ', this.lastActiveId);
      this.handleVoucherDateOnEnter(this.activeId);
      this.setFoucus(this.lastActiveId);

      return;
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
      return;
    }

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
    }else if ((this.activeId == 'startdate' || this.activeId == 'enddate') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    } else if (key != 'backspace') {
      this.allowBackspace = false;
    }

  }

  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'startdate') ? 'startdate' : 'enddate';
    if (this.plData[datestring].includes('-')) {
      dateArray = this.plData[datestring].split('-');
    } else if (this.plData[datestring].includes('/')) {
      dateArray = this.plData[datestring].split('/');
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
    this.plData[datestring] = date + separator + month + separator + year;
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

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }
  openLedgerViewModel(ledgerId, ledgerName,typeid) {
    console.log('ledger id 00000', ledgerId);
    this.common.params = {
      startdate: this.plData.startdate,
      enddate: this.plData.enddate,
      ledger: ledgerId,
      vouchertype: (typeid==null) ? 0: typeid,
      ledgername: ledgerName
    };
    const activeModal = this.modalService.open(LedgerviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      //this.getDayBook();
      //this.common.showToast('Voucher updated');

    });
  }

  generateCsvData() {
    let liabilitiesJson = [];
    liabilitiesJson.push(Object.assign({liability:"Particulars",liabilityAmount:'Amount'}));
    this.liabilities.forEach(liability => {
      liabilitiesJson.push({ liability: '(MG)'+liability.name, liabilityAmount: liability.amount });
      liability.subGroups.forEach(subGroup => {
        liabilitiesJson.push({ liability: '(SG)'+subGroup.name, liabilityAmount: subGroup.total });
        subGroup.profitLossData.forEach(balanceSheet => {
          liabilitiesJson.push({ liability: '(L)'+balanceSheet.y_ledger_name, liabilityAmount: balanceSheet.y_amount });
        });
      });
    });

    let assetsJson = [];
    assetsJson.push(Object.assign({asset:"Particulars",assetAmount:'Amount'}));
    this.assets.forEach(asset => {
      assetsJson.push({ asset: '(MG)'+asset.name, assetAmount: asset.amount });
      asset.subGroups.forEach(subGroup => {
        assetsJson.push({ asset: '(SG)'+subGroup.name, assetAmount: subGroup.total });
        subGroup.profitLossData.forEach(balanceSheet => {
          assetsJson.push({ asset:'(L)'+ balanceSheet.y_ledger_name, assetAmount: balanceSheet.y_amount });
        });
      });
    });
    let mergedArray = [];
    for (let i = 0; i < liabilitiesJson.length || i < assetsJson.length; i++) {
      if (liabilitiesJson[i] && assetsJson[i] && i < liabilitiesJson.length - 1 && i < assetsJson.length - 1) {
        mergedArray.push(Object.assign({}, liabilitiesJson[i], assetsJson[i]));
      } else if (liabilitiesJson[i] && i < liabilitiesJson.length - 1) {
        mergedArray.push(Object.assign({}, liabilitiesJson[i], { asset: '', assetAmount: '' }));
      } else if (assetsJson[i] && i < assetsJson.length - 1) {
        mergedArray.push(Object.assign({}, { liability: '', liabilityAmount: '' }, assetsJson[i]));
      }
    }
    mergedArray.push(Object.assign({}, liabilitiesJson[liabilitiesJson.length - 1], assetsJson[assetsJson.length - 1]))
    mergedArray.push(Object.assign({}, {"":'MG = Main Group ,SG = Sub Group, L = Ledger'}))


    this.csvService.jsonToExcel(mergedArray);
    console.log('Merged:', mergedArray);
  }

  changeViewType() {
    this.active.liabilities.mainGroup = [];
    this.active.liabilities.subGroup = [];
    this.active.asset.mainGroup = [];
    this.active.asset.subGroup = [];

    if (this.viewType == 'sub') {
      this.liabilities.forEach((liability, i) => this.active.liabilities.mainGroup.push('mainGroup' + i + 0));
      this.assets.forEach((asset, i) => this.active.asset.mainGroup.push('mainGroup' + i + 0));
    } else if (this.viewType == 'all') {
      this.liabilities.forEach((liability, i) => {
        this.active.liabilities.mainGroup.push('mainGroup' + i + 0);
        liability.subGroups.forEach((subGroup, j) => this.active.liabilities.subGroup.push('subGroup' + i + j));
      });

      this.assets.forEach((asset, i) => {
        this.active.asset.mainGroup.push('mainGroup' + i + 0);
        asset.subGroups.forEach((subGroup, j) => this.active.asset.subGroup.push('subGroup' + i + j));
      });
    }
  }
}
