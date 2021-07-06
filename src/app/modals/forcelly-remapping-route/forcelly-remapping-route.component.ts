import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'forcelly-remapping-route',
  templateUrl: './forcelly-remapping-route.component.html',
  styleUrls: ['./forcelly-remapping-route.component.scss']
})
export class ForcellyRemappingRouteComponent implements OnInit {
  title = 'Confirmation Modal';
  description = '';
  btn1 = '';
  btn2 = '';
  vehicleTripId;
  routeId

  constructor(public api: ApiService,
    public common: CommonService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title;
    this.description = this.common.params.description || 'Are you sure?';
    this.btn1 = this.common.params.btn1 || 'submit';
    this.btn2 = this.common.params.btn2 || 'Cancel';
    this.vehicleTripId = this.common.params.vehicleTripId;
    this.routeId = this.common.params.routeId;
  }

  ngOnInit() {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  submit() {
    let params = {
      vehicleTripId: this.vehicleTripId,
      routeId: this.routeId,
      isForce: true
    }

    console.log('params is: ', params);

    this.common.loading++;
    this.api.postJavaPortDost(8093, 'remapTripAndRoute', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('response is: ', res)
        this.common.showToast(res['msg'])
        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log('err is: ', err)
        this.closeModal(true);
      })

  }
}
