import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'stockitem',
  templateUrl: './stockitem.component.html',
  styleUrls: ['./stockitem.component.scss']
})
export class StockitemComponent implements OnInit {
  showConfirm = false;
  showExit = false;
  StockTypeItemsdata = [];
  stockItem = {
    name: '',
    code: '',
    maxlimit: '',
    minlimit: '',
    isactive: true,
    sales: false,
    purchase: false,
    inventary: true,
    unit: {
      name: '',
      id: ''
    },
    stockType: {
      name: '',
      id: ''
    },
    stockSubType: {
      name: '',
      id: ''
    },
    user: {
      name: '',
      id: ''
    }

  };

  showSuggestions = {
    user: false,
    stockType: false
  };

  suggestions = {
    users: [],
    stockTypes: []
  };

  allowBackspace = true;
  stockTypeName = '';
  stockSubType = [];
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
      console.log("open data model data:",this.common.params);
    if (this.common.params) {
      this.stockItem = {
        name: this.common.params.name,
        code: this.common.params.code,
        unit: {
          name: this.common.params.stockunitname,
          id: this.common.params.stockunit_id
        },
        stockSubType: {
          name: this.common.params.stoctsubtypename,
          id: this.common.params.stocksubtype_id
        },
        stockType:{
          id:this.common.params.stocktype_id,
          name:this.common.params.stocktype_name
        } ,
        user: {
          name: '',
          id: ''
        },
        maxlimit: common.params.min_limit,
        minlimit: common.params.min_limit,
        isactive: common.params.is_active,
        sales: common.params.for_sales,
        purchase: common.params.for_purchase,
        inventary: common.params.for_inventory
      }

      console.log('Stock: ', this.stockItem);
    }
    console.log('testing purpose', this.stockTypeName);
    this.getStockType();
    this.setFoucus('stockType');
  }


  ngOnInit() {
  }

  getStockType() {
    let params = {
      search: 123
    };

    this.common.loading++;
    this.api.post('Suggestion/GetTypeOfStock', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('StockTypeItemsdata 22:', res['data']);
        this.StockTypeItemsdata = res['data'];

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
        this.stockSubType = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  onSelected(selectedData, type, display) {
    this.stockItem[type].name = selectedData[display];
    this.stockItem[type].id = selectedData.id;
    console.log('Stock Unit: ', this.stockItem);
  }
  onSubTypeSelected(selectedData, type, display) {
    this.stockItem[type].name = selectedData[display];
    this.stockItem[type].id = selectedData.id;
    this.getStockSubType(selectedData.id);
  }



  dismiss(response) {
    console.log('Stock Type:', this.stockItem);
    this.activeModal.close({ response: response, stockItem: this.stockItem });
  }



  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('Active Id', activeId);

    if (event.key == "Escape") {
      this.showExit = true;
    }
    if (this.showExit) {
      if (key == 'y' || key == 'enter') {
        this.showExit = false;
        event.preventDefault();
        this.activeModal.close();
        return;
        // this.close();
      } else if (key == 'n') {
        this.showExit = false;
        event.preventDefault();
        return;

      }

    }

    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        console.log('Ledgers show stockType:', this.stockItem);
        this.dismiss(true);
        this.common.showToast('Your Value Has been saved!');
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      // console.log('active', activeId);
      // console.log('Active jj: ', activeId.includes('aliasname'));
      if (activeId.includes('stockType')) {
        this.setFoucus('stockSubType');
      } else if (activeId.includes('stockSubType')) {
        this.setFoucus('unit');
      } else if (activeId == 'unit') {
        this.setFoucus('code');
      } else if (activeId == 'code') {
        this.setFoucus('name');
      } else if (activeId == 'name') {
        this.setFoucus('maxlimit');
      } else if (activeId == 'maxlimit') {
        this.setFoucus('minlimit');
      } else if (activeId == 'minlimit') {
        this.setFoucus('isactive');
      } else if (activeId == 'isactive' || activeId == 'notisactive') {
        this.setFoucus('sales');
      } else if (activeId == 'sales' || activeId == 'notsales') {
        this.setFoucus('purchase');
      } else if (activeId == 'purchase' || activeId == 'notpurchase') {
        this.setFoucus('inventary');
      } else if (activeId == 'inventary' || activeId == 'notinventary') {
        // this.setFoucus('stock-name');
        this.showConfirm = true;
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', activeId);
      if (activeId == 'inventary' || activeId == 'notinventary') this.setFoucus('purchase');
      if (activeId == 'purchase' || activeId == 'notpurchase') this.setFoucus('sales');
      if (activeId == 'sales' || activeId == 'notsales') this.setFoucus('isactive');
      if (activeId == 'isactive' || activeId == 'notisactive') this.setFoucus('minlimit');
      if (activeId == 'minlimit') this.setFoucus('maxlimit');
      if (activeId == 'maxlimit') this.setFoucus('code');
      if (activeId == 'code') this.setFoucus('name');
      if (activeId == 'name') this.setFoucus('unit');
      if (activeId == 'unit') this.setFoucus('stockSubType');
      if (activeId == 'stockSubType') this.setFoucus('stockType');
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
      //event.preventDefault();
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
