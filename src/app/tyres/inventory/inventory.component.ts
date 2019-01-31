import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss','../../pages/pages.component.css']
})
export class InventoryComponent implements OnInit {

  foName = "";
  foId = null;
  showSuggestions = false;
  modelSuggestion = false;
  foUsers = [];
  models = [];
  searchedTyreDetails = [];
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
    this.modelId = model.item_id;
    this.modelBrand = model.brand;
    this.searchModelString = this.modelName+" : "+this.modelBrand+" : "+this.modelId;

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
        console.log("return id " ,res['data'][0].rtn_id);
        if(res['data'][0].rtn_id>0){
          this.common.showToast("sucess");
        }else{
          this.common.showToast(res['data'][0].rtn_msg);
        }
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  searchData(){
    if(this.foId){
     
      let params = 'foId=' + this.foId+
      '&modelId='+this.modelId+
      '&tyreNo='+this.tyreNo;
      console.log("params ",params)
      this.api.get('Tyres/getTyreDetailsAccordingFO?' + params)
        .subscribe(res => {
          this.searchedTyreDetails = res['data'];
          console.log("searchedTyreDetails",this.searchedTyreDetails);
  
        }, err => {
          console.error(err);
          this.common.showError();
        });
    }
    else{
      this.common.showToast("Fo Selection is mandotry");
    }
  }
  }

