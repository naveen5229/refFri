import { Component, OnInit, HostListener } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'stockavailable',
  templateUrl: './stockavailable.component.html',
  styleUrls: ['./stockavailable.component.scss']
})
export class StockavailableComponent implements OnInit {
  // stockItemsData= [];
  stockAvailableData = [];
  stockAvailable = {
    date: this.common.dateFormatternew(new Date(), 'ddMMYYYY', false, '-'),
    stocktype: {
      name: '',
      id: 0
    },
    stocksubtype: {
      name: ' ',
      id: 0
    },
    stockitem: {
      name: ' ',
      id: 0
    }

  };
  activeId = 'stocktype';
  autoSuggestion = {
    data: [],
    targetId: '',
    display: ''
  };
  selectedRow = -1;
  selectedName = '';
  suggestions = {
    stockTypeData: [],
    stockSubTypeData: [],
    stockItems: [],
    purchasestockItems: [],
    salesstockItems: [],
    discountLedgers: [],
    warehouses: [],
    invoiceTypes: [],
    list: []
  };
  suggestionIndex = -1;
  allowBackspace = true;


  showDateModal = false;
  f2Date = 'date';
  activedateid = '';
  lastActiveId = '';

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService) {
    this.getStockType();
    this.common.currentPage = 'Stock Available';
    this.setFoucus('stocktype');
  }

  ngOnInit() {
  }

  getStockType() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Stock/GetStocktype', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.stockTypeData = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  pdfFunction(){
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
       // this.Vouchers = res['data'];
       let address= (res['data'][0]) ? res['data'][0].addressline +'\n' : '';
       let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
    let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
    let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';
   
       let cityaddress =address+ remainingstring1 + remainingstring3;
       let foname=(res['data'][0])? res['data'][0].foname:'';
       this.common.getPDFFromTableIdnew('table',foname,cityaddress,'','');

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  csvFunction(){
    let params = {
      search: 'test'
    };

    this.common.loading++;
    this.api.post('Voucher/GetCompanyHeadingData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
       // this.Vouchers = res['data'];
       let address= (res['data'][0]) ? res['data'][0].addressline +'\n' : '';
       let remainingstring1 = (res['data'][0]) ? ' Phone Number -  ' + res['data'][0].phonenumber : '';
    let remainingstring2 = (res['data'][0]) ? ', PAN No -  ' + res['data'][0].panno : '';
    let remainingstring3 = (res['data'][0]) ? ', GST NO -  ' + res['data'][0].gstno : '';
   
       let cityaddress =address+ remainingstring1;
       let foname=(res['data'][0])? res['data'][0].foname:'';
       this.common.getCSVFromTableIdNew('table',foname,cityaddress,'','',remainingstring3);
      // this.common.getCSVFromTableIdNew('table',res['data'][0].foname,cityaddress,'','',remainingstring3);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  getStockSubType(stocktypeid) {
    let params = {
      stocktype: stocktypeid
    };

    this.common.loading++;
    this.api.post('Suggestion/GetSearchStockType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.stockSubTypeData = res['data'];
        this.autoSuggestion.data = this.suggestions.stockSubTypeData;

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getStockItem(stocksybtypeid) {
    let params = {
      stocksubtype: stocksybtypeid
    };

    this.common.loading++;
    this.api.post('Suggestion/GetStockItemData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.stockItems = res['data'];
        this.autoSuggestion.data = this.suggestions.stockItems;

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event);
    this.setAutoSuggestion();

    if ((key == 'f2' && !this.showDateModal) && (this.activeId.includes('date'))) {
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
    } else if ((key != 'enter' && this.showDateModal) && (this.activeId.includes('startDate') || this.activeId.includes('endDate'))) {
      return;
    }


    if (key == 'enter') {
      this.allowBackspace = true;
      if (this.activeId.includes('stocktype')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('stocksubtype');
      }
      else if (this.activeId.includes('stocksubtype')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('stockitem');
      } else if (this.activeId.includes('stockitem')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('date');
      } else if (this.activeId.includes('date')) {
        this.stockAvailable.date = this.common.handleDateOnEnterNew(this.stockAvailable.date);
        this.setFoucus('submit');
      }

    }

    else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', this.activeId);
      if (this.activeId == 'date') this.setFoucus('stockitem');
      if (this.activeId == 'stockitem') this.setFoucus('stocksubtype');
      if (this.activeId == 'stocksubtype') this.setFoucus('stocktype');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if ((this.activeId == 'date') && key !== 'backspace') {
      let regex = /[0-9]|[-]/g;
      let result = regex.test(key);
      if (!result) {
        event.preventDefault();
        return;
      }
    }else if (key != 'backspace') {
      this.allowBackspace = false;
    }


    if ((key.includes('arrowup') || key.includes('arrowdown')) && this.stockAvailableData.length) {
      console.log('-Jai rana---');
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.stockAvailableData.length - 1) this.selectedRow++;

    }
    // if (key.includes('arrow')) {
    //   //  this.allowBackspace = false;
    //   if (key.includes('arrowup') || key.includes('arrowdown')) {
    //     this.handleArrowUpDown(key);
    //     event.preventDefault();
    //   }
    // }
  }


  handleVoucherDateOnEnter(iddate) {
    let dateArray = [];
    let separator = '-';

    //console.log('starting date 122 :', this.activedateid);
    let datestring = (this.activedateid == 'date') ? 'date' : 'date';
    if (this.stockAvailable[datestring].includes('-')) {
      dateArray = this.stockAvailable[datestring].split('-');
    } else if (this.stockAvailable[datestring].includes('/')) {
      dateArray = this.stockAvailable[datestring].split('/');
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
    this.stockAvailable[datestring] = date + separator + month + separator + year;
  }

  selectSuggestion(suggestion, id?) {
    console.log('Suggestion on select: ', suggestion);
    if (this.activeId == 'stocktype') {
      this.stockAvailable.stocktype.name = suggestion.name;
      this.stockAvailable.stocktype.id = suggestion.id;
    }
  }
  setFoucus(id, isSetLastActive = true) {
    console.log('Id: ', id);
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
      this.setAutoSuggestion();
    }, 100);
  }

  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    if (activeId == 'stocktype') {
      this.stockAvailable.stocktype.name = suggestion.name;
      this.stockAvailable.stocktype.id = suggestion.id;
      this.getStockSubType(this.stockAvailable.stocktype.id);
    } else if (activeId == 'stocksubtype') {
      this.stockAvailable.stocksubtype.name = suggestion.name;
      this.stockAvailable.stocksubtype.id = suggestion.id;
      this.getStockItem(suggestion.id);
    } else if (activeId == 'stockitem') {
      this.stockAvailable.stockitem.name = suggestion.name;
      this.stockAvailable.stockitem.id = suggestion.id;
    }
  }


  handleArrowUpDown(key) {
    const suggestionIDs = this.generateIDs();
    console.log('Key:', key, suggestionIDs, suggestionIDs.indexOf(this.activeId));
    if (suggestionIDs.indexOf(this.activeId) == -1) return;

    if (key == 'arrowdown') {
      if (this.suggestionIndex != this.suggestions.list.length - 1) this.suggestionIndex++;
      else this.suggestionIndex = 0;
    } else {
      if (this.suggestionIndex != 0) this.suggestionIndex--;
      else this.suggestionIndex = this.suggestions.list.length - 1;
    }

    // this.voucher.amountDetails[index].ledger.name = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_name;
    // this.voucher.amountDetails[index].ledger.id = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_id;
  }
  generateIDs() {
    let IDs = ['stocktype', 'stocksubtype', 'stockitem'];
    // this.stockAvailable.amountDetails.map((amountDetails, index) => {
    //   IDs.push('stockitem-' + index);
    //   IDs.push('discountledger-' + index);
    //   IDs.push('warehouse-' + index);
    // });
    return IDs;
  }
  setAutoSuggestion() {
    let activeId = document.activeElement.id;
    if (activeId == 'stocktype') this.autoSuggestion.data = this.suggestions.stockTypeData;
    else if (activeId == 'stocksubtype') this.autoSuggestion.data = this.suggestions.stockSubTypeData;
    else if (activeId.includes('stockitem')) this.autoSuggestion.data = this.suggestions.stockItems;
    else {
      this.autoSuggestion.data = [];
      this.autoSuggestion.display = '';
      this.autoSuggestion.targetId = '';
      return;
    }

    this.autoSuggestion.display = 'name';
    this.autoSuggestion.targetId = activeId;
    console.log('Auto Suggestion: ', this.autoSuggestion);
  }

  dismiss(response) {
    // console.log('Order:', this.order);
    if (response) {
      //console.log('Order new:', this.order);
      // return;
      this.getStockAvailable(this.stockAvailable);
    }
    // this.activeModal.close({ response: response, Voucher: this.order });
  }


  getStockAvailable(stockAvailable) {
    const params = {
      stocktypeid: stockAvailable.stocktype.id,
      stocksubtypeid: stockAvailable.stocksubtype.id,
      stockitemid: stockAvailable.stockitem.id,
      date: stockAvailable.date
    }

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Stock/getStockAvailable', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.GetLedger();
        this.stockAvailableData = res['data'];
        // this.setFoucus('ordertype');
        // this.common.showToast('Invoice Are Saved');
        return;

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }
}
