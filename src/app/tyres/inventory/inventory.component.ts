import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

@Component({
  selector: 'inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss','../../pages/pages.component.css','../tyres.component.css']
})
export class InventoryComponent implements OnInit {

  inventories = [{
    modelName:null,
    modelId: null,
    modelBrand : null,
    tyreNo : null,
    date1  : this.common.dateFormatter(new Date()),
    searchModelString : null,
    is_health : true,
    nsd1 : null,
    nsd2 : null,
    nsd3 : null,
    psi : null
  }];

  activeRow = -1;  
  modelSuggestion = false;
  models = [];
  searchedTyreDetails = [];
  constructor( private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
  ) { }

  ngOnInit() {
  }

  searchModels(searchModelString, index) {
    this.modelSuggestion = true;
    let params = 'search=' + searchModelString;
    this.activeRow = index;
    if(searchModelString.length>2){
      setTimeout(()=>{    //<<<---    using ()=> syntax
      
    console.log("length=",searchModelString.length);
    this.api.get('Suggestion/getTyreNamesWithBrands?' + params) // Customer API
      // this.api.get3('booster_webservices/Suggestion/getElogistAdminList?' + params) // Admin API
      .subscribe(res => {
        this.models = res['data'];
        console.log("suggestions",this.models);
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
    this.inventories[index].searchModelString = this.inventories[index].modelName+" : "+this.inventories[index].modelBrand;

    this.modelSuggestion = false;
  }
 
  testFilledData(){
    for(let i=0;i<this.inventories.length;i++){
      if((this.inventories[i].is_health==true)&&((this.inventories[i].nsd1) )){

      }
    }
  }

  saveDetails(){
    this.common.loading++;
    let params =  this.inventories//JSON.stringify(this.inventories) ;
    console.log('Params:', params);
    let param = JSON.stringify(this.inventories) ;
    console.log('Param:', param);

    this.api.post('Tyres/saveTyreMaster', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("return id " ,res['data'][0].rtn_id);
        if(res['data'][0].rtn_id>0){
          this.common.showToast("sucess");
        }else{
          this.common.showToast(res['data'][0].rtn_msg);
        }
        this.searchData();
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  searchData(){
      let params = this.inventories;
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

  addMore(){
    this.inventories.push({ modelName:null,
      modelId: null,
      modelBrand : null,
      tyreNo : null,
      date1  : this.common.dateFormatter(new Date()),
    searchModelString:null, is_health : true,
    nsd1 : null,
    nsd2 : null,
    nsd3 : null,
    psi : null});
  }

  remove(){
    this.inventories.pop();
  }

  valueReset(index){
    console.log("change event", index);
      this.inventories[index].nsd1 = null;
      this.inventories[index].nsd2 = null;
      this.inventories[index].nsd3 = null;
      this.inventories[index].psi = null;
  }
  }

