import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { longStackSupport } from 'q';
import { NullTemplateVisitor } from '@angular/compiler';
import { position } from '@progress/kendo-popup-common';


@Component({
  selector: 'add-pump',
  templateUrl: './add-pump.component.html',
  styleUrls: ['./add-pump.component.scss', '../../pages/pages.component.css']
})
export class AddPumpComponent implements OnInit {
  fuel_company = 0;
  location = '';
  name = '';
  siteId = null;
  pumpname = null;
  final = [];
  values;
  position = null;
  mark = null;
  para1 = null;
  para2 = null;
  para3 = null;
  title = '';
  latlong;

  marker = [];
  infoWindow = null;
  insideInfo = null;
  typeIds = [];
  typeId = null;
  constructor(
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private mapService: MapService) {
    this.title = this.common.params.title;
    this.common.handleModalHeightWidth('class', 'modal-lg', '1200', '1200');
    setTimeout(() => {
      console.log('--------------location:', "location");
      this.mapService.autoSuggestion("location", (place, lat, lng) => {
        console.log('Lat: ', lat);
        console.log('Lng: ', lng);
        console.log('Place: ', place);
        console.log("position", this.position);
        this.location = place;
        this.getmapData(lat, lng);
      });
    }, 2000)
  }

  ngOnInit() {
    this.getTypeIds();
  }


  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    setTimeout(() => {
      this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => {
        this.mapService.zoomAt({ lat: lat, lng: lng });
        this.getmapData(lat, lng);
      });
      this.mapService.addListerner(this.mapService.map, 'click', evt => {
        console.log("latlong", evt.latLng.lat(), evt.latLng.lng());
        this.latlong = [{
          lat: evt.latLng.lat(),
          long: evt.latLng.lng(),
          color: 'FF0000',
          subType: 'marker'
        }];
        this.position = evt.latLng.lat() + "," + evt.latLng.lng();
        if (this.mark != null) {
          this.mark[0].setMap(null);
          this.mark = null;
        }
        this.pumpname = null;
        this.mark = this.mapService.createMarkers(this.latlong, false, true);
        console.log("latlong", this.latlong);
      });
    }, 1000);
    // this.mapService.autoSuggestion("siteLoc", (place, lat, lng) => { this.siteLoc = place; this.siteLocLatLng = { lat: lat, lng: lng } });
  }

  gotoSingle() {
    console.log("position1", this.position);
    this.final = this.position.split(",");
    console.log("array", this.final[0]);
    this.latlong = [{
      lat: this.final[0],
      long: this.final[1],
      color: 'FF0000',
      subType: 'marker'
    }];
    if (this.mark != null) {
      this.mark[0].setMap(null);
      this.mark = null;
    }
    this.pumpname = null;
    this.mark = this.mapService.createMarkers(this.latlong, false, true);

  }


  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  getmapData(lat, lng) {
    const params = "lat=" + lat +
      "&long=" + lng;
    this.common.loading++;
    this.api.get('fuel/getAllSiteWrtFuelStation?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("result");
        console.log(res['data']);
        this.marker = res['data'];
        this.mapService.clearAll();
        this.mapService.createMarkers(this.marker);
        console.log("marker", this.marker);
        let markerIndex = 0
        for (const marker of this.mapService.markers) {
          let event = this.marker[markerIndex];
          this.mapService.addListerner(marker, 'click', () => this.setPetrolInfo(event));
          this.mapService.addListerner(marker, 'mouseover', () => this.setEventInfo(event));
          this.mapService.addListerner(marker, 'mouseout', () => this.unsetEventInfo());
          markerIndex++;
        }
        // for (const marker in this.mapService.markers) {
        //   if (this.mapService.markers.hasOwnProperty(marker)) {
        //     const event = this.mapService.markers[marker];
        //     this.mapService.addListerner(marker, 'click', () => this.setPetrolInfo(event));
        //   this.mapService.addListerner(marker, 'mouseover', () => this.setEventInfo(event));
        //   this.mapService.addListerner(marker, 'mouseout', () => this.unsetEventInfo());
        //   }
        // }
      }, err => {
        this.common.showError("Error occurred");
        this.common.loading--;
        console.log(err);
      });

  }

  setPetrolInfo(event) {
    console.log("Event Data:", event);
    this.siteId = event.id;
    this.pumpname = event.name;
    console.log("pumpname and siteid", this.pumpname, this.siteId);
  }

  setEventInfo(event) {
    this.insideInfo = new Date().getTime();
    if (this.infoWindow) {
      this.infoWindow.close();
    }
    this.infoWindow = this.mapService.createInfoWindow();
    this.infoWindow.opened = false;
    this.infoWindow.setContent(`
    <p>Site Id :${event.id}</p>
    <p>Pump Name :${event.name}</p>`);
    // this.infoWindow.setContent("Flicker Test");
    this.infoWindow.setPosition(this.mapService.createLatLng(event.lat, event.long));
    this.infoWindow.open(this.mapService.map);
  }

  async unsetEventInfo() {
    let diff = new Date().getTime() - this.insideInfo;
    if (diff > 200) {
      this.infoWindow.close();
      this.infoWindow.opened = false;
    }
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  selectCompany(id) {
    this.fuel_company = parseInt(id);
  }

  submitPumpData(){
    if (this.pumpname == null) {
      this.para1 = this.latlong[0].lat;
      this.para2 = this.latlong[0].long;
      console.log("latlong", this.latlong[0].lat);
      this.para3 = null;
    }
    else {
      this.para3 = this.siteId;
      this.para1 = null;
      this.para2 = null;
    }
    let params = {
      petrolPumplocation: this.location,
      petrolPumpName: this.name,
      siteId: this.para3,
      lat: this.para1,
      long: this.para2,
      fuelCompany: this.fuel_company
    };
    console.log("params", params);
    this.common.loading++;
    this.api.post('FuelDetails/addPetrolPump', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("result");
        console.log(res);
        this.common.showToast("Petrol Pump Added Successfully");
        this.activeModal.close();
      }, err => {
        this.common.showError("Error occurred");
        this.common.loading--;
        console.log(err);
      });
  }

  getTypeIds() {
    this.api.post("SiteFencing/getSiteTypes", {})
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.typeIds = res['data'];
        this.typeIds.push({ id: -1, description: "All" });
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }



  loadMarkers() {
    let boundBox = this.mapService.getMapBounds();
    let bounds = {
      'lat1': boundBox.lat1,
      'lng1': boundBox.lng1,
      'lat2': boundBox.lat2,
      'lng2': boundBox.lng2,
      'typeId': this.typeId
    };
    this.api.post("VehicleStatusChange/getSiteAndSubSite", bounds)
      .subscribe(res => {
        let data = res['data'];
        console.log('Res: ', res['data']);
        // this.mapService.clearAll();
        this.mapService.createMarkers(data, false, true, ["id", "name"]);
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }


}
