import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ReminderComponent } from '../../modals/reminder/reminder.component';
import { ChoosePeriodsComponent } from '../choose-periods/choose-periods.component';
import { LocationSelectionComponent } from '../../modals/location-selection/location-selection.component';

declare var google: any;

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicle-trip-update',
  templateUrl: './vehicle-trip-update.component.html',
  styleUrls: ['./vehicle-trip-update.component.scss', '../../pages/pages.component.css']
})
export class VehicleTripUpdateComponent implements OnInit {
  vehicleStatus = null;
  keepGoing = true;
  searchString = '';
  isNotified = false;
  vehicleTrip = {
    endLat: null,
    endLng: null,
    endName: null,
    targetTime: null,
    id: null,
    regno: null,

    startName: null,

    placementType: null,
    vehicleId: null,
    siteId: null,
    locationType: 'city',
    allowedHaltHours: null
  };
  placements = null;
  placementSite = null;
  placementSuggestion = [];
  ref_page = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    console.log(this.common.params)

    this.vehicleTrip.vehicleId = this.common.params.tripDetils.vehicleId;
    this.vehicleTrip.siteId = this.common.params.tripDetils.siteId;
    this.ref_page = this.common.params.ref_page;
    console.log("ref_page", this.ref_page);
    if (this.ref_page == 'placements') {
      this.vehicleTrip.placementType = '11';
    }
    else {
      this.vehicleTrip.placementType = '0';
    }

    this.getVehiclePlacements();
    this.getPlacementSuggestion();
    this.getVehicleCurrentStatus();
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  selecteCity() {
    console.log("city selected");
    setTimeout(this.autoSuggestion.bind(this, 'vehicleTrip_endtrip', false), 3000);
  }

  ngAfterViewInit(): void {
    //setTimeout(this.map, 3000);
    setTimeout(this.autoSuggestion.bind(this, 'vehicleTrip_endtrip', false), 1000);

  }

