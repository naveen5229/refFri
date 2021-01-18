import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
  refdetails = null;

  constructor(public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService) {
    this.id = this.common.params.details._state_id;
    this.pod = this.common.params;
    this.lrId = this.common.params.details.id;
    // this.stateId = this.common.params.details._state_id;
    this.pod_dttm = this.common.dateFormatter1(this.common.params.details['LR Date']);
    this.vid = this.common.params.details._vid;
    this.refDetails = this.common.params.details['Ref Details'];
    console.log('refdetails:', this.refDetails);
    //console.log('dates', this.common.dateFormatter1(this.common.params.details.lr_date));
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  getSelection() {
    this.stateId = this.id;
    console.log('idddd', this.stateId);
  }
  selectName(details) {

    this.refId = details.id;
    this.refDetails = details.empname;
    if (details.id == null) {
      this.refDetails = null;
    }
  }


  resetData() {
    ///document.getElementById('driver')['value'] = '';
    this.refDetails = null;
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
    this.refDetails = details.name;
  }
  PodDetailsChange() {
    let params = {
      lrId: this.lrId,
      stateId: this.id,
      refId: this.refId,
      refDetails: this.refDetails,
      remarks: this.remark,
      pod_dttm: this.pod_dttm,
      vid: this.vid,

    }
    console.log('params:', params);
    if (params.stateId == '5' || params.stateId == '6' || params.stateId == '99') {
      params.refId = null;
      params.refDetails = null;
    }
    if (params.refId == null && params.stateId == '1') {
      this.common.showToast('please select driver');
      document.getElementsByName('suggestion').forEach(element => {
        element['value'] = '';
      });
      return;
    }
    if (params.refId == null && params.stateId == '2') {
      this.common.showToast('please select driver(other)');
      document.getElementsByName('suggestion').forEach(element => {
        element['value'] = '';
      });
      return;
    }
    if (params.refId == null && params.stateId == '3') {
      this.common.showToast('please select Branch');
      document.getElementsByName('suggestion').forEach(element => {
        element['value'] = '';
      });
      return;
    }
    if (params.refId == null && params.stateId == '4') {
      this.common.showToast('please select withEmployee');
      document.getElementsByName('suggestion').forEach(element => {
        element['value'] = '';
      });
      return;
    }
    if (params.refId == null && params.stateId == '11') {
      this.common.showToast('please select warehouse');
      document.getElementsByName('suggestion').forEach(element => {
        element['value'] = '';
      });
      return;
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
