import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'change-halt',
  templateUrl: './change-halt.component.html',
  styleUrls: ['./change-halt.component.scss']
})
export class ChangeHaltComponent implements OnInit {
  HaltType = 11;
  SiteType = 1;
  type = null;
  sites = null;
  VehicleStatusData = null;
  title = null;
  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService,
    private modalService: NgbModal,
  ) {
    this.type = this.common.changeHaltModal;
    if(this.type=='SiteType'){
      this.title = "Choose Site Type"
    }
    else if(this.type=='HaltType'){
      this.title = "Choose Halt Type"
    }
    this.VehicleStatusData = this.common.params;
    console.log("vehicle status9999999999",this.VehicleStatusData);
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  submitModal() {
    if (this.type == 'SiteType') {
      this.createSite();
    }else if(this.type == 'HaltType'){
      this.checkHaltValue();
    }
  }

  createSite() {
    this.common.loading++;
    let params = "siteHaltRowId=" + this.VehicleStatusData.haltId +
      "&lat=" + this.VehicleStatusData.lat +
      "&lng=" + this.VehicleStatusData.long+
      "&siteType=" +this.SiteType;
    console.log(params);
    this.api.get('HaltOperations/createSiteOnSiteHalt?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.sites = res['data'];
        this.activeModal.close();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  checkHaltValue(){
    console.log(this.HaltType)
    if(this.HaltType == 11 || this.HaltType == 21){
      this.getlastHalt();
    }else{
      this.changeHalt();
    }
  }

  getlastHalt(){
    this.common.loading++;
    console.log(this.VehicleStatusData);
    let params = {
      vehicleId:this.VehicleStatusData.haltId, 
    };
    this.api.post('HaltOperations/getLastHalt', params)
      .subscribe(res => {
         this.common.loading--;
         console.log(res['data']);
        if(res['data']==this.HaltType){
          this.openConrirmationAlert();
        }else{
          this.changeHalt();
        }
      });
  }
  
  openConrirmationAlert() {
    this.common.params = {
      title: "your current halt Type and doesn't match with previous halt",
      description: " Do you want to continue ?"
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data.respone);
      if (data.response) {
        this. changeHalt();
      }
    });
  }

  changeHalt() {
    this.common.loading++;
    let params = {
      siteHaltRowId:this.VehicleStatusData.haltId, 
      haltType :this.HaltType
    };
    console.log(params);
    this.api.post('HaltOperations/changeHaltType', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.sites = res['data'];
        this.activeModal.close();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}
