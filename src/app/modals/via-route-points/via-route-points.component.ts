import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { LocationSelectionComponent } from '../location-selection/location-selection.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'via-route-points',
  templateUrl: './via-route-points.component.html',
  styleUrls: ['./via-route-points.component.scss']
})
export class ViaRoutePointsComponent implements OnInit {

  latlong = [{ lat: null, long: null, color: null, subType: null }];
  locType = "map";
  siteLoc = null;
  editId = null;
  siteName = null;
  editMapId = null;
  editSiteId = null;
  rowId = null;
  siteNamee = '';
  latilong = null;
  editRowId = null;
  tableData = [];
  viaroutesData = [];
  lat = null;
  mapName = null;
  kms = null;
  long = null;
  route;
  // selected = 0;
  siteId;
  routeId = null;
  routeData = {
    siteId: null,
    lat: null,
    long: null,
    siteName: null
  };
  mark = null;
  viaMark = [];
  searchString = '';
  keepGoing = true;
  type = "0";
  routeName = null;

  constructor(private activeModal: NgbActiveModal,
    public mapService: MapService,
    public common: CommonService,
    public api: ApiService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    public modalService: NgbModal) {
    this.route = this.common.params.route;
    this.routeName = this.common.params.route.name;
    this.routeId = this.route._id;

    this.viewTable();
    console.log("RouteID-->", this.routeId);
    setTimeout(() => {
      this.mapService.autoSuggestion("loc", (place, lat, lng) => {
        console.log('Lat: ', lat);
        console.log('Lng: ', lng);
        console.log('Place: ', place);
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
    if (type == 'map') {
      this.locType = type;
      this.reset();
    }
    else {
      this.locType = 'site';
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
              this.createMarkers(this.lat, this.long, 'map');

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
    this.type = "0";
    console.log("Value are Null", this.latlong);
  }
  clickDelete(name, i) {
    if (confirm("Are you sure to delete ->" + name)) {
      this.deleteRoutes(i);
    }
  }
  viewTable() {
    this.common.loading++;
    this.api.get('ViaRoutes/viewvia?routeId=' + this.routeId)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        let data = res['data'];
        this.tableData = data;
        this.createrouteMarker();

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  createrouteMarker() {
    this.mapService.clearAll();
    this.viaMark.forEach(mark => {
      mark.setMap(null);
    });

    this.viaMark = [];
    let polygonOption = {
      strokeColor: '#000000',
      strokeWeight: 1,
      icons: [{
        icon: this.mapService.lineSymbol,
        offset: '0',
        repeat: '50px'
      }]
    };

    for (let i = 0; i < this.tableData.length; i++) {
      this.tableData[i].color = (i == 0) ? "00FF00" : (i == this.tableData.length - 1 ? "FF0000" : null);
      this.tableData[i].subType = (this.tableData[i]._type == 1 || i == 0 || i == this.tableData.length - 1) ? "marker" : null;
      this.mapService.createPolyPathManual(this.mapService.createLatLng(this.tableData[i].lat, this.tableData[i].long), polygonOption);
    }

    this.viaMark = this.mapService.createMarkers(this.tableData);
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

    if (this.locType == 'site') {
      this.siteNamee = this.routeData.siteName,
        this.lat = this.routeData.lat,
        this.long = this.routeData.long,
        this.siteId = this.routeData.siteId
    }

    let params = {
      routeId: this.routeId,
      lat: this.lat,
      long: this.long,
      kms: this.kms,
      siteId: this.siteId,
      name: this.siteNamee,
      rowId: this.rowId,
      type: this.type,
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
          this.locType = "map";
          this.viewTable();
          this.mapName = null;
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

  async updateOrder() {
    await this.calculateKms();
    let params = {
      data: JSON.stringify(this.tableData),
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
      if (this.locType == 'site')
        document.getElementsByName("suggestion")[0]['value'] = '';
      this.siteLoc = { name: this.tableData[i]._name, sd_loc_name: this.tableData[i]._sd_loc_name };
      this.locType = "site";

      this.kms = this.tableData[i].kms;
      // document.getElementById("site")['value'] = this.tableData[i]._name;
      this.routeData.siteId = this.tableData[i]._site_id;
      this.routeData.lat = this.tableData[i]._lat;
      this.routeData.long = this.tableData[i]._long;
      this.routeData.siteName = this.tableData[i]._name;
      this.type = this.tableData[i]._type + "";
      console.log("route data--->", this.routeData);
      this.rowId = this.tableData[i]._id;

    }
    else {
      this.locType = "map";
      // this.mapName = this.tableData[i].name;
      this.kms = this.tableData[i].kms;
      this.latilong = this.tableData[i]._lat + ',' + this.tableData[i]._long;
      this.mapName = this.tableData[i]._name;
      // document.getElementById("map")['value'] = this.tableData[i]._name;
      this.siteId = this.tableData[i]._site_id;
      this.lat = this.tableData[i]._lat;
      this.long = this.tableData[i]._long;
      this.siteNamee = this.tableData[i]._name;
      this.rowId = this.tableData[i]._id;
      this.type = this.tableData[i]._type + "";


    }

  }
  editTableRow() {

  }
  cancelEdit() {
    this.editId = null;
    this.kms = null;
    this.mapName = null;
    this.siteName = null;
    this.rowId = null;
    this.siteLoc = null;
    this.latilong = null;
    this.lat = null;
    this.long = null;
    this.siteId = null;
    this.siteNamee = null;
    if (this.locType == 'site')
      document.getElementById("site")['value'] = '';
    else
      this.reset();
    this.locType = "map";


  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
    this.createrouteMarker();
  }

  async calculateKms() {
    let previous = {
      lat: null,
      long: null,
    };
    let total = null;
    let kms = null;

    for (let i = 0; i < this.tableData.length; i++) {
      let data = this.tableData[i];
      console.log("i", i);

      if (i == 0) {
        previous = data;
        this.tableData[i].kms = 0;
        continue;
      }
      kms = await this.mapService.distanceBtTwoPoint(previous.lat, previous.long, this.tableData[i].lat, this.tableData[i].long);
      total += (kms / 1000);
      previous.lat = this.tableData[i].lat;
      previous.long = this.tableData[i].long;
      this.zone.run(() => {
        this.tableData[i].kms = parseInt(total.toFixed(0));
      });

    }
  }
}