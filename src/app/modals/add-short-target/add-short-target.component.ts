import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ChoosePeriodsComponent } from '../choose-periods/choose-periods.component';

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
    targetType: "51",
    time: null,
    isNotify: true,
  }

  constructor(private activeModal: NgbActiveModal, public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.vid = this.common.params.vehicleId;
    this.vRegNo = this.common.params.vehicleRegNo;

  }



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

    } else {
      let today = this.common.dateFormatter(new Date()).split(' ')[0];
      result = this.common.timeFormatter(today);
      let r1 = parseInt(result.split(':')[0]) + parseInt((this.addTarget.time).split('.')[0]);
      let r2 = parseInt(result.split(':')[1]) + parseInt((this.addTarget.time).split('.')[1]);
      result = today + ' ' + r1 + ':' + r2 + ':00';
      console.log('result', today, result);
    }

    //let startday = new Date(today.setDate(today.getHours() +);
    //console.log('starday', this.common.dateFormatter(startday));
    let params = {
      vehicleId: this.vid,
      targetType: this.addTarget.targetType,
      targetTime: result,
      isNotify: "" + this.addTarget.isNotify,
      targetParam1: this.targetDistance
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('Placement/addShortTarget', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res['data'])
        if (res['success'])
          this.common.showToast('Success');

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }

  closeModal() {
    this.activeModal.close();
  }


}
