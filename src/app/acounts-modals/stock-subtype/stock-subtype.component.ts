import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'stock-subtype',
  templateUrl: './stock-subtype.component.html',
  styleUrls: ['./stock-subtype.component.scss']
})
export class StockSubtypeComponent implements OnInit {
  stockSubType = {
    user: {
      name: '',
      id: -1
    },
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
    stockTypes: []
  };

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {

    if (this.common.params && this.common.params.code) {
      this.stockSubType = {
        user: {
          name: this.common.params.username,
          id: this.common.params.foid
        },
        stockType: {
          name: this.common.params.stockTypeName,
          id: this.common.params.stockTypeId
        },
        name: this.common.params.name,
        code: this.common.params.code
      };
      this.common.params = null;
    }
  }

  ngOnInit() {
  }

  searchUser() {
    this.stockSubType.user.id = -1;
    this.showSuggestions.user = true;
    let params = 'search=' + this.stockSubType.user.name;
    this.api.get('Suggestion/getFoUsersList?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        console.log(res);
        this.suggestions.users = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

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

  selectUser(user) {
    this.stockSubType.user.name = user.name;
    this.stockSubType.user.id = user.id;
    this.showSuggestions.user = false;
  }

  selectStockType(stockType) {
    this.stockSubType.stockType.name = stockType.name;
    this.stockSubType.stockType.id = stockType.id;
    this.showSuggestions.stockType = false;
  }

  dismiss(response) {
    console.log('Stock Type:', this.stockSubType);
    this.activeModal.close({ response: response, stockSubType: this.stockSubType });
  }
}
