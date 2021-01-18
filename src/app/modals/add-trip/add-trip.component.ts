import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { ReminderComponent } from '../../modals/reminder/reminder.component';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { IframeModalComponent } from '../iframe-modal/iframe-modal.component';
import { MapService } from '../../services/map.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AddDriverCompleteComponent } from '../DriverModals/add-driver-complete/add-driver-complete.component';

declare var google: any;
@Component({
  selector: 'add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.scss']
})
export class AddTripComponent implements OnInit {
  startTime = new Date() ;
  targetTime = new Date() ;
  tripTypeId = 1;
  VehicleId;
  prevehicleId;
  endLocationType = 'site';
  startLocationType = 'site';
  dis_all = 's';
  vehicleTrip = {
    endLat: null,
    endLng: null,
    endName: null,
    endLocId:null,
    regno: null,
    startLat: null,
    startLng: null,
    startName: null,
    startLocId:null,
    placementType: null
  };
  viaPoints =[{
    name : null,
    lat : null,
    long : null,
    locType : 'site',
    siteId  : null,
    type :1,
    radius : 200
  }]

  routes = [];
  routeId = null;
  routeName = null;
  driverId = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    public map : MapService,
    private sanitizer: DomSanitizer,
  ) {
    this.startTime = new Date() ;
    this.targetTime = new Date() ;
    this.VehicleId = this.common.params.vehId;
    this.prevehicleId = this.VehicleId;
    // this.getRoutes();
    console.log('veh id',this.common.params);
    if(this.dis_all=='rbt'){
      this.getRoutes();
    }
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

  selectLoactionSite(flag,event){
    console.log("flag,event",flag,event);
    if(flag=='start'){
      this.vehicleTrip.startLat = event.lat;
      this.vehicleTrip.startLng = event.long;
      this.vehicleTrip.startName = event.name;
      this.vehicleTrip.startLocId = event.id;
    }else if(flag=='end'){
      this.vehicleTrip.endLat = event.lat;
      this.vehicleTrip.endLng = event.long;
      this.vehicleTrip.endName = event.name;
      this.vehicleTrip.endLocId = event.id;
    }
  }

  selectLocationCity(flag,event){
    console.log("flag,event",flag,event);
    if(flag=='start'){
      this.vehicleTrip.startLat = event.lat;
      this.vehicleTrip.startLng = event.long;
      this.vehicleTrip.startName = event.location;
      this.vehicleTrip.startLocId = event.id;

    }else if(flag=='end'){
      this.vehicleTrip.endLat = event.lat;
      this.vehicleTrip.endLng = event.long;
      this.vehicleTrip.endName = event.location;
      this.vehicleTrip.endLocId = event.id;

    }
  }

  addTrip() {
    console.log(this.vehicleTrip);
    this.startTime = this.common.dateFormatter(this.startTime);
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
      viapoints : this.viaPoints,
      driverId : this.driverId
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
    let ids = '';
     ids= this.vehicleTrip.startLocId+","+this.vehicleTrip.endLocId+",";
    this.viaPoints.map(vp=>{
      ids+=vp.siteId+','
    })
    // let param = "points="+ids.slice(0, -1);
    // console.log("param",param);
    this.api.get('ViaRoutes/getViaRouteSuggestions?')
      .subscribe(res => {
        this.routes = res['data'];
      }, err => {
        console.log(err);
      });
  }

  addRoute() {
    let stPoint = {
      name : this.vehicleTrip.startName,
      lat : this.vehicleTrip.startLat,
      long : this.vehicleTrip.startLng,
      locType : this.startLocationType,
      siteId  : this.vehicleTrip.startLocId,
      type :1,
      radius : 200
    };

    let edPoint = {
      name : this.vehicleTrip.endName,
      lat : this.vehicleTrip.endLat,
      long : this.vehicleTrip.endLng,
      locType : this.endLocationType,
      siteId  : this.vehicleTrip.endLocId,
      type :1,
      radius : 200
    };
     
    let vp = JSON.parse(JSON.stringify(this.viaPoints));
   vp.unshift(stPoint,edPoint);
    const params = {
      name: this.routeName,
      kms: 0,
      routeType: 1,
      viaPoints:vp,
      vehicleId:this.VehicleId
    };
    console.log("Data :", params);
    this.common.loading++;
    this.api.post('ViaRoutes/saveAddHocRoute', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("test", res['data'][0].y_msg);
        if (res['data'][0].y_id <= 0) {

          this.common.showError(res['data'][0].y_msg);    
          return;
        }
        else {
          this.routeId = res['data'][0].y_id;
          this.common.showToast(res['data'][0].y_msg);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getRouteDetail(type) {
    console.log("Type Id", type);
    this.routeId = this.routes.find((element) => {
      return element.route_name == type;
    }).route_id;
    this.routeName = type;
  }

  addNew(){
    let vp =  {
       name:null,
       lat:null,
       long:null,
       locType : 'site',
       siteId:null,
       type :1,
       radius : 200
     };
     this.viaPoints.push(vp);
   }

   selectSite(event,i){
     console.log("event",event)
    this.viaPoints[i].name = event.name || event.location;
    this.viaPoints[i].lat = event.lat;
    this.viaPoints[i].long = event.long;
    this.viaPoints[i].siteId = event.id;
   }
   isReorder = true;
   btnText = 'Reorder';
   localOrder= [];
   travellingDistance = null;
   reordering(){
     if(this.isReorder){
      this.localOrder = this.viaPoints;
      this.getViaRouteOrder();
     }else{
       this.viaPoints = this.localOrder;
      this.travellingDistance = null;
     }
     console.log("this.localOrder",this.localOrder,"this.viaPoints",this.viaPoints);
    this.isReorder = !this.isReorder;
     this.btnText = this.isReorder ? 'Reorder' : 'Reset';
   }

   getViaRouteOrder(){
     this.common.loading++;
     let st = {
      name : this.vehicleTrip.startName,
      lat : this.vehicleTrip.startLat,
      long : this.vehicleTrip.startLng
     }
     let ed = {
      name : this.vehicleTrip.endName,
      lat : this.vehicleTrip.endLat,
      long : this.vehicleTrip.endLng
     }
     let params = {
        startLocation : st,
        locations : this.viaPoints,
        endLocation : ed
     }
    this.api.post('TripsOperation/rearrangeWithTSP',params)
    .subscribe(res => {
      this.common.loading--;
      this.viaPoints = res['data'].locationOrder;
      this.travellingDistance = res['data'].cost;
    }, err => {
      this.common.loading--;
      console.log(err);
    });
   }

   openShowRoute(){
    let st = {
      name : this.vehicleTrip.startName,
      lat : this.vehicleTrip.startLat,
      long : this.vehicleTrip.startLng
     }
     let ed = {
      name : this.vehicleTrip.endName,
      lat : this.vehicleTrip.endLat,
      long : this.vehicleTrip.endLng
     }
     let dtpoints = [];
     dtpoints.push(st);
     this.viaPoints.map(vp=>{
       if(vp.lat && vp.long){
       dtpoints.push(vp);
      }
     })
     dtpoints.push(ed);
     console.log("dtpoints",dtpoints,dtpoints.length)
     if(dtpoints.length>1){
       window.open(this.map.getURL(dtpoints));
     let data = {
       title : "Map Route",
       url :   this.map.getURL(dtpoints)
     }
    this.common.params.data = data;
  //   const activeModal = this.modalService.open(IframeModalComponent, { size: 'lg', container: 'nb-layout' });
  //   activeModal.result.then(data => {
  //   }); 
   }
   else{
     this.common.showError("Atleast Two Points required");
   }
  }
  getDriverInfo(driver) {  
      this.driverId = driver.id ? driver.id : driver.driver_id;
   
  }
  addDriver() {
    this.common.params = { vehicleId: null, vehicleRegNo: null };
    const activeModal = this.modalService.open(AddDriverCompleteComponent, { size: 'lg', container: 'nb-layout', windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      console.log("data", data);
      if (data.data) {
      }
    });
  }
}
