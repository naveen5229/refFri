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
  foId = null;
  routeData = {

    routeName: null,
    startSiteId: null,
    endSiteId: null,

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
    this.foId = this.common.params.foData.id;
    console.log("FOData:", this.foId);
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
        this.mapService.zoomAt({ lat: lat, lng: lng }, 12);
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
          this.routeData.startlat = evt.latLng.lat();
          this.routeData.startlong = evt.latLng.lng();
          if (this.mark[0]) {
            this.mark[0].setMap(null);
          }
          this.mark[0] = this.mapService.createMarkers(this.routeData.latlong, false, false)[0];
        }

        if (this.ismap2 && !this.isstart) {
          console.log("latlong", evt.latLng.lat(), evt.latLng.lng());
          this.routeData.latlong2 = [{
            lat: evt.latLng.lat(),
            long: evt.latLng.lng(),
            color: 'FF0000',
            subType: 'marker'
          }];
          this.routeData.endlat1 = evt.latLng.lat();
          this.routeData.endlong2 = evt.latLng.lng();
          if (this.mark[1]) {
            this.mark[1].setMap(null);
          }
          this.mark[1] = this.mapService.createMarkers(this.routeData.latlong2, false, false)[0];
        }
      });

    }, 1000);
  }

  add() {
    const params = {
      foid: this.foId,
      name: this.routeData.routeName,
      startLat: this.routeData.startlat,
      startLong: this.routeData.startlong,
      endLat: this.routeData.endlat1,
      endLong: this.routeData.endlong2,
      startSiteId: this.routeData.startSiteId,
      endSiteId: this.routeData.endSiteId,
      duration: this.routeData.duration,
      kms: this.routeData.kms,
      startName: this.routeData.placeName,
      endName: this.routeData.placeName2

    };

    console.log("Data :", params);
    console.log("Data", this.routeData);

    this.common.loading++;
    this.api.post('ViaRoutes/insert', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.common.showToast(res['msg']);
        this.closeModal();
      }, err => {
        this.common.loading--;
        console.log(err);
      });

  }


  closeModal() {
    this.activeModal.close();
  }

  selectSite(site) {
    console.log("Site Data", site);
    this.routeData.startSiteId = site.id;
    this.routeData.startlat = site.lat;
    this.routeData.startlong = site.long;
    this.routeData.placeName = site.name;
  }
  selectSite2(site) {
    this.routeData.endSiteId = site.id;
    this.routeData.endlat1 = site.lat;
    this.routeData.endlong2 = site.long;
    this.routeData.placeName2 = site.name;
  }

  report(type) {
    if (type == "site") {
      this.routeData.placeName = null;
      this.routeData.lat = null;
      this.routeData.long = null;
      this.ismap = false;
      this.mark[0] && this.mark[0].setMap(null);
    }
    else if (type == "map") {
      this.routeData.startSiteId = null;
      this.routeData.startlat = null;
      this.routeData.startlong = null;
      this.ismap = true;
      this.mark[0] && this.mark[0].setMap(null);
    }
  }

  report2(type) {
    if (type == "site2") {
      this.routeData.placeName2 = null;
      this.routeData.lat1 = null;
      this.routeData.long1 = null;
      this.ismap2 = false;
      this.mark[1] && this.mark[1].setMap(null);
    }
    else if (type == "map2") {
      this.routeData.endSiteId = null;
      this.routeData.endlat1 = null;
      this.routeData.endlong2 = null;
      this.ismap2 = true;
      this.mark[1] && this.mark[1].setMap(null);
    }
  }
}
