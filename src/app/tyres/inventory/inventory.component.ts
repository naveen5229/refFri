import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  foName = "";
  foId = null;
  showSuggestions = false;
  modelSuggestion = false;
  foUsers = [];
  models = [];
  modelName = "";
  modelId = null;
  searchString = "";
  searchModelString = "";

  date= this.common.dateFormatter(new Date());
  constructor( private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
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
        this.foUsers = res['data'];
        console.log("suggestions",this.foUsers);

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
  }

  searchModels() {
    this.modelSuggestion = true;
    let params = 'search=' + this.searchModelString;
    this.api.get('Suggestion/getAllFoAdminList?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        this.models = res['data'];
        console.log("suggestions",this.models);

      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  selectModel(model) {
    this.modelName = model.name;
    this.searchModelString = this.modelName;
    this.modelId = model.id;
    this.modelSuggestion = false;
  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
        this.date= this.common.dateFormatter(data.date).split(' ')[0];
        console.log('Date:', this.date);
       
      

    });
  }
}
