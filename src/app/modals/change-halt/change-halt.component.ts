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
  StateType = 1;
  type = null;
  sites = null;
  vehicleEvent = null;
  title = null;
  isDoubtfull = false;
  constructor(
    public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService,
    private modalService: NgbModal,
  ) {
    this.type = this.common.changeHaltModal;
    if (this.type == 'SiteType') {
      this.title = "Choose Site Type"
    }
    else if (this.type == 'HaltType') {
      this.title = "Choose Halt Type"
    }
    else if (this.type == 'StateType') {
      this.title = "Choose State Type"
    }
    this.vehicleEvent = this.common.params;
    console.log("vehicleEvent", this.vehicleEvent, this.common.passedVehicleId);
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  setHalt(haltType) {
    this.HaltType = haltType;
    this.submitModal();
  }
  setSite(siteType) {
    this.SiteType = siteType;
    this.submitModal();
  }
  setState(stateType) {
    this.StateType = stateType;
    this.submitModal();
  }

  submitModal() {
    if (this.type == 'SiteType') {
      this.createSite();
    } else if (this.type == 'HaltType') {
      console.log("haltType", this.HaltType);
      this.changeHalt();
    }
    else if (this.type == 'StateType') {
      console.log("stateType", this.StateType);
      this.changeState();
    }
  }

  createSite() {
    this.common.loading++;
    let params = "siteHaltRowId=" + this.vehicleEvent.haltId +
      "&lat=" + this.vehicleEvent.lat +
      "&lng=" + this.vehicleEvent.long +
      "&siteType=" + this.SiteType;
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

  getlastHalt(halttype) {
    this.common.loading++;
    console.log(this.vehicleEvent);
    let params = {
      haltTypeId: halttype,
      haltId: this.vehicleEvent.haltId,
    };
    console.log("params=", params)
    this.api.post('HaltOperations/getLastHalt', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res['data']);
        this.openConrirmationAlert(res['data'][0]);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  openConrirmationAlert(data) {
    if (data.y_type == 1) {
      this.common.params = {
        title: data.y_msg,
        description: " Do you want to continue ?"
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.response) {
          this.changeHalt();
        }
      });
    }
    else if (data.y_type == 0) {
      alert(data.y_msg);
      this.HaltType = null;
    }
    else if (data.y_type == -1) {
      this.changeHalt();
    }
  }

  changeHalt() {
    this.common.loading++;
    let params = {
      siteHaltRowId: this.vehicleEvent.haltId,
      haltType: this.HaltType,
      isDoubtfull:this.isDoubtfull
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

  changeState() {
    this.common.loading++;
    let params = {
      stateId: this.vehicleEvent.vs_id,
      stateType: this.StateType,
      siteHaltRowId: this.vehicleEvent.haltId,
      haltType: this.HaltType
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
