import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { LedgerviewComponent } from '../../acounts-modals/ledgerview/ledgerview.component';
import { ProfitlossComponent } from '../../accounts/profitloss/profitloss.component';
import * as _ from 'lodash';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { AccountService } from '../../services/account.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@Component({
  selector: 'balance-sheet-tree',
  templateUrl: './balancesheet.tree.html',
  styleUrls: ['./balancesheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'keyHandler($event)'
  }
})
export class BalanceSheetTreeComponent {
  @Input() data: any;
  @Input() active: boolean;
  @Input() labels: string;
  @Input() action: any;
  @Input() isExpandAll: boolean;
  @Input() color: number = 0;
  @Input() getaction: any;
  activeIndex: boolean = false;
  selectedRow: number = -1;
  colors = ['#5d6e75', '#6f8a96', '#8DAAB8', '#a4bbca', 'bfcfd9'];
  deletedId = 0;
  search = '';
  searchedData = [];

  constructor(public common: CommonService,
    public modalService: NgbModal,
    public user: UserService, public cdr: ChangeDetectorRef,
    public accountService: AccountService) {
  }

  ngOnChanges(changes) {
    if (changes.data) {
      this.data = changes.data.currentValue;
      this.searchedData = this.data;
    }
  }

  lastClickHandler(event, index) {
    this.selectedRow = parseInt(index);
    event.stopPropagation();
  }

  clickHandler(event, index) {
    event.stopPropagation();
    this.activeIndex = this.activeIndex !== index ? index : -1
  }

