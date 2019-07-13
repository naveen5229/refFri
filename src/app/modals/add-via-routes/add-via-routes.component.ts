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
    // this.foId = this.common.params.foData;
    // console.log("FOData:", this.foId);
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
      this.mapService.zoomAt({ lat: 26.9100, lng: 75.7900 }, 12);

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
          this.createnewMarker(evt.latLng.lat(), evt.latLng.lng(), 0);
        }

        if (this.ismap2 && !this.isstart) {
          this.createnewMarker(evt.latLng.lat(), evt.latLng.lng(), 1);
        }
      });

    }, 1000);
  }

  createnewMarker(lat, long, index) {
    let latlong;
    let color = "FF0000";
    if (index == 0) {
      color = "00FF00";
      this.routeData.startlat = lat;
      this.routeData.startlong = long;
      lat = (Math.round((lat) * 100) / 100).toFixed(4);
      long = (Math.round((long) * 100) / 100).toFixed(4);
      this.routeData.latlong = lat + "," + long;

    } else {
      this.routeData.endlat1 = lat;
      this.routeData.endlong2 = long;
      lat = (Math.round((lat) * 100) / 100).toFixed(4);
      long = (Math.round((long) * 100) / 100).toFixed(4);
      this.routeData.latlong2 = lat + "," + long;

    }

    latlong = [{
      lat: lat,
      long: long,
      color: color,
      subType: 'marker'
    }];
    if (this.mark[index]) {
      this.mark[index].setMap(null);
    }
    this.mark[index] = this.mapService.createMarkers(latlong, false, false)[0];
    if (this.mark[0] && this.mark[1])
      this.mapService.resetBounds();
  }

  add() {
    const params = {
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

    this.common.loading++;
    this.api.post('ViaRoutes/insert', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("test", res['data'][0].y_msg);
        if (res['data'][0].y_id <= 0) {
          this.common.showError(res['data'][0].y_msg);
          return;

        }
        else {
          this.common.showToast(res['data'][0].y_msg);
          this.activeModal.close({ response: res });
        }
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
    this.createnewMarker(site.lat, site.long, 0);
  }
  selectSite2(site) {
    this.routeData.endSiteId = site.id;
    this.routeData.endlat1 = site.lat;
    this.routeData.endlong2 = site.long;
    this.routeData.placeName2 = site.name;
    this.createnewMarker(site.lat, site.long, 1);
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
