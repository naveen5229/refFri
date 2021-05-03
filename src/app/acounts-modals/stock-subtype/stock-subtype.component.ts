import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'stock-subtype',
  templateUrl: './stock-subtype.component.html',
  styleUrls: ['./stock-subtype.component.scss']
})
export class StockSubtypeComponent implements OnInit {
  showConfirm = false;
  showExit = false;
  stockSubType = {
    id: 0,
    stockType: {
      name: '',
      id: -1
    },
    name: '',
    code: ''
  };


  showSuggestions = {
    user: false,
    stockType: false
  };

  suggestions = {
    users: [],
    stockTypes: [],
    list: []
  };

  allowBackspace = true;
  activeId = 'stockType';
  suggestionIndex = -1;
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    console.log('common params', this.common.params);

    if (this.common.params) {
      this.stockSubType = {
        id: this.common.params.id,
        stockType: {
          name: this.common.params.stocktypename,
          id: this.common.params.stocktype_id
        },
        name: this.common.params.name,
        code: this.common.params.code
      };
      this.common.params = null;
    }
    this.getStockType();
  }

  autoSuggestion = {
    data: [],
    targetId: 'stockType',
    display: 'name'
  };

  ngOnDestroy(){}
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
        this.autoSuggestion.data = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  modelCondition() {
    this.showConfirm = false;
    event.preventDefault();
    return;
  }
  selectSuggestion(suggestion, id?) {
    console.log('Suggestion on select: ', suggestion);
    this.stockSubType.stockType.name = suggestion.name;
    this.stockSubType.stockType.id = suggestion.id;

  }

  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    this.stockSubType.stockType.name = suggestion.name;
    this.stockSubType.stockType.id = suggestion.id;
  }



  // searchUser() {
  //   this.stockSubType.user.id = -1;
  //   this.showSuggestions.user = true;
  //   let params = 'search=' + this.stockSubType.user.name;
  //   this.api.get('Suggestion/getFoUsersList?' + params) // Customer API
  //     // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
  //     .subscribe(res => {
  //       console.log(res);
  //       this.suggestions.users = res['data'];
  //     }, err => {
  //       console.error(err);
  //       this.common.showError();
  //     });
  // }

  searchStock() {
    this.stockSubType.stockType.id = -1;
    this.showSuggestions.stockType = true;
    let params = 'search=' + this.stockSubType.stockType.name;
    this.api.get('Suggestion/getStocktype?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getStocktype?' + params) // Admin API
      .subscribe(res => {
        console.log(res);
        this.suggestions.stockTypes = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }



  selectStockType(stockType) {
    this.stockSubType.stockType.name = stockType.name;
    this.stockSubType.stockType.id = stockType.id;
    // this.showSuggestions.stockType = false;
  }

  onSelected(selectedData, type, display) {
    this.stockSubType[type].name = selectedData[display];
    this.stockSubType[type].id = selectedData.id;
    //console.log('Stock Unit: ', this.stockItem);
  }
  dismiss(response) {
    console.log('Stock Type:', this.stockSubType);
    this.activeModal.close({ response: response, stockSubType: this.stockSubType });
  }



  keyHandler(event) {
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;

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
        console.log('Ledgers show stockType:', this.stockSubType);
        this.dismiss(true);
        // this.common.showToast('Your Value Has been saved!');
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      // console.log('active', activeId);
      // console.log('Active jj: ', activeId.includes('aliasname'));
      if (activeId.includes('user')) {
        this.setFoucus('stockType');
      } else if (activeId.includes('stockType')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('stock-name');
      } else if (activeId == 'stock-name') {
        this.setFoucus('stock-code');
      } else if (activeId == 'stock-code') {
        // this.setFoucus('stock-name');
        this.showConfirm = true;
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', activeId);
      if (activeId == 'stock-code') this.setFoucus('stock-name');
      if (activeId == 'stock-name') this.setFoucus('stockType');
      if (activeId == 'stockType') this.setFoucus('user');
    } else if (key != 'backspace') {
      this.allowBackspace = false;
      //event.preventDefault();
    }
    // console.log('Active Id', activeId);
    if (key.includes('arrow')) {

      this.allowBackspace = false;
      if (key.includes('arrowup') || key.includes('arrowdown')) {

        this.handleArrowUpDown(key);
        event.preventDefault();
      }
    }



  }


  handleArrowUpDown(key) {
    const suggestionIDs = this.generateIDs();
    // console.log('Key:', key, suggestionIDs, suggestionIDs.indexOf(this.activeId));
    if (suggestionIDs.indexOf(this.activeId) == -1) return;
    console.log('Key:', key, suggestionIDs, suggestionIDs.indexOf(this.activeId));
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
    let IDs = ['stockType'];

    return IDs;
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
