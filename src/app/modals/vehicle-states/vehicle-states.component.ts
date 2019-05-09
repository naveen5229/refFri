import { Component, OnInit } from '@angular/core';
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
    siteid: 0,
    site_date: '',
    lat: '',
    long: '',
    location: ''
  };
  location = {
    loc: '',
    lat: '',
    long: '',
    loc_date: ''
  };
  // map: any;
  // @ViewChild('map') mapElement: ElementRef;
  // location = {
  //   lat: 26.9124336,
  //   lng: 75.78727090000007,
  //   name: '',
  //   time: ''
  // };

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    public mapService: MapService,
    public datepipe: DatePipe,
    private modalService: NgbModal) {
    this.vid = this.common.params.vehicleId;
    this.getVehicleEvent();
  }

  ngOnInit() {
  }

  changeStateType() {
    console.log('changestate', this.changeStateType);
  }


  ngAfterViewInit(): void {
    console.log("here");

    setTimeout(this.autoSuggestion.bind(this, 'location'), 3000);

    // setTimeout(() => {
    //   // this.mapService.mapIntialize("map");
    //   this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => this.mapService.zoomAt({ lat: lat, lng: lng }));
    // }, 2000); 

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
      }, err => {
        this.common.loading--;
        this.common.showError();
      })


  }

  selectHalt(details) {
    this.halt.lat = details.lat;
    this.halt.long = details.long;
    this.halt.time = details.addtime;
    console.log('halt select', details);
    console.log('halt details', this.halt);
  }

  getSite(details) {
    console.log('site on select', details);
    this.site.siteid = details.id;
    this.site.lat = details.lat;
    this.site.long = details.long;
    this.site.location = details.sd_loc_name;
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
          if (res['data'].r_id > 0) {
            console.log(res['data'].r_id);
            this.common.showToast('Success!!');
          } else {
            this.common.showToast(res['data'].r_msg);
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
    } else {
      document.getElementById('foo').className = 'col-sm-12';
    }
    console.log('getCategory call:', this.changeCategory);
  }

  closeModal() {
    this.activeModal.close();
  }
  saveDetails() {

  }


}
