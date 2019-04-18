import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'trip-status-feedback',
  templateUrl: './trip-status-feedback.component.html',
  styleUrls: ['./trip-status-feedback.component.scss', '../pages.component.css']
})
export class TripStatusFeedbackComponent implements OnInit {
  trips = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getTrips();
  }

  ngOnInit() {
  }

  getTrips() {
    this.common.loading++;
    this.api.get('TripsOperation/tripDetailsForVerification')
      .subscribe(res => {
        this.common.loading--;
        this.trips = res['data'];
        for (let i = 0; i < this.trips.length; i++) {
          this.trips[i].status = '';
        }
        console.log("Trips", this.trips);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  tripVerified(trip, action, i) {

    console.log("action", action);
    if (action == "true") {
      this.changeVerification(trip, action, i);

      // this.common.params = {
      //   title: "Trip Verification",
      //   description: " Do you really want to verify it ?"
      // }
      // const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      // activeModal.result.then(data => {
      //   if (data.response) {
      //     this.changeVerification(trip, action,i);
      //   }
      // });
    }
    else if ((action == 'false') && ((trip.status > 0) || (trip.origin) || (trip.destination))) {
      this.changeVerification(trip, action, i);

    }
    else {
      this.common.showError("One Input Field is Mandatory");
    }

  }

  changeVerification(trip, action, i?) {
    let params = {
      vehicleId: trip.r_vid,
      verifyFlag: action,
      oldOrigin: trip.r_origin,
      oldDestination: trip.r_destination,
      oldState: trip.r_state_id,
      newOrigin: trip.origin ? trip.origin : '',
      newDestination: trip.destination ? trip.destination : '',
      newState: trip.status
    }
    console.log("params", params);
    this.trips.splice(i, 1);
    //this.common.loading++;
    this.api.post('TripsOperation/tripVerification', params)
      .subscribe(res => {
        // this.common.loading--;
        console.log("response", res['data'][0].rtn_id);
        if (res['data'][0].rtn_id > 0) {
          this.common.showToast("Successfully Verified");
          // this.getTrips();
        }
        else {
          this.common.showError(res['data'][0].rtn_msg);
        }
      }, err => {
        // this.common.loading--;
        console.log(err);
      });
  }

}
