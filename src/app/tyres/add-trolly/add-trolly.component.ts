import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'add-trolly',
  templateUrl: './add-trolly.component.html',
  styleUrls: ['./add-trolly.component.scss','../../pages/pages.component.css', '../tyres.component.css']
})
export class AddTrollyComponent implements OnInit {
  foName = "";
  foId = null;
  trollyNo = "";
  showSuggestions = false;

  foUsers = [];
  trollys = [];

  searchString = "";
  constructor(
    private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService
  ) { }

  ngOnInit() {
  }
  searchUser() {
    console.log("test");
    this.showSuggestions = true;
    let params = 'search=' + this.searchString;
    this.api.get('Suggestion/getFoUsersList?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        this.foUsers = res['data'];
        console.log("suggestions", this.foUsers);

      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  selectUser(user) {
    this.foName = user.name;
    this.searchString = this.foName;
    this.foId = user.id;
    this.showSuggestions = false;
    this.getTrollys();
  }

  getTrollys(){
    if (this.foId) {
      let params = 'foId=' + this.foId;
      console.log("params ", params);
      this.api.get('Tyres/getTrollys?' + params)
        .subscribe(res => {
          this.trollys = res['data'];
          console.log("searchedTrollyDetails", this.trollys);

        }, err => {
          console.error(err);
          this.common.showError();
        });
    }
    else {
      this.common.showToast("Fo Selection is mandotry");
    }
  }

  saveTrollyDetails(){
    this.common.loading++;
    let params = {
      foId : this.foId,
      trollyNo : this.trollyNo,
     
    };
    console.log('Params:', params);
    this.api.post('Tyres/saveTrollyDetails', params)
      .subscribe(res => {
        this.common.loading--;
        alert(res['msg']);
        this.getTrollys();
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

}
