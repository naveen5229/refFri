import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'police-station',
  templateUrl: './police-station.component.html',
  styleUrls: ['./police-station.component.scss', '../../pages/pages.component.css']
})
export class PoliceStationComponent implements OnInit {
  PoliceStation = [];
  // PoliceStation;
  lat;
  long;
  type = null;
  name;
  Vicinity;
  phone;
  location;
  data;
  dateVal = []

  resData = [];


  constructor(
    public mapService: MapService,
    public api: ApiService,
    private activeModal: NgbActiveModal,
    public common: CommonService) {
    this.common.handleModalSize('class', 'modal-lg', '1000');
    this.lat = this.common.params.lat;
    this.long = this.common.params.long;
    console.log("------------", this.lat);
    this.getPoliceStation();
    this.location = [{
      lat: this.common.params.lat,
      long: this.common.params.long,
      color: 'FF0000',
      subType: 'marker'
    }];


  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("police-station-map", 18, 25, 75, true, true);
  }

  ngOnDestroy() { }

  getPoliceStation() {
    let params = "lat=" + this.lat +
      "&lng=" + this.long +
      "&type=" + this.type;

    console.log('params: ', params);
    this.common.loading++;
    this.api.get('Location/getNearBy?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res['data'])
        this.dateVal = res['data'];
        let details = [];
        Object.keys(this.dateVal).map(key => {
          let detail = {
            id: key,
            lat: this.dateVal[key].lat,
            long: this.dateVal[key].long,
            name: this.dateVal[key].name,
            Vicinity: this.dateVal[key].Vicinity,
            phone: this.dateVal[key].phone,
            color: 'ADFF2F',
          };

          details.push(detail);
        });

        console.log('details', details);
        if (res['success'])
          this.common.showToast('Success');
        this.PoliceStation = details;

        console.log("--------------", this.PoliceStation);

        setTimeout(() => {
          this.mapService.clearAll();
          this.mapService.createMarkers(this.PoliceStation, false, true, ["Vicinity", "phone"]);
          this.mapService.createMarkers(this.location, false, true);
          this.mapService.zoomMap(10.5);
        }, 2500);

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  openSmartTool(i, value) {
    this.PoliceStation.forEach(vEvent => {
      if (vEvent != value)
        vEvent.isOpen = false;
    });
    value.isOpen = !value.isOpen;
    this.zoomFunctionality(i, value);
  }

  zoomFunctionality(i, value) {
    console.log("value", value);
    let latLng = this.mapService.getLatLngValue(value);
    let googleLatLng = this.mapService.createLatLng(latLng.lat, latLng.lng);
    console.log("latlngggg", googleLatLng);
    this.mapService.zoomAt(googleLatLng);
  }

  dismiss() {
    this.activeModal.close();
  }
}
