import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { MapService } from '../../services/map.service';
import { DomSanitizer } from '@angular/platform-browser';
import { AddDriverCompleteComponent } from '../DriverModals/add-driver-complete/add-driver-complete.component';

declare var google: any;
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { BasicPartyDetailsComponent } from '../basic-party-details/basic-party-details.component';

@AutoUnsubscribe()
@Component({
  selector: 'add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.scss']
})
export class AddTripComponent implements OnInit {
  startTime = new Date();
  targetTime = new Date();
  tripTypeId = 1;
  VehicleId;
  registerForm: FormGroup;
  prevehicleId;
  invoiceNo: string;
  endLocationType = 'site';
  startLocationType = 'site';
  regno: string;
  dis_all = 's';
  vehicleTrip = {
    endLat: null,
    endLng: null,
    endName: null,
    endLocId: null,
    regno: null,
    startLat: null,
    startLng: null,
    startName: null,
    startLocId: null,
    placementType: null
  };
  viaPoints = [{
    name: null,
    lat: null,
    long: null,
    locType: 'site',
    siteId: null,
    type: 1,
    radius: 200,
    time: null
  }]
  lr = {
    //branch:"Jaipur",
    taxPaidBy: null,
    consigneeName: null,
    consigneeAddress: null,
    consigneeId: null,
    deliveryAddress: null,
    consignorAddress: null,
    consignorName: null,
    consignorId: null,
    sameAsDelivery: false,
    paymentTerm: "1",
    payableAmount: 0,
    lrNumber: null,
    sourceCity: null,
    sourceLat: null,
    sourceLng: null,
    destinationCity: null,
    destinationLat: null,
    destinationLng: null,
    remark: null,
    date: null,
    amount: 0,
    gstPer: 0,
    lrType: 1
  };

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
    public map: MapService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder,
  ) {
    this.startTime = new Date();
    this.targetTime = new Date();
    this.VehicleId = this.common.params.vehId;
    this.prevehicleId = this.VehicleId;
    // this.getRoutes();
    console.log('veh id', this.common.params);
    if (this.dis_all == 'rbt') {
      this.getRoutes();
    }
  }


  ngOnDestroy() { }
  ngOnInit() {
    this.registerForm = this.fb.group({
      regNo: ['', Validators.required],
      startLocation: ['', Validators.required],
      destination: ['', Validators.required],
      invoiceNo: [''],
      startLocationType: [''],
      endLocationType: [''],
      tripTypeId: [''],
      viaPoints: this.fb.array([this.createViaPointsFormBuilder()])
    });
    setTimeout(() => this.getViaPointsParams());
  }

  createViaPointsFormBuilder() {
    return this.fb.group({
      name: [''],
      lat: [''],
      long: [''],
      locType: [''],
      siteId: [''],
      type: ['site'],
      radius: [''],
      time: ['']
    })
  }

  addViaPointsTime(time: any, formBuilder) {
    console.log('time:', time);
    console.log('formBuilder:', formBuilder);
    formBuilder.controls['time'].setValue(time);
  }

  ngAfterViewInit(): void {
    setTimeout(this.autoSuggestion.bind(this, 'vehicleTrip_starttrip'), 3000);
    setTimeout(this.autoSuggestion.bind(this, 'vehicleTrip_endtrip'), 3000);

  }

  get registerFormControl() {
    return this.registerForm.controls;
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

  addAssociation(assType) {
    console.log("open Association modal")
    this.common.params = {
      assType: assType
    };
    const activeModal = this.modalService.open(BasicPartyDetailsComponent, { size: 'lg', container: 'nb-layout', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }

  getConsigneeDetail(consignee) {
    console.log("consignee", consignee);
    this.lr.consigneeAddress = consignee.address;
    this.lr.consigneeName = consignee.name;
    this.lr.consigneeId = consignee.id;
  }

  getConsignorDetail(consignor) {
    console.log("consignor", consignor);
    this.lr.consignorAddress = consignor.address;
    this.lr.consignorName = consignor.name;
    this.lr.consignorId = consignor.id;
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

  selectLoactionSite(flag, event) {
    console.log("flag,event", flag, event);
    if (flag == 'start') {
      this.vehicleTrip.startLat = event.lat;
      this.vehicleTrip.startLng = event.long;
      this.vehicleTrip.startName = event.name;
      this.vehicleTrip.startLocId = event.id;
    } else if (flag == 'end') {
      this.vehicleTrip.endLat = event.lat;
      this.vehicleTrip.endLng = event.long;
      this.vehicleTrip.endName = event.name;
      this.vehicleTrip.endLocId = event.id;
    }
  }

  selectLocationCity(flag, event) {
    console.log("flag,event", flag, event);
    if (flag == 'start') {
      this.vehicleTrip.startLat = event.lat;
      this.vehicleTrip.startLng = event.long;
      this.vehicleTrip.startName = event.location;
      this.vehicleTrip.startLocId = event.id;

    } else if (flag == 'end') {
      this.vehicleTrip.endLat = event.lat;
      this.vehicleTrip.endLng = event.long;
      this.vehicleTrip.endName = event.location;
      this.vehicleTrip.endLocId = event.id;

    }
  }

  addTrip() {
    console.log(this.vehicleTrip);
    let params = {
      vehicleId: this.VehicleId,
      startTrip: this.vehicleTrip.startName,
      endTrip: this.vehicleTrip.endName,
      startLat: this.vehicleTrip.startLat,
      startLong: this.vehicleTrip.startLng,
      endLat: this.vehicleTrip.endLat,
      endLong: this.vehicleTrip.endLng,
      startTime: this.common.dateFormatter(this.startTime),
      tripTypeId: this.tripTypeId,
      routeId: this.routeId,
      endTime: this.common.dateFormatter(this.targetTime).split(' ')[0],
      viapoints: this.getViaPointsParams(),
      driverId: this.driverId,
      invoiceNo: this.invoiceNo,
      consignorId: this.lr.consignorId,
      consigneeId: this.lr.consigneeId,
      regno: this.regno

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

  getViaPointsParams() {
    let items = this.registerForm.get('viaPoints') as FormArray;
    console.log("items params", items.controls);

    let data = [];
    for (let i = 0; i < items.controls.length; i++) {
      let formBuilder = items.controls[i];
      data.push({
        name: formBuilder.get('name').value,
        lat: formBuilder.get('lat').value,
        long: formBuilder.get('long').value,
        locType: formBuilder.get('locType').value,
        siteId: formBuilder.get('siteId').value,
        type: formBuilder.get('type').value,
        radius: formBuilder.get('radius').value,
        time: formBuilder.get('time').value == '' ? null : this.common.dateFormatter(formBuilder.get('time').value)
      })
    }
    return data;
  }

  getvehicleData(vehicle) {
    console.log("vehicle", vehicle);
    this.VehicleId = vehicle.id;
    this.regno = vehicle.regno;
  }

  getRoutes() {
    let ids = '';
    ids = this.vehicleTrip.startLocId + "," + this.vehicleTrip.endLocId + ",";
    this.viaPoints.map(vp => {
      ids += vp.siteId + ','
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
      name: this.vehicleTrip.startName,
      lat: this.vehicleTrip.startLat,
      long: this.vehicleTrip.startLng,
      locType: this.startLocationType,
      siteId: this.vehicleTrip.startLocId,
      type: 1,
      radius: 200
    };

    let edPoint = {
      name: this.vehicleTrip.endName,
      lat: this.vehicleTrip.endLat,
      long: this.vehicleTrip.endLng,
      locType: this.endLocationType,
      siteId: this.vehicleTrip.endLocId,
      type: 1,
      radius: 200
    };

    let vp = JSON.parse(JSON.stringify(this.viaPoints));
    vp.unshift(stPoint, edPoint);
    const params = {
      name: this.routeName,
      kms: 0,
      routeType: 1,
      viaPoints: vp,
      vehicleId: this.VehicleId
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

  addNew() {
    let items = this.registerForm.get('viaPoints') as FormArray;
    items.push(this.createViaPointsFormBuilder());
  }

  setViaPointsTime(time, formBuilder) {
    formBuilder.controls['time'].setValue(time);
  }

  selectSiteAndCity(city, formBuilder) {
    formBuilder.controls['name'].setValue(city.name || city.location);
    formBuilder.controls['lat'].setValue(city.lat);
    formBuilder.controls['long'].setValue(city.long);
    formBuilder.controls['siteId'].setValue(city.id);
  }

  isReorder = true;
  btnText = 'Reorder';
  localOrder = [];
  travellingDistance = null;
  reordering() {
    if (this.isReorder) {
      this.localOrder = this.viaPoints;
      this.getViaRouteOrder();
    } else {
      this.viaPoints = this.localOrder;
      this.travellingDistance = null;
    }
    console.log("this.localOrder", this.localOrder, "this.viaPoints", this.viaPoints);
    this.isReorder = !this.isReorder;
    this.btnText = this.isReorder ? 'Reorder' : 'Reset';
  }

  getViaRouteOrder() {
    this.common.loading++;
    let st = {
      name: this.vehicleTrip.startName,
      lat: this.vehicleTrip.startLat,
      long: this.vehicleTrip.startLng
    }
    let ed = {
      name: this.vehicleTrip.endName,
      lat: this.vehicleTrip.endLat,
      long: this.vehicleTrip.endLng
    }
    let params = {
      startLocation: st,
      locations: this.getViaPointsParams(),
      endLocation: ed
    }
    this.api.post('TripsOperation/rearrangeWithTSP', params)
      .subscribe(res => {
        this.common.loading--;
        this.viaPoints = res['data'].locationOrder;
        this.travellingDistance = res['data'].cost;
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  openShowRoute() {
    let st = {
      name: this.vehicleTrip.startName,
      lat: this.vehicleTrip.startLat,
      long: this.vehicleTrip.startLng
    }
    let ed = {
      name: this.vehicleTrip.endName,
      lat: this.vehicleTrip.endLat,
      long: this.vehicleTrip.endLng
    }
    let dtpoints = [];
    dtpoints.push(st);
    this.viaPoints.map(vp => {
      if (vp.lat && vp.long) {
        dtpoints.push(vp);
      }
    })
    dtpoints.push(ed);
    console.log("dtpoints", dtpoints, dtpoints.length)
    if (dtpoints.length > 1) {
      window.open(this.map.getURL(dtpoints));
      let data = {
        title: "Map Route",
        url: this.map.getURL(dtpoints)
      }
      this.common.params.data = data;
      //   const activeModal = this.modalService.open(IframeModalComponent, { size: 'lg', container: 'nb-layout' });
      //   activeModal.result.then(data => {
      //   }); 
    }
    else {
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
