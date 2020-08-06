import { Component, OnInit,Input, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal,NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import * as _ from 'lodash';
import { PdfService } from '../../services/pdf/pdf.service';
import { CsvService } from '../../services/csv/csv.service';
import { LedgerviewComponent } from '../../acounts-modals/ledgerview/ledgerview.component';
import { AccountService } from '../../services/account.service';
import { isNull } from 'util';
import { StoclsummaryComponent } from '../stoclsummary/stoclsummary.component';
@Component({
  selector: 'profitloss-tree',
  templateUrl: './profitloss.html',
  styleUrls: ['./profitloss.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'keyHandler($event)'
  }
})
export class ProfitlossTreeComponent {
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
    console.log('--------,', this.active);
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
  selector: 'profitloss',
  templateUrl: './profitloss.component.html',
  styleUrls: ['./profitloss.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfitlossComponent implements OnInit {
  isModal = false;
  selectedName = '';
  plData = {
    enddate: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    startdate: ((((new Date()).getMonth())+1) > 3) ? this.common.dateFormatternew(new Date().getFullYear() + '-04-01', 'ddMMYYYY', false, '-') : this.common.dateFormatternew(((new Date().getFullYear())-1) + '-04-01', 'ddMMYYYY', false, '-'),
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
  viewType = 'main';
  topHeadExp=0;
  topHeadIncome=0;
  indirectExp=0;
  directIncome=0;
  grossLoss=0;
  grossProfit=0;
  netProfit=0;
  netLoss=0;
  isExpandMainGroup: boolean = false;
  isExpandAll: boolean = false;
  isExpand: string = '';
  sizeIndex=0;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public pdfService: PdfService,
    public csvService: CsvService,
    public accountService: AccountService,
    public cdr: ChangeDetectorRef,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal) {
      this.accountService.fromdate = (this.accountService.fromdate) ? this.accountService.fromdate: this.plData.startdate;
      this.accountService.todate = (this.accountService.todate)? this.accountService.todate: this.plData.enddate;
       
    // this.getBalanceSheet();
    this.getBranchList();
    this.setFoucus('startdate');
    this.common.currentPage = 'Profit & Loss A/C';
    this.setFoucus('startdate');
   if (this.common.params && this.common.params.startdate) {  
   // this.showHideButton = false;
   this.accountService.fromdate= this.common.params.startdate
    this.accountService.todate= this.common.params.enddate
    this.getBalanceSheet();
   // this.sizeindex= this.sizeindex+1;
    if (this.common.params.isModal) {
      this.isModal = true
    }
  this.common.params = null;
    this.common.handleModalSize('class', 'modal-lg', '1200', 'px', this.sizeIndex);

   // this.common.params = null;
  }
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
    this.plData.startdate= this.accountService.fromdate;
    this.plData.enddate= this.accountService.todate;
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
        //this.formattData();
        this.generalizeData();

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  generalizeData() {
    let assetsGroup = _.groupBy(this.profitLossData, 'y_is_income');
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
          name: labels[0]|| ledgerRegister.y_groupname,
          data: [ledgerRegister],
          amount: parseFloat(ledgerRegister.y_amount)
        })
      } else {
        this.assets[index].amount += parseFloat(ledgerRegister.y_amount);
        this.assets[index].data.push(ledgerRegister);
      }
    }
   // console.log('assets', this.assets);
    this.assets.map(voucher => (voucher.amount !=0) ?  voucher.data = this.findChilds(voucher.data) :'' );

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
    this.liabilities.map(voucher => (voucher.amount !=0) ? voucher.data = this.findChilds(voucher.data) : '');
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
      }
    }

    if (childs.length) {
      return childs.map(child => {
        return {
          name: child.name,
          data: this.findChilds(child.data),
          amount: child.amount,
        }
      });
    } else {
      let info = [];
      let groups = _.groupBy(data, 'y_ledger_name');
      // console.log('Groups:', data, groups);
      for (let group in groups) {
        if (groups[group].length > 1 && group) {
          let details = {
            //name: group,
            ledgerName: group,
            ledgerdata: groups[group],
            // data: groups[group].map(ledger => {
            //   ledger.y_ledger_name = '';
            //   return ledger;
            // }),
            amount: groups[group].reduce((a, b) => {
              a += parseFloat(b.y_amount);
              return a;
            }, 0)

          }
          info.push(details);
        } else if (group) {
          // info.push(...groups[group]);
          let details = {
            // name: group,
            ledgerName: group,
            ledgerdata: groups[group],
            // data: groups[group].map(ledger => {
            //   ledger.y_ledger_name = '';
            //   return ledger;
            // }),
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
    let assetsGroup = _.groupBy(this.profitLossData, 'y_is_income');
    let firstGroup = _.groupBy(assetsGroup['0'], 'y_groupname');
    let secondGroup = _.groupBy(assetsGroup['1'], 'y_groupname');
    let subFirstGroup = _.groupBy(assetsGroup['0'], 'y_subgroupname');
    let subSecondGroup = _.groupBy(assetsGroup['1'], 'y_subgroupname');
    this.topHeadExp=0;
    this.topHeadIncome=0;
    this.grossLoss=0;
    this.grossProfit=0;
    this.netProfit=0;
    this.netLoss=0;
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
      if((libility.name.toLowerCase().includes('opening') || libility.name.toLowerCase().includes('purchases') || libility.name.toLowerCase().includes('direct expenses')) && (!libility.name.toLowerCase().includes('indirect'))){
        this.topHeadExp +=libility.amount;
      }
      if((libility.name.toLowerCase().includes('sales') || libility.name.toLowerCase().includes('income') || libility.name.toLowerCase().includes('closing')) && ( !libility.name.toLowerCase().includes('indirect incomes'))){
        this.topHeadIncome +=libility.amount;
      }
      if(libility.name.toLowerCase().includes('indirect expenses')){
        this.indirectExp =libility.amount;
        console.log('first indirect exp',libility.amount);
      }
      if(libility.name.toLowerCase().includes('indirect incomes')){
        this.directIncome =libility.amount;
      }
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
      if((asset.name.toLowerCase().includes('opening') || asset.name.toLowerCase().includes('purchases') || asset.name.toLowerCase().includes('direct expenses')) && (!asset.name.toLowerCase().includes('indirect'))){
        this.topHeadExp +=asset.amount;
      }
      if((asset.name.toLowerCase().includes('sales') || asset.name.toLowerCase().includes('income') || asset.name.toLowerCase().includes('closing')) && ( !asset.name.toLowerCase().includes('indirect incomes'))){
        this.topHeadIncome +=asset.amount;
      }
      if(asset.name.toLowerCase().includes('indirect expenses')){
        this.indirectExp = asset.amount;
        console.log('second indirect exp',asset);

      }
      if(asset.name.toLowerCase().includes('indirect incomes')){
        this.directIncome =asset.amount;
      }
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
    if(this.topHeadIncome>=this.topHeadExp){
      this.grossProfit=this.topHeadIncome-this.topHeadExp;
    }else{
      this.grossLoss=this.topHeadExp-this.topHeadIncome;
    }
    if((this.grossProfit+this.directIncome) >= (this.grossLoss+this.indirectExp)){
      this.netProfit=((this.grossProfit+this.directIncome) - (this.grossLoss+this.indirectExp));
    }else{
      this.netLoss=((this.grossLoss+this.indirectExp)-(this.grossProfit+this.directIncome));
    }
    this.changeViewType();
    console.log('trip head exp', this.topHeadExp,'topHeadIncome',this.topHeadIncome,'indirectExp',this.indirectExp);
  }

  filterData(assetdata, slug) {
    return assetdata.filterfilter(data => { return (data.y_is_assets === slug ? true : false) });
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
  openLedgerViewModel(data) {
    console.log('ledger id 00000', data);
    if(data.ledgerdata[0].y_path.includes('Opening Stock') || data.ledgerdata[0].y_path.includes('Closing Stock')){
      this.common.params = {
        startdate: this.plData.startdate,
        enddate: this.plData.enddate,
        ledger: data.ledgerdata[0].y_ledgerid,
        sizeIndex:(this.sizeIndex + 1),
        isModal:1
      }; 
      const activeModal = this.modalService.open(StoclsummaryComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        //this.getDayBook();
        //this.common.showToast('Voucher updated');
  
      });
    }else if(data.ledgerdata[0].y_path.includes('Net Profit')){

    }
    else{
    this.common.params = {
      startdate: this.plData.startdate,
      enddate: this.plData.enddate,
      ledger: data.ledgerdata[0].y_ledgerid,
      vouchertype: (data.ledgerdata[0].y_type_id==null)? 0 : data.ledgerdata[0].y_type_id,
      ledgername:data.ledgerdata[0].y_ledger_name,
      sizeIndex:(this.sizeIndex + 1),


    };
    const activeModal = this.modalService.open(LedgerviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      // console.log('Data: ', data);
      //this.getDayBook();
      //this.common.showToast('Voucher updated');

    });
  }
  }

  singleFormatCsvData() {
    let liabilitiesJson = [];
    liabilitiesJson.push(Object.assign({liability:"Particulars",liabilityAmount:'Amount'}));
    this.assets.forEach(liabilitydata => {
      liabilitiesJson.push({ liability: liabilitydata.name, liabilityAmount: liabilitydata.amount });
    });

    let assetsJson = [];
    assetsJson.push(Object.assign({asset:"Particulars",assetAmount:'Amount'}));
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
   // mergedArray.push(Object.assign({}, {"":'MG = Main Group ,SG = Sub Group, L = Ledger'}))

    console.log('Merged:', mergedArray);
    this.csvService.jsonToExcel(mergedArray);
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


  csvFunction() {
    if(this.isExpand == 'main'){
      this.singleFormatCsvData();
    } else{
    let jrxJson = [];
    let libilityJson = [];
    let data = [];
    jrxJson.push(Object.assign({
      particular: "Perticulars",
      openingamount: "Amount",
     
    }));
    libilityJson.push(Object.assign({
      particular: "Perticulars",
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

}
