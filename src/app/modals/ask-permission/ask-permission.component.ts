import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'ask-permission',
  templateUrl: './ask-permission.component.html',
  styleUrls: ['./ask-permission.component.scss']
})
export class AskPermissionComponent implements OnInit {

  tripId;

  constructor(
    public activeModal: NgbActiveModal,
    private common: CommonService,
    private api: ApiService
  ) {
    this.tripId = this.common.params.tripId;
    console.log('trip id is: ', this.tripId)
   }

  ngOnInit(): void {
  }

  closeModal(){
    this.activeModal.close();
  }

  deleteTrip(){
    let params = {
      tripId: this.tripId
    }
    ++this.common.loading;
    this.api.post('VehicleTrips/deleteVehicleTrip', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res);

        this.common.showToast(res['msg']);
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }

}
