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

  stockItem = {
    user: {
      name: '',
      id: -1
    },
    stockType: {
      name: '',
      id: -1
    },
    name: '',
    code: '',
    unitId: ''
  };




  selectedUnit = null;
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
      this.stockItem = {
        user: {
          name: this.common.params.username,
          id: this.common.params.foid
        },
        stockType: {
          name: this.common.params.stocktypename,
          id: this.common.params.stocktype_id
        },
        name: this.common.params.name,
        code: this.common.params.code,
        unitId: this.common.params.unitId
      };
      this.common.params = null;
    }
  }

  ngOnInit() {
  }


  searchUser() {
    this.stockItem.user.id = -1;
    this.showSuggestions.user = true;


    let params = 'search=' + this.stockItem.user.name;
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

  selectUser(user) {
    this.stockItem.user.name = user.name;
    this.stockItem.user.id = user.id;
    this.showSuggestions.user = false;
  }

  searchStock() {
    this.stockItem.stockType.id = -1;
    this.showSuggestions.stockType = true;
    let params = 'search=' + this.stockItem.stockType.name;
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
    this.stockItem.stockType.name = stockType.name;
    this.stockItem.stockType.id = stockType.id;
    this.showSuggestions.stockType = false;
  }

  dismiss(response) {
    this.stockItem.unitId = this.selectedUnit.id;
    console.log('Stock Type:', this.stockItem);
    this.activeModal.close({ response: response, stockItem: this.stockItem });
  }
}
