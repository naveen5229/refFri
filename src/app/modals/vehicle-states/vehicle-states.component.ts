import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe, NumberFormatStyle } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { MapService } from '../../services/map.service';
import { detachProjectedView } from '@angular/core/src/view/view_attach';

declare var google: any;
@Component({
  selector: 'vehicle-states',
  templateUrl: './vehicle-states.component.html',
  styleUrls: ['./vehicle-states.component.scss']
})
export class VehicleStatesComponent implements OnInit {
  map: any;
  @ViewChild('map') mapElement: ElementRef;
  marker: any;
  stateType = "0";
  changeCategory = "halts";
  startDate;
  endDate;
  vid;
  remark = '';
  vehicleEvent = [];
  halt = {
    time: '',
    location: '',
    lat: '',
    long: ''
  };
  site = {
    siteid: '',
    site_date: '',
    lat: '',
    long: '',
    location: '',
  };
  location = {
    loc: '',
    lat: '',
    long: '',
    loc_date: '',

  };
  vehicle = [{
    lat: '',
    long: '',
    vregno: '',
    color: '0000FF',
    subType: 'marker'
  }];

  success = false;

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    private zone: NgZone,
    public mapService: MapService,
    public datepipe: DatePipe,
    private modalService: NgbModal) {
    this.common.handleModalSize('class', 'modal-lg', '1000');
    this.vid = this.common.params.vehicleId;
    this.vehicle[0].lat = this.common.params.lat;
    this.vehicle[0].long = this.common.params.long;
    this.vehicle[0].vregno = this.common.params.vregno
    this.getVehicleEvent();
  }

  ngOnInit() {
  }

  changeStateType() {
    console.log('changestate', this.changeStateType);
  }


  ngAfterViewInit(): void {
    console.log("here");


    this.mapService.mapIntialize("map", 18, 25, 75, true);
    setTimeout(() => {
      this.mapService.createMarkers(this.vehicle, false, true, ["vregno"]);
      this.mapService.zoomMap(9);
    }, 2000);

    setTimeout(this.autoSuggestion.bind(this, 'location'), 3000);


    console.log("here2");

  }

  autoSuggestion(elementId) {
    var options = {
      types: ['(cities)'],
      componentRestrictions: { country: "in" }
    };
    let ref = document.getElementById(elementId); //getElementsByTagName('input')[0];
    let autocomplete = new google.maps.places.Autocomplete(ref, options);
    google.maps.event.addListener(autocomplete, 'place_changed', this.updateLocation.bind(this, elementId, autocomplete));
  }

  updateLocation(elementId, autocomplete) {
    console.log('tets');
    let place = autocomplete.getPlace();
    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();
    place = autocomplete.getPlace().formatted_address.split(',')[0];
    this.setLocations(elementId, place, lat, lng);
  }

  setLocations(elementId, place, lat, lng) {
    console.log("elementId", elementId, "place", place, "lat", lat, "lng", lng);
    this.location.loc = place;
    this.location.lat = lat;
    this.location.long = lng;
    let detail = [{
      lat: this.location.lat,
      long: this.location.long,
      loc_name: this.location.loc,
      subType: 'marker',

    }];
    setTimeout(() => {
      this.mapService.clearAll();
      this.mapService.createMarkers(detail, false, true, ["loc_name"]);
      this.mapService.createMarkers(this.vehicle, false, true, ["vregno"]);
      //this.mapService.createMarkers(this.location, false, false);
      this.mapService.zoomMap(6);

    }, 2000);
  }


  // getDate(flag) {
  //   this.common.params = { ref_page: 'vehicle states' };
  //   const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
  //   activeModal.result.then(data => {
  //     if (data.date) {
  //       if (flag == 'site') {
  //         this.site.site_date = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
  //         console.log('site date ' + this.site.site_date);
  //       } else {
  //         this.location.loc_date = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
  //         console.log('loc_date ' + this.location.loc_date);
  //       }

  //     }

  //   });
  // }

  getVehicleEvent() {

    let today, start;
    today = new Date();
    this.endDate = this.common.dateFormatter(today);
    start = new Date(today.setDate(today.getDate() - 3))
    this.startDate = this.common.dateFormatter(start);
    let params = {
      vehicleId: this.vid,
      startDate: this.startDate,
      endDate: this.endDate,
      limit: 10
    };
    console.log('params: ', params);
    this.common.loading++;
    this.api.post('HaltOperations/getVehicleEvents', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res['data'])
        this.vehicleEvent = res['data'];
        if (res['success']) {
          console.log('vehicle', this.vehicle);
          setTimeout(() => {
            this.mapService.clearAll();
            this.mapService.createMarkers(this.vehicleEvent, false, true, ["halt_reason", "addtime"], (marker) => { this.selectHalt(marker); });
            this.mapService.createMarkers(this.vehicle, false, true, ["vregno"]);
            //this.mapService.createMarkers(this.location, false, false);
            this.mapService.zoomMap(6);

          }, 2500);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })


  }

  selectHalt(details) {
    this.halt.lat = details.lat;
    this.halt.long = details.long;
    this.halt.time = details.addtime;

  }

  getSite(details) {
    console.log('site on select', details);
    this.site.siteid = details.id;
    this.site.lat = details.lat;
    this.site.long = details.long;
    this.site.location = details.sd_loc_name;

    let detail = [{
      lat: details.lat,
      long: details.long,
      sd_loc_name: details.sd_loc_name,
      subType: 'marker',
      type: 'site'
    }];
    setTimeout(() => {
      this.mapService.clearAll();
      this.mapService.createMarkers(detail, false, true, ["sd_loc_name"]);
      this.mapService.createMarkers(this.vehicle, false, true, ["vregno"]);
      //this.mapService.createMarkers(this.location, false, false);
      this.mapService.zoomMap(6);

    }, 2000);
    console.log('site params', this.site);
  }

  saveVehicleState() {
    let params;
    console.log('changeCategory', this.changeCategory, this.stateType);
    if (this.stateType == "0") {
      this.common.showToast('please select state to continue !!')
    } else {
      if (this.changeCategory == 'halts') {
        params = {
          vid: this.vid,
          state_id: this.stateType,
          loc_name: this.halt.location,
          lat: this.halt.lat,
          long: this.halt.long,
          datetime: this.halt.time,
          remark: this.remark
        };

      } else if (this.changeCategory == 'sites') {
        this.site.site_date = this.common.dateFormatter(this.site.site_date);
        params = {
          vid: this.vid,
          state_id: this.stateType,
          siteid: this.site.siteid,
          loc_name: this.site.location,
          lat: this.site.lat,
          long: this.site.long,
          datetime: this.site.site_date,
          remark: this.remark
        };

      } else {
        this.location.loc_date = this.common.dateFormatter(this.location.loc_date);
        params = {
          vid: this.vid,
          state_id: this.stateType,
          loc_name: this.location.loc,
          lat: this.location.lat,
          long: this.location.long,
          datetime: this.location.loc_date,
          remark: this.remark
        };

      }

      console.log('params to save ', params)

      this.common.loading++;
      this.api.post('Vehicles/saveVehicleState', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res', res);
          if (res['data'][0].r_id > 0) {
            console.log(res['data'].r_id);
            this.common.showToast('Success!!');
          } else {
            this.common.showError(res['data'].r_msg);
          }
        }, err => {
          this.common.loading--;
          this.common.showError();
        })


    }
  }

  getCategory() {

    if (this.changeCategory == 'halts') {
      document.getElementById('foo').className = 'col-sm-6';

      this.mapService.clearAll();
      setTimeout(() => {
        this.mapService.createMarkers(this.vehicleEvent, false, true, ["halt_reason", "addtime"]);
        this.mapService.createMarkers(this.vehicle, false, true, ["vregno"]);
        //this.mapService.createMarkers(this.location, false, false);
        this.mapService.zoomMap(9);

      }, 2500);
    } else {
      document.getElementById('foo').className = 'col-sm-12';

      this.mapService.clearAll();
      this.mapService.mapIntialize("map", 18, 25, 75, true);
      setTimeout(() => {
        this.mapService.createMarkers(this.vehicle, false, true, ["vregno"]);
        this.mapService.zoomMap(9);
      }, 2000);



    }
    console.log('getCategory call:', this.changeCategory);
  }

  checkVehicle() {
    let params;
    if (this.changeCategory == 'halts') {
      params = {
        vehicleId: this.vid,
        time: this.common.dateFormatter(this.halt.time),
        lat: this.halt.lat,
        long: this.halt.long
      };

    } else if (this.changeCategory == 'sites') {
      params = {
        vehicleId: this.vid,
        time: this.site.site_date,
        lat: this.site.lat,
        long: this.site.long
      };

    } else {
      params = {
        vehicleId: this.vid,
        time: this.location.loc_date,
        lat: this.location.lat,
        long: this.location.long
      };
    }
    console.log('params', params);
    this.common.loading++;
    this.api.post('Vehicles/chechVehLocationWrtTime', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'] == 1) {
          this.saveVehicleState();
        } else {
          this.common.showError('vehicle is not exist in this location.. choose correct location to continue !!');
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  closeModal() {
    this.activeModal.close();
  }




}
