import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

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
    public api: ApiService
  ) {
    this.type = this.common.changeHaltModal;
    if(this.type=='SiteType'){
      this.title = "Choose Site Type"
    }
    else if(this.type=='HaltType'){
      this.title = "Choose Halt Type"
    }
    this.VehicleStatusData = this.common.params;
    console.log(this.common.changeHaltModal,this.common.params);
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  submitModal() {
    if (this.type == 'SiteType') {
      this.createSite()
    }else if(this.type == 'HaltType'){
      this.changeHalt()
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

  changeHalt() {
    this.common.loading++;
    let params = "siteHaltRowId=" + this.VehicleStatusData.haltId +
      "&haltType=" + this.HaltType;
    console.log(params);
    this.api.get('HaltOperations/changeHaltType?' + params)
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
