import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

declare var google: any;

@Component({
  selector: 'vehicle-trip-update',
  templateUrl: './vehicle-trip-update.component.html',
  styleUrls: ['./vehicle-trip-update.component.scss']
})
export class VehicleTripUpdateComponent implements OnInit {
  vehicleTrip = {
    endLat: null,
    endLng: null,
    endName: null,
    endTime: null,
    id: null,
    regno: null,
    startLat: null,
    startLng: null,
    startName: null,
    startTime: null,
  };
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
  ) {
    this.vehicleTrip.endLat = this.common.params.endLat;
    this.vehicleTrip.endLng = this.common.params.endLng;
    this.vehicleTrip.endName = this.common.params.endName;
    this.vehicleTrip.endTime = this.common.params.endTime;
    this.vehicleTrip.id = this.common.params.id;
    this.vehicleTrip.regno = this.common.params.regno;
    this.vehicleTrip.startLat = this.common.params.startLat;
    this.vehicleTrip.startLng = this.common.params.startLng;
    this.vehicleTrip.startName = this.common.params.startName;
    this.vehicleTrip.startTime = this.common.params.startTime;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    setTimeout(this.autoSuggestion.bind(this, 'vehicleTrip_starttrip'), 3000);
    setTimeout(this.autoSuggestion.bind(this, 'vehicleTrip_endtrip'), 3000);

  }
  autoSuggestion(elementId) {
    var options = {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    };
    let ref = document.getElementById(elementId);//.getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(ref, options);
    google.maps.event.addListener(autocomplete, 'place_changed', this.updateLocation.bind(this,elementId, autocomplete));
  }

  updateLocation(elementId,autocomplete) {
    console.log('tets');
    let place = autocomplete.getPlace().formatted_address;
    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();
    this.setLocations(elementId,place,lat,lng);
  }

  setLocations(elementId,place,lat,lng){
    if(elementId=='vehicleTrip_starttrip'){
    this.vehicleTrip.startName = place;
    this.vehicleTrip.startLat = lat;
    this.vehicleTrip.startLng = lng;
    }else if(elementId=='vehicleTrip_endtrip'){
      this.vehicleTrip.endLat = lat;
      this.vehicleTrip.endLng = lng;
      this.vehicleTrip.endName = place;
    }
  }



  closeModal(response) {
    this.activeModal.close();
  }

  updateTrip() {
    let params = {
      vehicleTripId: this.vehicleTrip.id,
      endTrip: this.vehicleTrip.endName,
      endLat: this.vehicleTrip.endLat,
      endLong: this.vehicleTrip.endLng,
      startTrip: this.vehicleTrip.startName,
      startLat: this.vehicleTrip.startLat,
      startLong: this.vehicleTrip.startLng,
    }
    console.log("params", params);
    ++this.common.loading;
    this.api.post('TripsOperation/updateTripDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res:', res);
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }
}
