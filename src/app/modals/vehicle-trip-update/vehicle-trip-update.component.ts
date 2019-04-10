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
    vehicleId:null,
    siteId:null
  };
  placements = null;
  placementSuggestion = null;
  ref_page = null ;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private datePipe: DatePipe,
    private modalService: NgbModal,
  ) {
    console.log(this.common.params)
    this.vehicleTrip.endLat = this.common.params.tripDetils.endLat;
    this.vehicleTrip.endLng = this.common.params.tripDetils.endLng;
    this.vehicleTrip.endName = this.common.params.tripDetils.endName;
    this.vehicleTrip.id = this.common.params.tripDetilsid;;
    this.vehicleTrip.regno = this.common.params.tripDetils.regno;
    this.vehicleTrip.vehicleId = this.common.params.tripDetils.vehicleId;
    this.vehicleTrip.startLat = this.common.params.tripDetils.startLat;
    this.vehicleTrip.startLng = this.common.params.tripDetils.startLng;
    this.vehicleTrip.startName = this.common.params.tripDetils.startName;
    this.vehicleTrip.siteId = this.common.params.tripDetils.siteId;
    this.vehicleTrip.startTime = this.common.changeDateformat(this.common.params.tripDetils.startTime);
    this.ref_page = this.common.params.ref_page;
    console.log("ref_page",this.ref_page);
    if(this.ref_page == 'placements'){
      this.vehicleTrip.placementType = '11';
    }else{
      this.vehicleTrip.placementType = '0';
    }
    this.getVehiclePlacements();
    this.getPlacementSuggestion();
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
      this.vehicleTrip.endLat = lat;
      this.vehicleTrip.endLng = lng;
      this.vehicleTrip.endName = place;
  }

  closeModal() {
    this.activeModal.close();
  }

  updateTrip() {
    if(this.vehicleTrip.endName&&this.vehicleTrip.placementType){
    let params = {
      vehicleId: this.vehicleTrip.vehicleId,
      location: this.vehicleTrip.endName.split(',')[0],
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
        this.getVehiclePlacements();
       // this.activeModal.close();
      }, err => {
        --this.common.loading;
        console.log('Err:', err);
      });
  }else{
    alert("Next Location And Purpose is Mandatory");
   }
}

getPlacementSuggestion(){
  let params ={
    vehicleId: this.vehicleTrip.vehicleId,
    siteId: this.vehicleTrip.siteId
  } 
 
  this.api.post('Placement/getSuggestion?' ,params)
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.placementSuggestion = res['data'];
      }, err => {
        console.error(err);
        this.common.showError();
      });
}

getVehiclePlacements(){
  ++this.common.loading;
  let params = "vehId=" +this.vehicleTrip.vehicleId;
  this.api.get('VehicleTrips/vehiclePlacements?' +params)
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
  
setPlacementDetail(placementSuggestion){
  console.log("placementSuggestion",placementSuggestion);
  this.vehicleTrip.endName = placementSuggestion.loc_name;
  this.vehicleTrip.endLat = placementSuggestion.lat;
  this.vehicleTrip.endLng = placementSuggestion.long;
}
}
