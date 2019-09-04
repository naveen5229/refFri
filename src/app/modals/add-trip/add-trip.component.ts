import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ReminderComponent } from '../../modals/reminder/reminder.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';

declare var google: any;
@Component({
  selector: 'add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.scss']
})
export class AddTripComponent implements OnInit {
  startTime;
  targetTime;
  tripTypeId = 1;
  VehicleId;
  prevehicleId;
  vehicleTrip = {
    endLat: null,
    endLng: null,
    endName: null,
    regno: null,
    startLat: null,
    startLng: null,
    startName: null,
    placementType: null
  };
  routes = [];
  routeId = null;
  routeName = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    this.startTime = this.common.dateFormatter(new Date());
    this.targetTime = this.common.dateFormatter(new Date());
    this.VehicleId = this.common.params.vehId;
    this.prevehicleId = this.VehicleId;
    this.getRoutes();
    console.log('veh id',this.common.params);
  }


  ngOnInit() {
  }
  ngAfterViewInit(): void {
    setTimeout(this.autoSuggestion.bind(this, 'vehicleTrip_starttrip'), 3000);
    setTimeout(this.autoSuggestion.bind(this, 'vehicleTrip_endtrip'), 3000);

  }
  getDate(type) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start')
          this.startTime = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        if (type == 'end')
          this.targetTime = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        console.log('lrdate: ' + this.startTime);
      }
    });
  }

  autoSuggestion(elementId) {
    var options = {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    };
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
    console.log("elementId", elementId, "place", place, "lat", lat, "lng", lng);
    if (elementId == 'vehicleTrip_starttrip') {
      this.vehicleTrip.startName = place;
      this.vehicleTrip.startLat = lat;
      this.vehicleTrip.startLng = lng;
    } else if (elementId == 'vehicleTrip_endtrip') {
      this.vehicleTrip.endLat = lat;
      this.vehicleTrip.endLng = lng;
      this.vehicleTrip.endName = place;
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  addTrip() {
    console.log(this.vehicleTrip);
    this.startTime = this.common.dateFormatter(this.startTime).split(' ')[0];
    console.log('startTime', this.startTime);
    this.targetTime = this.common.dateFormatter(this.targetTime).split(' ')[0];
    console.log('targetTime', this.targetTime);
    let params = {
      vehicleId: this.VehicleId,
      startTrip: this.vehicleTrip.startName,
      endTrip: this.vehicleTrip.endName,
      startLat: this.vehicleTrip.startLat,
      startLong: this.vehicleTrip.startLng,
      endLat: this.vehicleTrip.endLat,
      endLong: this.vehicleTrip.endLng,
      startTime: this.startTime,
      tripTypeId: this.tripTypeId,
      routeId: this.routeId,
      endTime: this.targetTime,

    }
    console.log("params", params);
    ++this.common.loading;
    this.api.post('VehicleTrips/insertTripDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['msg']);
        this.common.showToast(res['msg']);
        this.activeModal.close(true);
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }


  getvehicleData(vehicle) {
    console.log("vehicle", vehicle);
    this.VehicleId = vehicle.id;
  }

  getRoutes() {
    this.api.get('ViaRoutes/getRoutes')
      .subscribe(res => {
        this.routes = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  getRouteDetail(type) {
    console.log("Type Id", type);
    this.routeId = this.routes.find((element) => {
      return element.name == type;
    }).id;
    this.routeName = type;
  }

}
