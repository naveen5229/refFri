import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { TollpaymentmanagementComponent } from '../../modals/tollpaymentmanagement/tollpaymentmanagement.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'trip-status-feedback',
  templateUrl: './trip-status-feedback.component.html',
  styleUrls: ['./trip-status-feedback.component.scss', '../pages.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TripStatusFeedbackComponent implements OnInit {
  today = new Date();
  dateData=[];
  tripStatusDate=0;
  trips = [];
  allTrips = [];
  states = [];
  allSelected = false;
  showVerify = false;
  pages = {
    count: 1,
    active: 1,
    limit: 50
  }

  selected = {
    trip: false
  }
  constructor(public api: ApiService,
    public common: CommonService, private cdr: ChangeDetectorRef,
    public user: UserService,
    private modalService: NgbModal) {
    this.getTrips();
    this.getStates();
    this.common.refresh = this.refresh.bind(this);
    // new Date(today.setDate(today.getDate() - 4)),
    
      this.dateData = [
      { id: 0, name: 'Today' },
      { id: 1, name: '-1 Days' },
      { id: 2, name: '-2 Days' },
      { id: 3, name: '-3 Days' },
      { id: 4, name: '-4 Days' },
      { id: 5, name: '-5 Days' },
    ]
    console.log("DateFormate:", this.dateData);
  }

  ngOnDestroy() { }
  ngOnInit() {
  }

  refresh() {
    this.getTrips();
    this.getStates();
    this.allSelected = false;
    this.trips = [];
    this.allTrips = [];
    this.states = [];
    this.allSelected = false;
    this.showVerify = false;
    this.pages = {
      count: 1,
      active: 1,
      limit: 50
    }

    this.selected = {
      trip: false
    }
  }

  selectOneCheck(trip) {
    if (trip.selected) {
      this.showVerify = true;
    }

    let firstSelected = this.trips.find((e) => {
      return e.selected;
    });
    let firstDeselected = this.trips.find((e) => {
      return !e.selected;
    })
    if (!firstSelected) {
      this.showVerify = false;
    }
    if (firstDeselected) {
      this.allSelected = false;
    } else {
      this.allSelected = true;
    }
    // console.log("trip.selected",trip.selected);

  }

  // tollPaymentManagement(){
  //   this.common.params={}
  //   const activeModal = this.modalService.open(TollpaymentmanagementComponent, {
  //     size: "lg",
  //     container: "nb-layout"
  //   });
  // }

  selectAllCheck() {
    if (this.allSelected) {
      this.showVerify = true;
    } else {
      this.showVerify = false;
    }
    for (let index = 0; index < this.trips.length; index++) {
      const element = this.trips[index];
      this.trips[index].selected = this.allSelected;
    }
  }

  verifyAll() {
    let promises = [];
    for (let i = 0; i < this.trips.length; i++) {
      if (this.trips[i].selected) {
        let p = this.tripVerified(this.trips[i], 'true', i, false);
        if (p) {
          promises.push(p);
        }
      }
    }
    console.log("Promises", promises);

    Promise.all(promises).then((values) => {
      this.refresh();
    })
  }

  getStates() {
    this.common.loading++;
    let subscription = this.api.get('Suggestion/getAllDashboardStatus')
      .subscribe(res => {
        this.common.loading--;
        this.states = res['data'] || [];
        subscription.unsubscribe();
      }, err => {
        this.common.loading--;
        console.log(err);
        subscription.unsubscribe();
      });
  }

  selectState(event, index) {
    this.trips[index].status = '';
    this.trips[index].status = (event.v_is_ncv || '') + "," + (event.prim_status || '') + "," + (event.sec_status || '');
    console.log("this.trips[index].status", this.trips[index].status);
  }

  getTrips() {
    console.log("TripStatusDate:",this.tripStatusDate);
    this.common.loading++;
    let param='';
    if(this.tripStatusDate>=1){
      param=this.common.dateFormatter1(new Date(this.today.setDate(this.today.getDate() - this.tripStatusDate))).toString();
    }
    let subscription = this.api.get('TripsOperation/tripDetailsForVerification?date='+param)
      .subscribe(res => {
        this.common.loading--;
        this.allTrips = res['data'];
        for (let i = 0; i < this.allTrips.length; i++) {
          this.allTrips[i].status = '';
          this.allTrips[i].selected = false;
        }
        this.setData();
        this.cdr.detectChanges();
        subscription.unsubscribe();
      }, err => {
        this.common.loading--;
        console.log(err);
        subscription.unsubscribe();
      });
  }

  tripVerified(trip, action, i, isTrimFirst = true) {
    let promise = null;
    if (action == "true") {
      promise = this.changeVerification(trip, action, i, isTrimFirst);
    } else if ((action == 'false') && ((trip.status) || (trip.trips))) {
      promise = this.changeVerification(trip, action, i, isTrimFirst);
    } else {
      this.common.showError("One Input Field is Mandatory");
    }
    this.cdr.detectChanges();
    return promise;
  }

  changeVerification(trip, action, i?, isTrimFirst = true) {
    let params = {
      vehicleId: trip.r_vid,
      verifyFlag: action,
      oldOrigin: trip.r_origin,
      oldDestination: trip.r_destination,
      oldState: trip.r_state_id,
      oldTrip: JSON.stringify(trip.r_trip),
      // newOrigin: trip.origin ? trip.origin : '',
      // newDestination: trip.destination ? trip.destination : '',
      newTrip: trip.trips || '',
      newState: trip.status,
      location: trip.r_location,
      remark: trip.remark
    };
    console.log("params", params);
    // return;
    if (isTrimFirst) {
      let index = (i) + ((this.pages.active - 1) * this.pages.limit)
      this.allTrips.splice(index, 1);
      this.setData();
      //this.common.loading++;
      this.cdr.detectChanges();
    }

    return this.api.post('TripsOperation/tripVerification', params)
      .subscribe(res => {
        // this.common.loading--;
        console.log("response", res['data'][0].rtn_id);
        if (res['data'][0].rtn_id > 0) {
          this.common.showToast("Successfully Verified");
          // this.getTrips();
        } else {
          this.common.showError(res['data'][0].rtn_msg);
        }
        this.cdr.detectChanges();

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

  handlePagination(page) {
    this.pages.active = page;
    let startIndex = this.pages.limit * (this.pages.active - 1);
    let lastIndex = (this.pages.limit * this.pages.active);
    this.trips = this.allTrips.slice(startIndex, lastIndex);
    this.cdr.detectChanges();
  }

  customPage(event) {
    event.preventDefault();
    event.stopPropagation();
    this.cdr.detectChanges();
    this.setData();
    this.cdr.detectChanges();
  }

  setData() {
    this.pages.count = Math.floor(this.allTrips.length / this.pages.limit);
    if (this.allTrips.length % this.pages.limit) {
      this.pages.count++;
    }
    if (this.pages.count < this.pages.active) {
      this.pages.active = this.pages.count;
    }
    let startIndex = this.pages.limit * (this.pages.active - 1);
    let lastIndex = (this.pages.limit * this.pages.active);
    this.trips = this.allTrips.slice(startIndex, lastIndex);
    this.cdr.detectChanges();
  }
}
