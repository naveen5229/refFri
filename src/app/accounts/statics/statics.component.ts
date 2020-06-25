import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { DaybookComponent } from '../../acounts-modals/daybook/daybook.component';
import { LedgerviewComponent } from '../../acounts-modals/ledgerview/ledgerview.component';
import { ProfitlossComponent } from '../../acounts-modals/profitloss/profitloss.component';
import * as _ from 'lodash';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { StockitemsComponent } from '../stockitems/stockitems.component';
import { StockSubtypesComponent} from '../stock-subtypes/stock-subtypes.component';
import { StockTypesComponent } from '../stock-types/stock-types.component';
import { AccountComponent} from '../account/account.component';
import { LedgersComponent } from '../ledgers/ledgers.component';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'statics',
  templateUrl: './statics.component.html',
  styleUrls: ['./statics.component.scss']
})
export class StaticsComponent implements OnInit {
  selectedName = '';
  staticsData = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: ((((new Date()).getMonth())+1) > 3) ? this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-') : this.common.dateFormatternew(((new Date().getFullYear())-1) + '-04-01', 'ddMMYYYY', false, '-'),
  };
  branchdata = [];
  staticsSheetData = [];
  activeId = '';
  approved1=0;
  approved2=0;

  pending1=0;
  pending2=0;

  assetApproved=0;
  assetPending=0

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
    public modalService: NgbModal,
    public accountService: AccountService) {
      this.accountService.fromdate = (this.accountService.fromdate) ? this.accountService.fromdate: this.staticsData.startdate;
      this.accountService.todate = (this.accountService.todate)? this.accountService.todate: this.staticsData.enddate;
       
    this.setFoucus('startdate');
    this.common.currentPage = 'Accounts Statics';
  console.log('current month',((new Date().getFullYear())-1),((((new Date()).getMonth())+1) > 3) );

  }

  ngOnInit() {
  }

  getStaticsSheet() {
    this.staticsData.startdate= this.accountService.fromdate;
    this.staticsData.enddate= this.accountService.todate;
    let params = {
      startdate: this.staticsData.startdate,
      enddate: this.staticsData.enddate,
    };

    this.common.loading++;
    this.api.post('Voucher/getStaticsData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res statics data:', res['data']);
        this.staticsSheetData = res['data'];
        this.formattData();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  formattData() {
    let assetsGroup = _.groupBy(this.staticsSheetData, 'y_groupid');
    let firstGroup = _.groupBy(assetsGroup['0'], 'y_group_name');
    let secondGroup = _.groupBy(assetsGroup['1'], 'y_group_name');
    console.log('A:', assetsGroup);
    console.log('B:', firstGroup);
    console.log('C:', secondGroup);
    this.liabilities = [];
    let approvalTotal = 0;
    let pendingTotal = 0;
    for (let key in firstGroup) {


      firstGroup[key].map(value => {
        if (value.y_total_approved) approvalTotal += parseFloat(value.y_total_approved);
        if (value.y_total_pending) pendingTotal += parseFloat(value.y_total_pending);
      });


      this.liabilities.push({
        name: key,
        approve: approvalTotal,
        pending: pendingTotal,
        balanceSheets: firstGroup[key].filter(balanceSheet => { return balanceSheet.y_name; })
      })
    }

    this.assets = [];
    let approvalTotal1 = 0;
    let pendingTotal1 = 0;
    for (let key in secondGroup) {
      let total = 0;


      secondGroup[key].map(value => {
        if (value.y_total_approved) approvalTotal1 += parseFloat(value.y_total_approved);
        if (value.y_total_pending) pendingTotal1 += parseFloat(value.y_total_pending);
      });
      this.assets.push({
        name: key,
        approve: approvalTotal1,
        pending: pendingTotal1,
        balanceSheets: secondGroup[key].filter(balanceSheet => { return balanceSheet.y_name; })
      })
    }

    console.log('liabilities', this.liabilities, 'asset data ', this.assets);
    const approve1 = this.liabilities[0]['balanceSheets'].reduce((sum, item) => sum + item.y_total_approved, 0);
    this.approved1=approve1;

    const approve2 = this.liabilities[1]['balanceSheets'].reduce((sum, item) => sum + item.y_total_approved, 0);
    this.approved2=approve2;
    
    const pending1 = this.liabilities[0]['balanceSheets'].reduce((sum, item) => sum + item.y_total_pending, 0);
    this.pending1=pending1;

    const pending2 = this.liabilities[1]['balanceSheets'].reduce((sum, item) => sum + item.y_total_pending, 0);
    this.pending2=pending2;

    const assetapprove=this.assets[0]['balanceSheets'].reduce((sum, item) => sum + item.y_total_approved, 0);
    this.assetApproved=assetapprove;

    const assetPendings=this.assets[0]['balanceSheets'].reduce((sum, item) => sum + item.y_total_pending, 0);
    this.assetPending=assetPendings;


    // this.liabilities.map(libility => {
    //   let subGroups = _.groupBy(libility.balanceSheets, 'y_sub_groupname');
    //   libility.subGroups = [];
    //   if (Object.keys(subGroups).length) {
    //     Object.keys(subGroups).forEach(key => {
    //       let total = 0;
    //       subGroups[key].forEach(balanceSheet => {
    //         total += parseFloat(balanceSheet.y_amount)
    //       });
    //       libility.subGroups.push({
    //         name: key,
    //         balanceSheets: subGroups[key],
    //         total
    //       });

    //     });
    //   }
    //   delete libility.balanceSheets;
    // });

    // this.assets.map(asset => {
    //   let subGroups = _.groupBy(asset.balanceSheets, 'y_sub_groupname');
    //   asset.subGroups = [];
    //   if (Object.keys(subGroups).length) {
    //     Object.keys(subGroups).forEach(key => {
    //       let total = 0;
    //       subGroups[key].forEach(balanceSheet => {
    //         total += parseFloat(balanceSheet.y_amount)
    //       });
    //       asset.subGroups.push({
    //         name: key,
    //         balanceSheets: subGroups[key],
    //         total
    //       });

    //       console.log(subGroups[key], total);
    //     });
    //   }
    //   delete asset.balanceSheets;
    // });

    this.changeViewType();
  }

  filterData(assetdata, slug) {
    return assetdata.filter(data => { return (data.y_is_assets === slug ? true : false) });
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);

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
        this.staticsData.startdate = this.common.handleDateOnEnterNew(this.staticsData.startdate);
        this.setFoucus('enddate');
      } else if (this.activeId.includes('enddate')) {
        this.staticsData.enddate = this.common.handleDateOnEnterNew(this.staticsData.enddate);
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
    if (this.staticsData[datestring].includes('-')) {
      dateArray = this.staticsData[datestring].split('-');
    } else if (this.staticsData[datestring].includes('/')) {
      dateArray = this.staticsData[datestring].split('/');
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
    this.staticsData[datestring] = date + separator + month + separator + year;
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

  opendaybookmodel(vtid, idDelete) {
    this.common.params = {
      startdate: this.staticsData.startdate,
      enddate: this.staticsData.enddate,
      ledger: 0,
      vouchertype: vtid,
      deleteId: idDelete
    };
    const activeModal = this.modalService.open(DaybookComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      //this.getDayBook();
      //this.common.showToast('Voucher updated');
    this.common.currentPage = 'Accounts Statics';


    });
  }


  
  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }


  getProfitLoss() {
    this.common.params = {
      startdate: this.staticsData.startdate,
      enddate: this.staticsData.enddate
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

  handleExpandation(event, index, type, section, parentIndex?) {
    console.log(index, section, parentIndex, this.active[type][section], section + index + parentIndex, this.active[type][section].indexOf(section + index + parentIndex));
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

  generateCsvData() {
    let liabilitiesJson = [];
    liabilitiesJson.push(Object.assign({ liability: "Types", liabilityAmount: 'Approved',pending:'Pending' }));

    this.liabilities.forEach(liability => {
      liabilitiesJson.push({ liability: liability.name, liabilityAmount: '',pending:'' });
      liability.balanceSheets.forEach(subGroup => {
        liabilitiesJson.push({ liability: subGroup.y_name, liabilityAmount: subGroup.y_total_approved ,pending:subGroup.y_total_pending});
        
      });

    
    });

    


    let assetsJson = [];
    assetsJson.push(Object.assign({ asset: "Master Name", assetAmount: 'System',assetPending:'User Defined' }));
    this.assets.forEach(asset => {
      assetsJson.push({ asset: asset.name, assetAmount:  '',assetPending:'' });
      asset.balanceSheets.forEach(subGroup => {
        assetsJson.push({ asset: subGroup.y_name, assetAmount: subGroup.y_total_approved ,assetPending:subGroup.y_total_pending });
       
      });
    });
    let mergedArray = [];

    for (let i = 0; i < liabilitiesJson.length || i < assetsJson.length; i++) {
      if (liabilitiesJson[i] && assetsJson[i] && i <= liabilitiesJson.length - 1 && i <= assetsJson.length - 1) {
        mergedArray.push(Object.assign({}, liabilitiesJson[i], assetsJson[i]));
      } else if (liabilitiesJson[i] && i <= liabilitiesJson.length - 1) {
        mergedArray.push(Object.assign({}, liabilitiesJson[i], { asset: '', assetAmount: '',assetPending:'' }));
      } else if (assetsJson[i] && i <= assetsJson.length - 1) {
        mergedArray.push(Object.assign({}, { liability: '', liabilityAmount: '',pending:'' }, assetsJson[i]));
      }
    }
    
    mergedArray.push(Object.assign({}, { liability: 'Total', liabilityAmount:this.liabilities[this.liabilities.length-1]['approve'] ,pending: this.liabilities[this.liabilities.length-1]['pending']  }, { asset: 'Total', assetAmount: this.assets[this.assets.length-1]['approve'],assetPending:this.assets[this.assets.length-1]['pending'] }))

    this.csvService.jsonToExcel(mergedArray);
    console.log('Merged:', mergedArray);
  }

  openPageModel(showPageName) {

    this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 0);
  if(showPageName== 'Stock Items'){
    this.common.params = {
      pageName: "StockItem"
    }
    const activeModal = this.modalService.open(StockitemsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false , windowClass:'ledger-modal'});
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      //this.getDayBook();
      //this.common.showToast('Voucher updated');

    });
  }else if(showPageName== 'Stock Sub Type'){
    this.common.params = {
      pageName: "StockSubType"
    }
    const activeModal = this.modalService.open(StockSubtypesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false , windowClass:'ledger-modal'});
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      //this.getDayBook();
      //this.common.showToast('Voucher updated');

    });
  }else if(showPageName== 'Stock Type'){
    this.common.params = {
      pageName: "StockType"
    }
    const activeModal = this.modalService.open(StockTypesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false , windowClass:'ledger-modal'});
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      //this.getDayBook();
      //this.common.showToast('Voucher updated');

    });
  }else if(showPageName== 'Account Groups'){
    this.common.params = {
      pageName: "StockType"
    }
    const activeModal = this.modalService.open(AccountComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false , windowClass:'ledger-modal'});
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      //this.getDayBook();
      //this.common.showToast('Voucher updated');

    });
  }else if(showPageName== 'Ledger'){
    this.common.params = {
      pageName: "Ledger"
    }
    const activeModal = this.modalService.open(LedgersComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false , windowClass:'ledger-modal'});
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      //this.getDayBook();
      //this.common.showToast('Voucher updated');

    });
  }
  this.common.currentPage = 'Accounts Statics';

  }
}


