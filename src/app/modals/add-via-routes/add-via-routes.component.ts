import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'add-via-routes',
  templateUrl: './add-via-routes.component.html',
  styleUrls: ['./add-via-routes.component.scss']
})
export class AddViaRoutesComponent implements OnInit {
  location = '';
  foData = null;
  routeData = {

    routeName: null,
    siteId: null,
    startlat: null,
    startlong: null,
    endlat1: null,
    endlong2: null,
    latlong: null,
    latlong2: null,

    lat: null,
    long: null,
    lat1: null,
    long1: null,
    duration: null,
    kms: null,
    placeName: null,
    placeName2: null,
  };

  selectOption = 'site';
  selectOption2 = 'site2';
  mark = [];
  ismap = false;
  ismap2 = false;
  isstart = false;

  constructor(private mapService: MapService,
    private api: ApiService,
    private activeModal: NgbActiveModal,
    private common: CommonService,
    public dateService: DateService) {
    this.foData = this.common.params.foData;
    console.log("FOData:", this.foData);
    this.common.handleModalSize('class', 'modal-lg', '1250');
    setTimeout(() => {
      console.log('--------------location:', "location");
      this.mapService.autoSuggestion("location", (place, lat, lng) => {
        console.log('Lat: ', lat);
        console.log('Lng: ', lng);
        console.log('Place: ', place);
        console.log("position", this.routeData.latlong);
        this.location = place;
      });

    }, 2000)

  }

  ngOnInit() {
  }
  ngAfterViewInit() {

    this.mapService.mapIntialize("map");

    setTimeout(() => {
      this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => {
        this.mapService.clearAll();
        this.mapService.zoomAt({ lat: lat, lng: lng });
      });
      this.mapService.addListerner(this.mapService.map, 'click', evt => {
        if (this.ismap && this.isstart) {
          console.log("latlong", evt.latLng.lat(), evt.latLng.lng());
          this.routeData.latlong = [{
            lat: evt.latLng.lat(),
            long: evt.latLng.lng(),
            color: '00FF00',
            subType: 'marker'
          }];
          this.routeData.lat = evt.latLng.lat();
          this.routeData.long = evt.latLng.lng();
          if (this.mark[0]) {
            this.mark[0].setMap(null);
          }
          this.mark[0] = this.mapService.createMarkers(this.routeData.latlong, false, false)[0];
        }

        if (this.ismap && !this.isstart) {
          console.log("latlong", evt.latLng.lat(), evt.latLng.lng());
          this.routeData.latlong2 = [{
            lat: evt.latLng.lat(),
            long: evt.latLng.lng(),
            color: 'FF0000',
            subType: 'marker'
          }];
          this.routeData.lat1 = evt.latLng.lat();
          this.routeData.long1 = evt.latLng.lng();
          if (this.mark[1]) {
            this.mark[1].setMap(null);
          }
          this.mark[1] = this.mapService.createMarkers(this.routeData.latlong2, false, false)[0];
        }
      });

    }, 1000);
  }

  add() {

    console.log("Data", this.routeData);
  }


  closeModal() {
    this.activeModal.close();
  }

  selectSite(site) {
    console.log("Site Data", site);

    this.routeData.siteId = site.id;
    this.routeData.startlat = site.lat;
    this.routeData.startlong = site.long;
  }
  selectSite2(site) {
    this.routeData.siteId = site.id;
    this.routeData.endlat1 = site.lat;
    this.routeData.endlong2 = site.long;
  }

  report(type) {
    console.log("test", type);
    this.selectOption = type;
    if (this.selectOption == "site") {
      this.routeData.placeName = null;
      this.routeData.lat = null;
      this.routeData.long = null;
      this.mapService.clearAll();
      this.ismap = false;
    }
    else if (this.selectOption == "map") {
      this.routeData.siteId = null;
      this.routeData.lat = null;
      this.routeData.long = null;
      this.ismap = true;
    }
  }

  report2(type) {
    this.selectOption2 = type;
    if (this.selectOption2 == "site2") {
      this.routeData.placeName2 = null;
      this.routeData.lat = null;
      this.routeData.long = null;
      this.mapService.clearAll();
      this.ismap2 = false;
    }
    else if (this.selectOption2 == "map2") {
      this.routeData.siteId = null;
      this.routeData.endlat1 = null;
      this.routeData.endlong2 = null;
      this.ismap2 = true;
    }
  }



}
