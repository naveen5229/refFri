import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'lr-nearby-pod',
  templateUrl: './lr-nearby-pod.component.html',
  styleUrls: ['./lr-nearby-pod.component.scss']
})
export class LrNearbyPodComponent implements OnInit {
  option = [{
    name: 'withdriver',
    id: '1'

  }, {
    name: 'withdriver(other)',
    id: '2'
  }]
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
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  selectElogistName(details) {
    this.refId = details.id;
    this.refDetails = details.empname;
  }
  selectName(details) {

    this.refId = details.id;
    this.refDetails = details.empname;
    if (details.id == null) {
      this.refDetails = null;
    }
  }
  getSelection(){

  }
  resetData(){
    
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
    this.activeModal.close();
  }
}
