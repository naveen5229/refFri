import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';

@Component({
  selector: 'trip-status-feedback',
  templateUrl: './trip-status-feedback.component.html',
  styleUrls: ['./trip-status-feedback.component.scss', '../pages.component.css']
})
export class TripStatusFeedbackComponent implements OnInit {
  trips = [];
  states = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.getTrips();
    this.getStates();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh() {

    this.getTrips();
  }
getStates(){
  this.common.loading++;
  this.api.get('Suggestion/getAllDashboardStatus')
    .subscribe(res => {
      this.common.loading--;
      this.states = res['data'] || [];
    }, err => {
      this.common.loading--;
      console.log(err);
    });
}

  selectState(event,index){
    this.trips[index].status = '';
    this.trips[index].status=(event.v_is_ncv||'')+","+(event.prim_status||'')+","+(event.sec_status||'');
    console.log("this.trips[index].status",this.trips[index].status);
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
    }
    else if ((action == 'false') && ((trip.status) || (trip.origin) || (trip.destination))) {
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
      newState: trip.status,
      location: trip.r_location,
      remark: trip.remark
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
  showLocation(kpi) {
    if (!kpi.r_lat) {
      this.common.showToast("Vehicle location not available!");
      return;
    }
    const location = {
      lat: kpi.r_lat,
      lng: kpi.r_lng,
      name: "",
      time: ""
    };
    ////console.log("Location: ", location);
    this.common.params = { location, title: "Vehicle Location" };
    const activeModal = this.modalService.open(LocationMarkerComponent, {
      size: "lg",
      container: "nb-layout"
    });
  }


  printPDF(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = fodata['name'];
        let center_heading = "Trip Status FeedBack";
        this.common.getPDFFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  printCsv(tblEltId) {
    this.common.loading++;
    let userid = this.user._customer.id;
    if (this.user._loggedInBy == "customer")
      userid = this.user._details.id;
    this.api.post('FoAdmin/getFoDetailsFromUserId', { x_user_id: userid })
      .subscribe(res => {
        this.common.loading--;
        let fodata = res['data'];
        let left_heading = "Customer Name::" + fodata['name'];
        let center_heading = "Report Name::" + "Trip Status FeedBack";
        this.common.getCSVFromTableId(tblEltId, left_heading, center_heading, ["Action"], '');
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }
}
