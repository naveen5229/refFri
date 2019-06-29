import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'lr-pod-dashboard',
  templateUrl: './lr-pod-dashboard.component.html',
  styleUrls: ['./lr-pod-dashboard.component.scss']
})
export class LrPodDashboardComponent implements OnInit {
  option = [{
    name: 'withdriver',
    id: '1'

  }, {
    name: 'withdriver(other)',
    id: '2'
  }, {
    name: 'AtBranch',
    id: '3'
  }, {
    name: 'withEmployee',
    id: '4'
  }, {
    name: 'Intransit',
    id: '5'
  }, {
    name: 'Missing',
    id: '6'
  },
  {
    name: 'At H.D(Received)',
    id: '11'
  }, {
    name: 'Billed&Submitted',
    id: '99'
  }];
  id = null;
  pod = [];
  lrId = null;
  stateId = null;
  refId = null;
  refDetails = null;
  pod_dttm = null;
  remark = null;
  vid = null;
  constructor(public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService) {
    this.pod = this.common.params;
    this.lrId = this.common.params.details.id;
    this.stateId = this.common.params.details._state_id;
    this.pod_dttm = this.common.dateFormatter1(this.common.params.details['LR Date']);
    this.vid = this.common.params.details._vid;
    //console.log('dates', this.common.dateFormatter1(this.common.params.details.lr_date));
  }

  ngOnInit() {
  }
  getSelection() {
    this.stateId = this.id;
    console.log('idddd', this.stateId);
  }
  selectName(details) {

    this.refId = details.id;
    this.refDetails = details.empname;
  }
  selectElogistName(details) {
    this.refId = details.id;
    this.refDetails = details.empname;
  }
  selectBranch(details) {
    this.refId = details.id;
    this.refDetails = details.name;

  }
  selectFOAdmin(details) {
    this.refId = details.id;
    this.refDetails = details.name;

  }
  selectWareHouse(details) {
    this.refId = details.id;
    this.refDetails = details.regno;
  }
  PodDetailsChange() {
    let params = {
      lrId: this.lrId,
      stateId: this.stateId,
      refId: this.refId,
      refDetails: this.refDetails,
      remarks: this.remark,
      pod_dttm: this.pod_dttm,
      vid: this.vid,
    }
    console.log('params', params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/updateLrPodState', params)
      .subscribe(res => {
        this.common.loading--;
        this.closeModal();
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }
  closeModal() {
    this.activeModal.close({ response: true });
  }
}