  openReminderModal() {
    this.common.params.returnData = true;
    this.common.params.title = "Target Time";
    const activeModal = this.modalService.open(ReminderComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data);
      this.vehicleTrip.targetTime = data.date;
      this.vehicleTrip.targetTime = this.common.dateFormatter(new Date(this.vehicleTrip.targetTime));
      console.log('Date:', this.vehicleTrip.targetTime);
    });
  }

  openTimePeriodModal() {
    this.common.params = { refPage: 'placements', title: "Allowed Halt Hours" };
    const activeModal = this.modalService.open(ChoosePeriodsComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data);
      this.vehicleTrip.allowedHaltHours = data.duration;
      //this.vehicleTrip.targetTime= this.common.dateFormatter(new Date(this.vehicleTrip.targetTime));
      console.log('allowedHaltHours:', this.vehicleTrip.allowedHaltHours);
    });
  }

  autoSuggestion(elementId, locType) {
    console.log("locType", locType);
    var options;
    if (locType) {
      options = {
        //types: ['(address)'],
        componentRestrictions: { country: "in" }
      };
    }
    else {
      options = {
        types: ['(cities)'],
        componentRestrictions: { country: "in" }
      };
    }
    let ref = document.getElementById(elementId);//.getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(ref, options);
    google.maps.event.addListener(autocomplete, 'place_changed', this.updateLocation.bind(this, elementId, autocomplete));
  }

  updateLocation(elementId, autocomplete) {
    console.log('tets');
    let place = autocomplete.getPlace();
    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();
    place = autocomplete.getPlace().formatted_address;

    this.setLocations(elementId, place, lat, lng);
  }

  setLocations(elementId, place, lat, lng) {
    this.vehicleTrip.endLat = lat;
    this.vehicleTrip.endLng = lng;
    this.vehicleTrip.endName = place;
    this.placementSite = null;
  }

  closeModal() {
    this.activeModal.close();
  }

  updateTrip() {

    console.log("Placement Type", this.vehicleTrip.placementType);
    if ((this.vehicleTrip.endLat || this.placementSite) && this.vehicleTrip.placementType) {
      let params = {
        vehicleId: this.vehicleTrip.vehicleId,
        location: this.vehicleTrip.endName ? this.vehicleTrip.endName.split(',')[0] : '',
        locationLat: this.vehicleTrip.endLat,
        locationLng: this.vehicleTrip.endLng,
        placementType: this.vehicleTrip.placementType,
        targetTime: this.vehicleTrip.targetTime,
        allowedHaltHours: this.vehicleTrip.allowedHaltHours,
        siteId: this.placementSite ? this.placementSite : 'null',
        isNotified: this.isNotified
      }

      console.log("params", params);

      ++this.common.loading;
      this.api.post('TripsOperation/vehicleTripReplacement', params)
        .subscribe(res => {
          --this.common.loading;
          if (res['data'][0]['rtn_id'] > 0)
            this.common.showToast(res['msg']);
          else {
            this.common.showToast(res['data'][0]['rtn_msg']);
          }
          this.getVehiclePlacements();
          // this.activeModal.close();
        }, err => {
          --this.common.loading;
          console.log('Err:', err);
        });
    } else {
      alert("Next Location And Purpose is Mandatory");
    }
  }

  getVehicleCurrentStatus() {
    this.common.loading++;
    let params = {
      vehicleId: this.vehicleTrip.vehicleId,
    }

    this.api.post('Placement/getVehicleCurrentStatus', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res: ', res['data']);
        this.vehicleStatus = res['data'][0];
      }, err => {
        this.common.loading--;
        console.error(err);
        this.common.showError();
      });
  }

  getPlacementSuggestion() {
    let params = {
      vehicleId: this.vehicleTrip.vehicleId,
      siteId: this.vehicleTrip.siteId
    }

    this.api.post('Placement/getSuggestion?', params)
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.placementSuggestion = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  getVehiclePlacements() {
    ++this.common.loading;
    let params = "vehId=" + this.vehicleTrip.vehicleId;
    this.api.get('VehicleTrips/vehiclePlacements?' + params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res: ', res['data']);
        this.placements = res['data'];
      }, err => {
        --this.common.loading;
        console.error(err);
        this.common.showError();
      });
  }

  delete(placement) {
    console.log("issue", placement);
    this.common.loading++;
    let params = {
      placementId: placement.id,
      status: true
    };
    console.log(params);
    this.api.post('VehicleTrips/updateVehiclePlacement?', params)
      .subscribe(res => {
        this.common.loading--;
        this.getVehiclePlacements();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  setPlacementDetail(placementSuggestion) {
    console.log("placementSuggestion", placementSuggestion);
    this.vehicleTrip.endName = placementSuggestion.y_loc_name;
    this.vehicleTrip.endLat = placementSuggestion.y_lat;
    this.vehicleTrip.endLng = placementSuggestion.y_long;
    this.placementSite = placementSuggestion.y_site_id;

  }
  selectLocation(place) {
    console.log("palce", place);
    this.placementSite = place.id;
    this.vehicleTrip.siteId = null;
    this.vehicleTrip.endLat = place.lat;
    this.vehicleTrip.endLng = place.long;
    this.vehicleTrip.endName = place.location || place.name;
  }

  onChangeAuto(search) {
    this.placementSite = null;
    this.vehicleTrip.siteId = null;
    this.vehicleTrip.endLat = null;
    this.vehicleTrip.endLng = null;
    this.vehicleTrip.endName = null;
    this.searchString = search;
    console.log('..........', search);
  }

  selectSite(site) {
    console.log("site=", site);
    this.vehicleTrip.endLat = null;
    this.vehicleTrip.endLng = null;
    this.vehicleTrip.endName = null;//site.name;
    this.placementSite = site.id;

  }
  takeAction(res) {
    setTimeout(() => {
      console.log("Here", this.keepGoing, this.searchString.length, this.searchString);

      if (this.keepGoing && this.searchString.length) {
        this.common.params = { placeholder: 'select Location', title: 'Select Location' };

        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          if (res != null) {
            console.log('response----', res, res.location, res.id);
            this.keepGoing = true;
            if (res.location.lat) {
              this.vehicleTrip.endName = res.location.name;

              (<HTMLInputElement>document.getElementById('endname')).value = this.vehicleTrip.endName;
              this.vehicleTrip.endLat = res.location.lat;
              this.vehicleTrip.endLng = res.location.lng;
              this.placementSite = res.id;
              this.keepGoing = true;
            }
          }
        })

      }
    }, 1000);

  }

  getTripHtml(oldTrip){
    oldTrip = JSON.parse(oldTrip);
    let trip = this.common.getTripStatusHTML(oldTrip._trip_status_type,oldTrip._showtripstart, oldTrip._showtripend, oldTrip._placement_types, oldTrip._p_loc_name);
    // let trip = '<span [innerHTML]='+this.common.getTripStatusHTML(oldTrip._trip_status_type,oldTrip._showtripstart, oldTrip._showtripend, oldTrip._placement_types, oldTrip._p_loc_name)['changingThisBreaksApplicationSecurity']+'></span><br>';
    console.log("trip",trip);
    return trip;
    // return this.sanitizer.bypassSecurityTrustHtml(trip);
  }
}
