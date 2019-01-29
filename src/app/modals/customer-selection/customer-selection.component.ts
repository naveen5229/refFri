import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.scss']
})
export class CustomerSelectionComponent implements OnInit {
  showSuggestions = false;
  suggestions = [];
  searchString = "";
  constructor(
    public api : ApiService,
    public common : CommonService,
    public activeModal : NgbActiveModal,
  ) { }

  ngOnInit() {
  }

  searchUser() {
    console.log("test");
    this.showSuggestions = true;
    let params = 'search=' + this.searchString;
    this.api.get('Suggestion/getAllFoAdminList?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        this.suggestions = res['data'];
        console.log("suggestions",this.suggestions);

      }, err => {
        console.error(err);
        this.common.showError();
      });
  }
 
  selectUser(user) {
    this.common.foAdminName = user.name;
    this.common.foAdminUserId = user.id;
    this.searchString = this.common.foAdminName;
    this.showSuggestions = false;
    console.log("foAdminName",this.common.foAdminName);
    console.log("foAdminUserId",this.common.foAdminUserId);
    

  }
  dismiss() {
    this.activeModal.close();
  }

}
