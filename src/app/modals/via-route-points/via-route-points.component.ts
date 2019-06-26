import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'via-route-points',
  templateUrl: './via-route-points.component.html',
  styleUrls: ['./via-route-points.component.scss']
})
export class ViaRoutePointsComponent implements OnInit {
  latlong = [{ lat: null, long: null, color: null, subType: null }];
  locType = "site";
  loc = '';
  siteNamee = '';
  latilong = null;
  tableData = [];
  lat = null;
  mapName = null;
  duration = null;
  kms = null;
  long = null;
  doc;
  selected = 0;
  siteId;
  routeId = null;
  firstCoordinates;
  routeData = {
    siteId: null,
    lat: null,
    long: null,
    siteName: null
  };
  mark = null;
  viaMark = [];
  constructor(private activeModal: NgbActiveModal,
    public mapService: MapService,
    public common: CommonService,
    public api: ApiService) {
    this.doc = this.common.params.doc;
    this.routeId = this.doc._id;
    this.firstCoordinates = [{
      lat: this.doc._start_lat,
      lng: this.doc._start_long,
      color: '00FF00',
      subType: 'marker'
    },
    {
      lat: this.doc._end_lat,
      lng: this.doc._end_long,
      color: 'FF0000',
      subType: 'marker'
    }];
    this.viewTable();
    console.log("RouteID-->", this.routeId);
    setTimeout(() => {
      this.mapService.autoSuggestion("loc", (place, lat, lng) => {
        console.log('Lat: ', lat);
        console.log('Lng: ', lng);
        console.log('Place: ', place);
        this.loc = place;
        this.mapService.zoomAt(this.mapService.createLatLng(lat, lng), 11);
      });

    }, 2000)
  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(0);
    this.mapService.zoomMap(5);
    this.mapService.map.setOptions({ draggableCursor: 'cursor' });

    setTimeout(() => {
      this.mapService.createMarkers(this.firstCoordinates);
      this.mapService.addListerner(this.mapService.map, 'click', evt => {
        if (this.selected == 1) {
          this.createMarkers(evt.latLng.lat(), evt.latLng.lng(), 'map');
          this.latilong = evt.latLng.lat().toFixed(5) + ','+ evt.latLng.lng().toFixed(5);
        }

      });
    }, 1000);


  }
  createMarkers(lat, long, type) {

    console.log("latlong", lat, long);
    this.latlong = [{
      lat: lat,
      long: long,
      color: '0000FF',
      subType: 'marker'
    }];
    if (this.mark != null) {
      this.mark[0].setMap(null);
    }
    this.mark = this.mapService.createMarkers(this.latlong, false, false);
  }
  setRadio(type) {
    if (type == 1) {
      this.selected = 1;
      this.reset();
    }
    else {
      this.selected = 0;
      this.mark[0].setMap(null);
      this.reset();
    }
  }
  reset() {
    this.latlong = null;
    this.siteId = null;
    this.routeData.siteId = null;
    this.routeData.lat = null;
    this.routeData.long = null;
    console.log("Value are Null", this.latlong);
  }
  clickDelete(name, i) {
    if (confirm("Are you sure to delete ->" + name)) {
      this.deleteRoutes(i);
    }
  }
  viewTable() {
    this.common.loading++;
    let rowCoordinates = [];
    this.api.get('ViaRoutes/viewvia?routeId=' + this.routeId)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        let data = res['data'];
        this.tableData = data;
        this.mapService.resetPolyPath();
        this.viaMark.forEach(mark => {
          mark.setMap(null);
        });
        this.viaMark = [];

        for (let i = 0; i < this.tableData.length; i++) {
          rowCoordinates.push({
            lat: this.tableData[i]._lat,
            lng: this.tableData[i]._long,
          });
        }
        let polypath = [];
        if (this.tableData.length)
          this.viaMark = this.mapService.createMarkers(rowCoordinates);
        polypath.push({ lat: this.doc._start_lat, lng: this.doc._start_long });
        for (let i = 0; i < this.tableData.length; i++) {
          rowCoordinates.push({
            lat: this.tableData[i]._lat,
            lng: this.tableData[i]._long,
          });
          polypath.push({ lat: this.tableData[i]._lat, lng: this.tableData[i]._long });
        }
        polypath.push({ lat: this.doc._end_lat, lng: this.doc._end_long });
        console.log("Polypath--->", polypath);
        let polygonOption = {
          strokeWeight: 1, 
        };
        for (let i = 0; i < polypath.length; i++) {
          this.mapService.createPolyPathManual(this.mapService.createLatLng(polypath[i].lat, polypath[i].lng), polygonOption);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

  deleteRoutes(i) {
    let params = {
      routeId: this.routeId,
      id: this.tableData[i]._id
    }
    console.log(params);
    this.common.loading++;
    this.api.post('ViaRoutes/deletevia', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.viewTable();
        if (res['success']) {
          this.common.showToast("Success");
        }
        else {
          this.common.showToast(res['msg']);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }


  selectSite(site) {
    console.log("Site Data", site);

    this.routeData.siteId = site.id;
    this.routeData.lat = site.lat;
    this.routeData.long = site.long;
    this.routeData.siteName = site.name;
    this.createMarkers(this.routeData.lat, this.routeData.long, 'site');
  }
  sendRoute() {
    if (this.selected == 1) {
      this.siteNamee = this.mapName,
        this.lat = this.latlong && this.latlong[0].lat,
        this.long = this.latlong && this.latlong[0].long,
        this.siteId = null
    }
    if (this.selected == 0) {
      this.siteNamee = this.routeData.siteName,
        this.lat = this.routeData.lat,
        this.long = this.routeData.long,
        this.siteId = this.routeData.siteId
    }
   
    let params = {

      routeId: this.routeId,
      lat: this.lat,
      long: this.long,
      duration: this.duration,
      kms: this.kms,
      siteId: this.siteId,
      name: this.siteNamee
    };
    if (this.siteNamee == null || this.siteNamee.length > 100) {
      this.common.showToast("Please Enter Location");
      return;
    }
    if (this.duration < 1 || this.duration > 800){
      this.common.showToast("Please Enter Duration With Range 0 To 800");
      return;
    }
    if (this.kms < 1 || this.kms > 10000){
      this.common.showToast("Please Enter kms With Rane 0 To 10000");
      return;
    }
   
    else {
      console.log(params);
      this.common.loading++;
      this.api.post('ViaRoutes/insertvia', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res', res['data']);
          this.mark && this.mark[0].setMap(null);
          this.locType = "site";
          this.viewTable();
          this.mapName = null;
          this.duration = null;
          this.kms = null;
          if (res['data'][0]['y_id'] <= 0) {
            this.common.showToast(res['data'][0]['y_msg']);
          }
          else {
            this.common.showToast("Success");
            console.log("SiteLatLong-->", this.routeData.lat, this.routeData.long);

          }
        }, err => {
          this.common.loading--;
          this.common.showError();
        })

    }
  }
}