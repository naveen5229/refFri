import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
declare let google: any;

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { PdfService } from '../../services/pdf/pdf.service';

@AutoUnsubscribe()
@Component({
  selector: 'police-station',
  templateUrl: './police-station.component.html',
  styleUrls: ['./police-station.component.scss', '../../pages/pages.component.css']
})
export class PoliceStationComponent implements OnInit {
  PoliceStation = [];
  vehicles = [];
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
  policeStationMarkers = [];
  vehiclesMarkers = [];
  actionType = "police";
  constructor(
    public mapService: MapService,
    public api: ApiService,
    private activeModal: NgbActiveModal, private pdf: PdfService,
    public common: CommonService) {
    this.common.handleModalSize('class', 'modal-lg', '1000');
    this.lat = this.common.params.lat;
    this.long = this.common.params.long;
    this.name = this.common.params.name || '';
    this.vehicles = this.common.params.vehicles || [];

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

  ngOnDestroy() {
    this.mapService.events.next({ type: 'closed' });
  }

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
          this.policeStationMarkers = this.mapService.createMarkers(this.PoliceStation, false, true, ["Vicinity", "phone"]);
          this.vehiclesMarkers = this.mapService.createMarkers(this.vehicles, false, true, ["name", "distance"]);
          this.vehiclesMarkers.map(marker => marker && marker.setMap(null))
          this.mapService.createMarkers(this.location, false, true);
          this.mapService.zoomMap(10.5);
          console.log('this.location', this.location);
          let lat = parseFloat(this.location[0].lat);
          let lng = parseFloat(this.location[0].long);
          this.mapService.map.setCenter({ lat, lng });
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

  handleMarkers() {
    if (this.actionType == 'police') {
      this.policeStationMarkers.map(marker => marker && marker.setMap(this.mapService.map));
      this.vehiclesMarkers.map(marker => marker && marker.setMap(null));
    } else if (this.actionType == 'vehicle') {
      this.policeStationMarkers.map(marker => marker && marker.setMap(null));
      this.vehiclesMarkers.map(marker => marker && marker.setMap(this.mapService.map));
    }
  }

  toggleBounceMF(id, markers, evtype = 1) {
    console.log("id=", id);
    if (markers[id]) {
      if (markers[id].getAnimation() == null && evtype == 1) {
        markers[id].setAnimation(google.maps.Animation.BOUNCE);
      } else if (evtype == 2 && markers[id].getAnimation() != null) {
        markers[id].setAnimation(null);
      }
    }
  }

  downloadPDF() {
    let details = [
      ['Vehicle: ' + this.name]
    ];
    if (this.actionType == 'police') {
      this.pdf.jrxTablesPDF(['near-police'], this.name, details);
    } else {
      this.pdf.jrxTablesPDF(['near-vehicles'], this.name, details);
    }
  }

  downloadExcel() {
    if (this.actionType == 'police') {
      this.common.getCSVFromTableId('near-police', '', this.name);
    } else {
      this.common.getCSVFromTableId('near-vehicles', '', this.name);
    }
  }
}
