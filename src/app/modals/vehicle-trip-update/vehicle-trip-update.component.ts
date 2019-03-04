import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ReminderComponent } from '../../modals/reminder/reminder.component';


declare var google: any;

@Component({
  selector: 'vehicle-trip-update',
  templateUrl: './vehicle-trip-update.component.html',
  styleUrls: ['./vehicle-trip-update.component.scss','../../pages/pages.component.css']
})
export class VehicleTripUpdateComponent implements OnInit {
  vehicleTrip = {
    endLat: null,
    endLng: null,
    endName: null,
    targetTime: null,
    id: null,
    regno: null,
    startLat: null,
    startLng: null,
    startName: null,
    startTime: null,
    placementType:null,
    vehicleId:null
  };
  placements = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    this.vehicleTrip.endLat = this.common.params.endLat;
    this.vehicleTrip.endLng = this.common.params.endLng;
    this.vehicleTrip.endName = this.common.params.endName;
    this.vehicleTrip.id = this.common.params.id;;
    this.vehicleTrip.regno = this.common.params.regno;
    this.vehicleTrip.vehicleId = this.common.params.vehicleId;
    this.vehicleTrip.startLat = this.common.params.startLat;
    this.vehicleTrip.startLng = this.common.params.startLng;
    this.vehicleTrip.startName = this.common.params.startName;
    this.vehicleTrip.startTime = this.common.changeDateformat(this.common.params.startTime);
    this.getVehiclePlacements();
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    //setTimeout(this.autoSuggestion.bind(this, 'vehicleTrip_starttrip'), 3000);
    setTimeout(this.autoSuggestion.bind(this, 'vehicleTrip_endtrip'), 3000);

  }
  openReminderModal(){
    this.common.params.returnData = true;
    this.common.params.title = "Target Time";
    const activeModal = this.modalService.open(ReminderComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data",data);
      this.vehicleTrip.targetTime = data.date;
      this.vehicleTrip.targetTime= this.common.dateFormatter(new Date(this.vehicleTrip.targetTime));
      console.log('Date:', this.vehicleTrip.targetTime);
    });
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
    let place = autocomplete.getPlace();
    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();
    place = autocomplete.getPlace().formatted_address;
   
    this.setLocations(elementId,place,lat,lng);
  }

  setLocations(elementId,place,lat,lng){
    console.log("elementId",elementId,"place",place,"lat",lat,"lng",lng);
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

  closeModal() {
    this.activeModal.close();
  }

  updateTrip() {
    if(this.vehicleTrip.endName&&this.vehicleTrip.placementType){
    let params = {
      vehicleId: this.vehicleTrip.vehicleId,
      location: this.vehicleTrip.endName,
      locationLat: this.vehicleTrip.endLat,
      locationLng: this.vehicleTrip.endLng,
      placementType: this.vehicleTrip.placementType,
      targetTime: this.vehicleTrip.targetTime,

    }
    console.log("params", params);
    ++this.common.loading;
    this.api.post('TripsOperation/vehicleTripReplacement', params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['msg']);
        this.common.showToast(res['msg']);
        this.activeModal.close();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }else{
    alert("Next Location And Purpose is Mandatory");
  }
}

getVehiclePlacements(){
  let params = "vehId= 16475";// + this.vehicleTrip.vehicleId;
  this.api.get('VehicleTrips/vehiclePlacements?' +params)
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.placements = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
}

delete(placement) {
  console.log("issue",placement);
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
  
}
