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
  modelBrand = null;
  searchString = "";
  searchModelString = "";
  tyreNo = null;
  otherDetails = null;

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
    this.api.get('Suggestion/getFoUsersList?' + params) // Customer API
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
    this.api.get('Suggestion/getTyreNamesWithBrands?' + params) // Customer API
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
    this.modelId = model.item_id;
    this.modelBrand = model.brand;
    this.modelSuggestion = false;
  }
  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
        this.date= this.common.dateFormatter(data.date).split(' ')[0];
        console.log('Date:', this.date); 
    });
  }

  saveDetails(){
    this.common.loading++;

    let params = {
      foId : this.foId,
      date : this.date,
      tyreNo : this.tyreNo,
      otherDetails: this.otherDetails,
      modelId: this.modelId
    };
    console.log('Params:', params);

    this.api.post('Tyres/saveTyreMaster', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res['data']);
         // this.common.showToast(res['msg']);
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }
  }

