import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { AddConsigneeComponent } from '../../../modals/LRModals/add-consignee/add-consignee.component';
import { AddMaterialComponent } from '../../../modals/LRModals/add-material/add-material.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'manual-items',
  templateUrl: './manual-items.component.html',
  styleUrls: ['./manual-items.component.scss']
})
export class ManualItemsComponent implements OnInit {
  unitList=[];
  wareHouseId=null;
  isFormSubmit = false;
  startDate=new Date();
  Today=new Date();
  material=null;
  selectLr=[{
    material_id:null,
    unitype_id:null,
    item_name:null,
    company_id:null,
    ref_type:-1,
    ref_id:null,
    qty:null,
    remarks:null,
  }]; 

 
  constructor(public activeModal:NgbActiveModal,
    public api:ApiService,
    public modalService:NgbModal,
    public common:CommonService) { 
       this.common.handleModalSize('class', 'modal-lg', '1200');
      this.getUnitList();
  }

  ngOnDestroy(){}
ngOnInit() {
   
  }



  closeModal() {
    this.activeModal.close();
  }

  getUnitList() {
    let params = {
      search: ''
    }
    this.api.post('Suggestion/getUnit', params)
      .subscribe(res => {
        this.unitList = res['data'];
        console.log('type', this.unitList);
      }, err => {
        this.common.showError();
      });
  }

  addMore() {
    this.selectLr.push({
      material_id:null,
      unitype_id:null,
      item_name:null,
      company_id:null,
      ref_type:-1,
      ref_id:null,
      qty:null,
      remarks:null
    });
  }

  setMaterialValue(GetMaterialTypes){
    console.log("8888888");
    if(this.selectLr['material_id']==null){
      document.getElementById(GetMaterialTypes)['value'] = ''
    }
  }

  setParty(company){
    if(this.selectLr['company_id']==null){
      document.getElementById(company)['value'] = ''
    }

  }

  saveLr(){
    let params = {
      whId:this.common.params.warehouseId,
      dttime:this.startDate,
      whDetails:JSON.stringify(this.selectLr),
    }
    this.common.loading++;
    console.log("params",params);
    this.api.post('WareHouse/saveWhDetailsManually', params)
      .subscribe(res => {
        if (res['data'][0].y_id > 0) {
          this.common.loading--;
          this.common.showToast(res['data'][0].y_msg);
          this.activeModal.close();
        }
        else {
          this.common.loading--;
          this.common.showError(res['data'][0].y_msg)
        }  
  
      }, err => {
      });
  }

  addCompany(){
    this.modalService.open(AddConsigneeComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: "drag-box" })
  }

  addmaterial(){
    const activeModal = this.modalService.open(AddMaterialComponent, {
      size: "sm",
      container: "nb-layout"
    });
    
  }
}
