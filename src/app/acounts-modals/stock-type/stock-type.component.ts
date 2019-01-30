import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'stock-type',
  templateUrl: './stock-type.component.html',
  styleUrls: ['./stock-type.component.scss']
})
export class StockTypeComponent implements OnInit {
  stockType = {
    user: {
      name: '',
      id: -1
    },
    name: '',
    code: ''
  };

  showSuggestions = false;
  suggestions = [];

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
      if(this.common.params && this.common.params.code){
        this.stockType = {
          user: {
            name: this.common.params.username,
            id: this.common.params.foid
          },
          name: this.common.params.name,
          code: this.common.params.code
        };
        this.common.params = null;
      }
     }

  ngOnInit() {
  }

  dismiss(response) {
    console.log('Stock Type:', this.stockType);
    this.activeModal.close({ response: response, stockType: this.stockType });
  }

  searchUser() {
    this.stockType.user.id = -1;
    this.showSuggestions = true;
    let params = 'search=' + this.stockType.user.name;
    this.api.get('Suggestion/getFoUsersList?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        console.log(res);
        this.suggestions = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  selectUser(user) {
    this.stockType.user.name = user.name;
    this.stockType.user.id = user.id;
    this.showSuggestions = false;
  }


 

}
