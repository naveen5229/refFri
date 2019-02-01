import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'customer-selection',
  templateUrl: './customer-selection.component.html',
  styleUrls: ['./customer-selection.component.scss']
})
export class CustomerSelectionComponent implements OnInit {
  showSuggestions = false;
  suggestions = [];
  searchString = "";
  date =  this.common.dateFormatter(new Date());
  constructor(
    public api : ApiService,
    public common : CommonService,
    public activeModal : NgbActiveModal,
    public router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
  }

  searchUser() {
    console.log("test");
    this.showSuggestions = true;
    let params = 'search=' + this.searchString;
    this.api.get('Suggestion/getAllFoAdminListwithCustomer?' + params) // Customer API
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
    this.searchString = user.foaname+" - "+user.foname;
    this.showSuggestions = false;
    this.common.foAdminName =  this.searchString;
    this.common.foAdminUserId = user.id;
    localStorage.setItem('FO_ADMIN_NAME', this.searchString);
    localStorage.setItem('FO_ADMIN_USER_ID',  user.foaid);
    window.location.reload();
    //this.router.navigate(['/pages/dashboard']);
    this.activeModal.close();

  }
  dismiss() {
    this.activeModal.close();
  }

}
