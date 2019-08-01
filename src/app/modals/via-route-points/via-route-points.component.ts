import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { LocationSelectionComponent } from '../location-selection/location-selection.component';

@Component({
  selector: 'via-route-points',
  templateUrl: './via-route-points.component.html',
  styleUrls: ['./via-route-points.component.scss']
})
export class ViaRoutePointsComponent implements OnInit {
  latlong = [{ lat: null, long: null, color: null, subType: null }];
  locType = "site";
  siteLoc = null;
  loc = '';
  editId = null;
  siteName = null;
  editMapId = null;
  editSiteId = null;
  rowId = null;
  siteNamee = '';
  latilong = null;
  editRowId = null;
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
  order = null;
  searchString = '';
  keepGoing = true;
  constructor(private activeModal: NgbActiveModal,
    public mapService: MapService,
    public common: CommonService,
    public api: ApiService,
    public modalService: NgbModal) {
    this.doc = this.common.params.doc;
    this.routeId = this.doc._id;
    this.firstCoordinates = [{
      lat: this.doc._start_lat,
      lng: this.doc._start_long,
      title: this.doc.start_name,
      color: '00FF00',
      subType: 'marker'
    },
    {
      lat: this.doc._end_lat,
      lng: this.doc._end_long,
      title: this.doc.end_name,
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

  selectLocation(place) {
    console.log("palce", place);
    this.siteId = place.id;
    this.routeData.lat = place.lat;
    this.routeData.long = place.long;
    this.siteNamee = place.location || place.name;
    this.createMarkers(this.routeData.lat, this.routeData.long, 'map');

  }
  onChangeAuto(search) {
    this.searchString = search;
    console.log('..........', search);
  }

  takeAction(res) {
    setTimeout(() => {
      console.log("Here", this.keepGoing, this.searchString.length, this.searchString);

      if (this.keepGoing && this.searchString.length) {
        this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

        const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        this.keepGoing = false;
        activeModal.result.then(res => {
          if (res != null) {
            console.log('response----', res, res.location, res.id);
            this.keepGoing = true;
            if (res.location.lat) {
              this.siteNamee = res.location.name;

              (<HTMLInputElement>document.getElementById('mapValue')).value = this.siteNamee;
              this.lat = res.location.lat;
              this.long = res.location.lng;
              this.siteId = res.id;
              this.keepGoing = true;
            }
          }
        })

      }
    }, 1000);

  }

  reset() {
    this.latlong = null;
    this.siteId = null;
    this.siteLoc = null;
    this.lat = null;
    this.long = null;
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
            title: this.tableData[i].name,
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
      name: this.siteNamee,
      viaOrder: this.order,
      rowId: this.rowId
    };
    if (this.siteNamee == null || this.siteNamee.length > 100) {
      this.common.showToast("Please Enter Location");
      return;
    }

    else {
      console.log("sendroute params-->", params);
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
            this.reset()
            this.cancelEdit();
            console.log("SiteLatLong-->", this.routeData.lat, this.routeData.long);

          }
        }, err => {
          this.common.loading--;
          this.common.showError();
        })

    }
  }

  updateOrder(data) {
    let params = {
      data: JSON.stringify(data),
    }
    console.log(params);
    this.common.loading++;
    this.api.post('ViaRoutes/updateViaRouteOrder', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.viewTable();
        }
        else {
          this.common.showError(res['data'][0].y_msg)
        }

      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }
  editRow(i) {
    this.editId = -1;
    if (this.tableData[i]._site_id > 0) {
      this.locType = "site";
      // this.siteName = this.tableData[i].name;
      if (this.selected == 0)
        document.getElementsByName("suggestion")[0]['value'] = '';
      this.siteLoc = { name: this.tableData[i]._name, sd_loc_name: this.tableData[i]._sd_loc_name };
      this.selected = 0;
      this.kms = this.tableData[i].kms;
      this.order = this.tableData[i].via_order;
      // document.getElementById("site")['value'] = this.tableData[i]._name;
      this.routeData.siteId = this.tableData[i]._site_id;
      this.routeData.lat = this.tableData[i]._lat;
      this.routeData.long = this.tableData[i]._long;
      this.routeData.siteName = this.tableData[i]._name;
      console.log("route data--->", this.routeData);
      this.rowId = this.tableData[i]._id;
      console.log("SiteName-->", this.siteName);
      console.log("KMS-->", this.kms);
    }
    else {
      this.locType = "map";
      this.selected = 1;
      // this.mapName = this.tableData[i].name;
      this.kms = this.tableData[i].kms;
      this.order = this.tableData[i].via_order;
      this.latilong = this.tableData[i]._lat + ',' + this.tableData[i]._long;
      this.mapName = this.tableData[i]._name;
      // document.getElementById("map")['value'] = this.tableData[i]._name;
      this.siteId = this.tableData[i]._site_id;
      this.lat = this.tableData[i]._lat;
      this.long = this.tableData[i]._long;
      this.siteNamee = this.tableData[i]._name;
      this.rowId = this.tableData[i]._id;
      console.log("MapName-->", this.mapName);
      console.log("KMS-->", this.kms);
    }

  }
  editTableRow() {

  }
  cancelEdit() {
    this.editId = null;
    this.kms = null;
    this.order = null;
    this.mapName = null;
    this.siteName = null;
    this.rowId = null;
    this.siteLoc = null;
    this.latilong = null;
    this.lat = null;
    this.long = null;
    this.siteId = null;
    this.siteNamee = null;
    if (this.selected == 0)
      document.getElementById("site")['value'] = '';
    else
      this.selected = 0;
    this.reset();
    this.locType = "site";


  }
}