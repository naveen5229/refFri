import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss', '../../pages/pages.component.css', '../tyres.component.css']
})
export class InventoryComponent implements OnInit {

  inventories = [{
    modelName: null,
    modelId: null,
    modelBrand: null,
    tyreNo: null,
    date1: this.common.dateFormatter(new Date()),
    searchModelString: null,
    is_health: true,
    nsd1: null,
    nsd2: null,
    nsd3: null,
    psi: null
  },
  {
    modelName: null,
    modelId: null,
    modelBrand: null,
    tyreNo: null,
    date1: this.common.dateFormatter(new Date()),
    searchModelString: null,
    is_health: true,
    nsd1: null,
    nsd2: null,
    nsd3: null,
    psi: null
  },
  {
    modelName: null,
    modelId: null,
    modelBrand: null,
    tyreNo: null,
    date1: this.common.dateFormatter(new Date()),
    searchModelString: null,
    is_health: true,
    nsd1: null,
    nsd2: null,
    nsd3: null,
    psi: null
  }];

  activeRow = -1;
  modelSuggestion = false;
  models = [];
  searchedTyreDetails = [];
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
  ) {
    this.searchData();
  }

  ngOnInit() {
  }

  searchModels(searchModelString, index) {
    this.modelSuggestion = true;
    let params = 'search=' + searchModelString;
    this.activeRow = index;
    if (searchModelString.length > 2) {
      setTimeout(() => {    //<<<---    using ()=> syntax

        console.log("length=", searchModelString.length);
        this.api.get('Suggestion/getTyreNamesWithBrands?' + params) // Customer API
          // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
          .subscribe(res => {
            this.models = res['data'];
            console.log("suggestions", this.models);
          }, err => {
            console.error(err);
            this.common.showError();
          });
      }, 3000);
    }
  }

  selectModel(model, index) {
    this.inventories[index].modelName = model.name;
    this.inventories[index].modelId = model.item_id;
    this.inventories[index].modelBrand = model.brand;
    this.inventories[index].searchModelString = this.inventories[index].modelName + " : " + this.inventories[index].modelBrand;

    this.modelSuggestion = false;
  }

  testFilledData() {
    let alerts = false;
    let count = this.inventories.length;
    let afterRemove =[];
    for (let i = 0; i < count; i++) {
      console.log("tyreno",this.inventories[i].tyreNo);
      if (this.inventories[i].tyreNo){
        afterRemove.push(this.inventories[i]);
      }
    }
    // console.log("inv",afterRemove);
    this.inventories = afterRemove;
    for (let i = 0; i < this.inventories.length; i++) {
      this.inventories[i].date1 = this.common.dateFormatter(new Date(this.inventories[i].date1));
      if ((this.inventories[i].is_health == true) && ((!this.inventories[i].nsd1) || (!this.inventories[i].nsd2) || (!this.inventories[i].nsd3) || (!this.inventories[i].psi))) {
        alerts = true;
        break;
      }
     
    }
    if (alerts == true) {
      alert("NSD-1 , NSD-2 , NSD-3 , PSI fields are mandatory is  Is_Health is Checked");
    }
    else {
      this.saveDetails();
    }

  }

  getDate(index) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.inventories[index].date1 = this.common.dateFormatter(data.date).split(' ')[0];
      console.log('Date:', this.inventories[index].date1);
    });
  }

  saveDetails() {
    this.common.loading++;
    let params = { inventories: JSON.stringify(this.inventories) };//JSON.stringify(this.inventories) ;
    console.log('Params:', params);
    this.api.post('Tyres/saveTyreMaster', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("return id ", res['data'][0].rtn_id);
        if (res['data'][0].rtn_id > 0) {
          this.common.showToast("sucess");
        } else {
          this.common.showToast(res['data'][0].rtn_msg);
        }
        this.searchData();
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  searchData() {
    let params = this.inventories;
    console.log("params ", params)
    this.api.get('Tyres/getTyreDetailsAccordingFO?')
      .subscribe(res => {
        this.searchedTyreDetails = res['data'];
        console.log("searchedTyreDetails", this.searchedTyreDetails);

      }, err => {
        console.error(err);
        this.common.showError();
      });

  }

  addMore() {
    this.inventories.push({
      modelName: null,
      modelId: null,
      modelBrand: null,
      tyreNo: null,
      date1: this.common.dateFormatter(new Date()),
      searchModelString: null, is_health: true,
      nsd1: null,
      nsd2: null,
      nsd3: null,
      psi: null
    });
  }

  remove() {
    this.inventories.pop();
  }

  valueReset(index) {
    console.log("change event", index);
    this.inventories[index].nsd1 = null;
    this.inventories[index].nsd2 = null;
    this.inventories[index].nsd3 = null;
    this.inventories[index].psi = null;
  }
}