  doubleClickHandler(event, data) {
    event.stopPropagation();
    this.action(data);
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

  searchValues() {
    this.searchedData = this.data.filter(x => {
      if (x.name) {
        return x.name.toLowerCase().includes(this.search.toLowerCase())
      } else if (x.ledgerName) {
        return x.ledgerName.toLowerCase().includes(this.search.toLowerCase())
      }
      return false;
    });
    this.cdr.detectChanges();
  }
}


@AutoUnsubscribe()
@Component({
  selector: 'balancesheet',
  templateUrl: './balancesheet.component.html',
  styleUrls: ['./balancesheet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalancesheetComponent implements OnInit {
  selectedName = '';
  balanceData = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: ((((new Date()).getMonth()) + 1) > 3) ? this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-') : this.common.dateFormatternew(((new Date().getFullYear()) - 1) + '-04-01', 'ddMMYYYY', false, '-'),
  };
  branchdata = [];
  balanceSheetData = [];
  activeId = '';

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
  viewType = 'main';
  assettottalamount = 0;
  libilitytottalamount = 0;
  isExpandMainGroup: boolean = false;
  isExpandAll: boolean = false;
  isExpand: string = '';
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public pdfService: PdfService,
    public csvService: CsvService,
    public accountService: AccountService,
    public cdr: ChangeDetectorRef,
    public modalService: NgbModal) {
    this.accountService.fromdate = (this.accountService.fromdate) ? this.accountService.fromdate : this.balanceData.startdate;
    this.accountService.todate = (this.accountService.todate) ? this.accountService.todate : this.balanceData.enddate;

    this.setFoucus('startdate');
    this.common.currentPage = 'Balance Sheet';
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  getBalanceSheet() {
    this.balanceData.startdate = this.accountService.fromdate;
    this.balanceData.enddate = this.accountService.todate;
    let params = {
      startdate: this.balanceData.startdate,
      enddate: this.balanceData.enddate,
    };

    this.common.loading++;
    this.api.post('Company/GetBalanceData', params)
      .subscribe(res => {
        this.common.loading--;
        // console.log('Res bal sheet:', res['data']);
        this.balanceSheetData = res['data'];
        this.generalizeData();

        //this.formattData();
      }, err => {
        this.common.loading--;
        // console.log('Error: ', err);
        this.common.showError();
      });

  }
  generalizeData() {
    this.assettottalamount = 0;
    this.libilitytottalamount = 0;
    let assetsGroup = _.groupBy(this.balanceSheetData, 'y_is_assets');
    let firstGroup = assetsGroup['0'];
    let secondGroup = assetsGroup['1'];
    //let firstGroup = _.groupBy(assetsGroup['0'], 'y_groupname');
    // let secondGroup = _.groupBy(assetsGroup['1'], 'y_groupname');
    this.assets = [];
    this.liabilities = [];
    for (let i = 0; i < firstGroup.length; i++) {
      let ledgerRegister = firstGroup[i];
      //console.log('ledgerRegister.y_path:', ledgerRegister.y_path);
      let labels = [];
      if (ledgerRegister.y_path)
        labels = ledgerRegister.y_path.split('-->');
      ledgerRegister.labels = labels.splice(1, labels.length);
      let index = this.assets.findIndex(voucher => voucher.name === labels[0]);
      if (index === -1) {
        this.assets.push({
          name: labels[0] || ledgerRegister.y_groupname,
          data: [ledgerRegister],
          amount: parseFloat(ledgerRegister.y_amount)
        })
      } else {
        this.assets[index].amount += parseFloat(ledgerRegister.y_amount);
        this.assets[index].data.push(ledgerRegister);
      }
    }
    console.log('assets', this.assets);
    this.assets.map(voucher => voucher.data = this.findChilds(voucher.data));

    console.log('assets', this.assets);
    for (let i = 0; i < secondGroup.length; i++) {
      let ledgerRegister = secondGroup[i];
      // console.log('ledgerRegister.y_path:', ledgerRegister.y_path);
      let labels = [];
      if (ledgerRegister.y_path)
        labels = ledgerRegister.y_path.split('-->');

      ledgerRegister.labels = labels.splice(1, labels.length);
      let index = this.liabilities.findIndex(voucher => voucher.name === labels[0]);
      if (index === -1) {
        this.liabilities.push({
          name: labels[0] || ledgerRegister.y_groupname,
          data: [ledgerRegister],
          amount: parseFloat(ledgerRegister.y_amount),
        })
      } else {
        this.liabilities[index].amount += parseFloat(ledgerRegister.y_amount);
        this.liabilities[index].data.push(ledgerRegister);
      }
    }
    this.liabilities.map(voucher => voucher.data = this.findChilds(voucher.data));
    console.log('liabilities', this.liabilities);
    this.cdr.detectChanges();
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
            amount: ledgerRegister.y_ledger_name ? parseFloat(ledgerRegister.y_amount) : 0
          })
        } else {
          childs[index].amount += ledgerRegister.y_ledger_name ? parseFloat(ledgerRegister.y_amount) : 0;
          if (ledgerRegister.y_ledger_name) {
            childs[index].data.push(ledgerRegister);
          }
        }
      } else {
        childs.push({
          ledgerName: data[i].y_ledger_name,
          ledgerdata: data[i],
          data: [],
          amount: data[i].y_amount,
          ledgerid: data[i].y_ledgerid,
          colorflag: 1
        });
      }
    }

    if (childs.length) {
      return childs.map(child => {
        if (child.data.length) {
          return {
            name: child.name,
            data: this.findChilds(child.data),
            amount: child.amount,
          }
        } else {
          return child;
        }
      }).sort((a, b) => {
        if (a.length > b.length) return 1;
        return -1;
      });
    } else {
      let info = [];
      let groups = _.groupBy(data, 'y_ledger_name');
      for (let group in groups) {
        if (groups[group].length > 1 && group) {
          let details = {
            ledgerName: group,
            ledgerdata: groups[group],
            amount: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_amount);
              return a;
            }, 0)
          }
          info.push(details);
        } else if (group) {
          let details = {
            ledgerName: group,
            amount: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_amount);
              return a;
            }, 0)
          }
          info.push(details);
        }
      }
      return info;
    }
  }


  formattData() {
    let assetsGroup = _.groupBy(this.balanceSheetData, 'y_is_assets');
    let firstGroup = _.groupBy(assetsGroup['0'], 'y_groupname');
    let secondGroup = _.groupBy(assetsGroup['1'], 'y_groupname');
    this.liabilities = [];
    for (let key in firstGroup) {
      let total = 0;
      firstGroup[key].map(value => {
        if (value.y_amount) total += parseFloat(value.y_amount);
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
        if (value.y_amount) total += parseFloat(value.y_amount);
      });

      this.assets.push({
        name: key,
        amount: total,
        balanceSheets: secondGroup[key].filter(balanceSheet => { return balanceSheet.y_ledger_name; })
      })
    }


    this.liabilities.map(libility => {
      let subGroups = _.groupBy(libility.balanceSheets, 'y_sub_groupname');
      libility.subGroups = [];
      if (Object.keys(subGroups).length) {
        Object.keys(subGroups).forEach(key => {
          let total = 0;
          subGroups[key].forEach(balanceSheet => {
            total += parseFloat(balanceSheet.y_amount)
          });
          libility.subGroups.push({
            name: key,
            balanceSheets: subGroups[key],
            total
          });

        });
      }
      delete libility.balanceSheets;
    });

    this.assets.map(asset => {
      let subGroups = _.groupBy(asset.balanceSheets, 'y_sub_groupname');
      asset.subGroups = [];
      if (Object.keys(subGroups).length) {
        Object.keys(subGroups).forEach(key => {
          let total = 0;
          subGroups[key].forEach(balanceSheet => {
            total += parseFloat(balanceSheet.y_amount)
          });
          asset.subGroups.push({
            name: key,
            balanceSheets: subGroups[key],
            total
          });

          //  console.log(subGroups[key], total);
        });
      }
      delete asset.balanceSheets;
    });

    this.changeViewType();
  }

  filterData(assetdata, slug) {
    return assetdata.filter(data => { return (data.y_is_assets === slug ? true : false) });
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    // console.log('Active event', event);

    // if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
    //   // document.getElementById("voucher-date").focus();
    //   // this.voucher.date = '';
    //   this.lastActiveId = this.activeId;
    //   this.setFoucus('voucher-date-f2', false);
    //   this.showDateModal = true;
    //   this.f2Date = this.activeId;
    //   this.activedateid = this.lastActiveId;
    //   return;
    // } else 
    if ((key == 'enter' && this.showDateModal)) {
      this.showDateModal = false;
      //  console.log('Last Ac: ', this.lastActiveId);
      this.handleVoucherDateOnEnter(this.activeId);
      this.setFoucus(this.lastActiveId);

      return;
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startdate') || this.activeId.includes('enddate'))) {
      return;
    }

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
      // console.log('active 1', this.activeId);
      if (this.activeId == 'enddate') this.setFoucus('startdate');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((this.activeId == 'startdate' || this.activeId == 'enddate') && key !== 'backspace') {
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
    if (this.balanceData[datestring].includes('-')) {
      dateArray = this.balanceData[datestring].split('-');
    } else if (this.balanceData[datestring].includes('/')) {
      dateArray = this.balanceData[datestring].split('/');
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
    // console.log('Date: ', date + separator + month + separator + year);
    this.balanceData[datestring] = date + separator + month + separator + year;
  }
  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      // console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
  }

  opendaybookmodel(data) {

      console.log('ledger id 00000',data, data.ledgerdata.y_path);
      if(data.ledgerdata.y_path.includes('Profit & Loss')){
        this.common.params = {
          startdate: this.accountService.fromdate,
          enddate: this.accountService.todate,
          isModal:true
        };
        const activeModal = this.modalService.open(ProfitlossComponent, { size: 'lg', container: 'nb-layout', windowClass: 'page-as-modal', });
        activeModal.result.then(data => {
          console.log('Data: invoice ', data);
            if (data.msg) {
              //console.log('open succesfull');
          }
        });
      }else{
      this.common.params = {
        startdate: this.balanceData.startdate,
        enddate: this.balanceData.enddate,
        ledger: data.ledgerid,
        vouchertype: 0,
        ledgername: data.ledgerName
      };
      const activeModal = this.modalService.open(LedgerviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
      activeModal.result.then(data => {

      });
    }
    this.common.currentPage = 'Balance Sheet';
  }
  RowSelected(u: any) {
    // console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }


  getProfitLoss() {
    this.common.params = {
      startdate: this.balanceData.startdate,
      enddate: this.balanceData.enddate
    };
    // console.log('start date and date', this.common.params);
    //  this.common.params = voucherId;

    const activeModal = this.modalService.open(ProfitlossComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      if (data.response) {
        return;

      }
    });
  }

  handleExpandation(event, index, type, section, parentIndex?) {
    // console.log(index, section, parentIndex, this.active[type][section], section + index + parentIndex, this.active[type][section].indexOf(section + index + parentIndex));
    event.stopPropagation();
    if (this.active[type][section].indexOf(section + index + parentIndex) === -1) this.active[type][section].push(section + index + parentIndex)
    else {
      this.active[type][section].splice(this.active[type][section].indexOf(section + index + parentIndex), 1);
    }
  }

  /**
   * Change Balance Sheet View Type to MainGroup, SubGroup or All
   */
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

  csvFunction() {
    if(this.isExpand == 'main'){
      this.singleFormatCsvData();
    } else{
    let jrxJson = [];
    let libilityJson = [];
    let data = [];
    jrxJson.push(Object.assign({
      particular: "Liability",
      openingamount: "Amount",
     
    }));
    libilityJson.push(Object.assign({
      particular: "Asset",
      openingamount: "Amount",
     
    }));
    this.assets.forEach(voucher => {
      jrxJson.push({
        particular: voucher.name,
        openingamount: (voucher.amount==0)? '' :(voucher.amount) ,
         });
      jrxJson.push(...this.generateCSVData(voucher.data, '  '));
    });

    this.liabilities.forEach(voucher => {
      libilityJson.push({
        particular: voucher.name,
        openingamount: (voucher.amount==0)? '' :(voucher.amount) ,
         });
         libilityJson.push(...this.generateCSVData(voucher.data, '  '));
    });


    for (let i = 0; i < jrxJson.length; i++) {
      let info = {
        libilities: jrxJson[i].particular,
        "Amount": jrxJson[i].openingamount,
      };
      data.push(info);
    }

    for (let i = 0; i < libilityJson.length; i++) {
      if (i < data.length) {
        data[i]["asstes"] = libilityJson[i].particular;
        data[i]["asstes amount"] = libilityJson[i].openingamount;
      } else {
        let info = {
          "libilities": '',
          "libilities Amount": '',
          asstes: libilityJson[i].particular,
          "asstes amount": libilityJson[i].openingamount,
        };
        data.push(info);
      }
    } 
    //console.log('final data:', data)
    this.csvService.jsonToExcel(data);
  }
  
}
 
  generateCSVData(vouchers, str) {
    
    let json = [];
    for (let i = 0; i < vouchers.length; i++) {
      let voucher = vouchers[i];
      if (voucher.name) {
        json.push({
          particular: str + voucher.name,
          openingamount: voucher.amount,
          });
        json.push(...this.generateCSVData(voucher.data, str + '  '));
      } else {
        json.push({
          particular: str + voucher.ledgerName,
          openingamount: voucher.amount,
           });
      }
    }
    return json;
  
  }

  singleFormatCsvData() {
    let liabilitiesJson = [];
    liabilitiesJson.push(Object.assign({ liability: " Liability", liabilityAmount: 'Amount' }));

    this.assets.forEach(liabilitydata => {
      liabilitiesJson.push({ liability: liabilitydata.name, liabilityAmount: liabilitydata.amount });
      
    });

    let assetsJson = [];
    assetsJson.push(Object.assign({ asset: "Asset", assetAmount: 'Amount' }));
    this.liabilities.forEach(assetdata => {
      assetsJson.push({ asset: assetdata.name, assetAmount: assetdata.amount });
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
   
    this.csvService.jsonToExcel(mergedArray);
    // console.log('Merged:', mergedArray);
  }

}
