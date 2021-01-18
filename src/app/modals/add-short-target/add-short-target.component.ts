import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChoosePeriodsComponent } from '../choose-periods/choose-periods.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'add-short-target',
  templateUrl: './add-short-target.component.html',
  styleUrls: ['./add-short-target.component.scss']
})
export class AddShortTargetComponent implements OnInit {

  targetDistance;
  vid;
  vRegNo;

  addTarget = {
    targetType: "101",
    time: null,
    isNotify: true,
  }

  constructor(private activeModal: NgbActiveModal, public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.vid = this.common.params.vehicleId;
    this.vRegNo = this.common.params.vehicleRegNo;

  }



  ngOnDestroy(){}
ngOnInit() {
  }

  getTime() {
    this.common.params = { refPage: 'placements', title: "Choose Target Time" };
    const activeModal = this.modalService.open(ChoosePeriodsComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data);
      if (parseFloat(data.duration) > 36.0) {
        this.common.showError("Time Should be less than 36 Hrs");

      } else {
        this.addTarget.time = data.duration;
        // this.vehicleTrip.allowedHaltHours = data.duration;
        // this.addTarget.time = new Date().getHours + (data.duration);
        console.log('data duration', this.addTarget.time);
      }
    });
  }

  saveTarget() {
    let result;
    if (this.addTarget.time == null) {
      this.common.showError("Please Select Duration");
      return;

    }
    let today = new Date(new Date().toUTCString());
    let hours = parseInt(this.addTarget.time.split('.')[0]);
    let minutes = parseInt(this.addTarget.time.split('.')[1]);
    today.setHours(today.getHours() + hours);
    today.setMinutes(today.getMinutes() + minutes);
    let targetTime = this.common.dateFormatter(today);

    //let startday = new Date(today.setDate(today.getHours() +);
    //console.log('starday', this.common.dateFormatter(startday));
    let params = {
      vehicleId: this.vid,
      targetType: this.addTarget.targetType,
      targetTime: targetTime,
      isNotify: "" + this.addTarget.isNotify,
      targetParam1: this.targetDistance
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Placement/addShortTarget', params)
      .subscribe(res => {
        this.common.loading--;
        let response = res['data'][0];
        console.log("response==", response);
        if (response.id > 0) {
          this.common.showToast('Success');
          this.closeModal();
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  closeModal() {
    this.activeModal.close();
  }


}
