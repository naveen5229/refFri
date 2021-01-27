import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from "../../services/api.service";
import { CommonService } from '../../services/common.service';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoadHaltComponent } from '../../modals/load-halts/load-halt.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'halt-density',
  templateUrl: './halt-density.component.html',
  styleUrls: ['./halt-density.component.scss', '../../pages/pages.component.css',]
})
export class HaltDensityComponent implements OnInit {

  startTime = new Date(new Date().setMonth(new Date().getMonth() - 1));
  endTime = new Date();
  foid = null;
  minZoom = 12;
  createSiteMarker = null;
  buffers = [];
  typeId = -1;
  typeIds = [];
  data = null;
  isHeatAble = false;


  constructor(public mapService: MapService,
    private apiService: ApiService,
    private router: Router,
    private modalService: NgbModal,
    private commonService: CommonService) {
      this.commonService.refresh = this.refresh.bind(this);
  }

  ngOnDestroy(){}
ngOnInit() {
  }
  refresh(){
    console.log("refresh");
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => this.mapService.zoomAt({ lat: lat, lng: lng }, this.minZoom));
    this.mapService.map.setOptions({ draggableCursor: 'crosshair' });
    this.getTypeIds();
    // this.mapService.addListerner(this.mapService.map, 'click', (event) => {
    //  
    // })
  }

  createTable() {
    if (!this.startTime)
      this.commonService.showToast("Enter Start Time");
    this.commonService.loading++;
    let latLngs = this.mapService.getMapBounds();
    this.apiService.get("SiteFencing/getBufferZoneCandidates?lat=-1&long=-1&startTime=" + this.commonService.dateFormatter(this.startTime))
      .subscribe(res => {
        this.commonService.loading--;
        this.mapService.clearAll();
        console.log('Res: ', res['data']);
        this.buffers = res['data'];
        this.mapService.createMarkers(this.buffers);
      }, err => {
        console.error(err);
        this.commonService.showError();
      });
  }

  submit(isHeat?) {
    this.mapService.clearAll();
    if (this.mapService.map.getZoom() < this.minZoom) {
      this.commonService.showToast("bounds are huge");
      return;
    }
    var bounds = this.mapService.getMapBounds();
    console.log("Bounds", bounds);

    let params = {
      'foid': this.foid,
      'startTime': this.commonService.dateFormatter(this.startTime),
      'endTime': this.commonService.dateFormatter(this.endTime),
      'lat1': bounds.lat1,
      'lat2': bounds.lat2,
      'lng1': bounds.lng1,
      'lng2': bounds.lng2,
    }
    this.apiService.post("HaltOperations/getAllHaltsBtw", params)
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.mapService.options = {
          circle: {
            scale: 1
          }
        };
        if (!isHeat)
          this.mapService.createMarkers(res['data'], false, false);
        else
          this.mapService.createHeatMap(res['data'], false);
      }, err => {
        console.error(err);
        this.commonService.showError();
      });
  }
  loadMarkers() {
    let boundBox = this.mapService.getMapBounds();
    let bounds = {
      'lat1': boundBox.lat1,
      'lng1': boundBox.lng1,
      'lat2': boundBox.lat2,
      'lng2': boundBox.lng2,
      'typeId': null
    };
    this.apiService.post("VehicleStatusChange/getSiteAndSubSite", bounds)
      .subscribe(res => {
        let data = res['data'];
        console.log('Res: ', res['data']);
        this.mapService.createMarkers(data, false, false, ["id", "name"], (marker) => {
          this.apiService.post("Site/getSingleSite", { siteId: marker.id })
            .subscribe(res => {
              let data = res['data'];
              this.mapService.options = { clearHeat: false };
              this.mapService.clearAll(true, true, { marker: false, polygons: true, polypath: false });
              this.apiService.post("SiteFencing/getSiteFences", { siteId: marker.id })
                .subscribe(res => {
                  this.commonService.loading++;
                  let data = res['data'];
                  let count = Object.keys(data).length;
                  console.log('Res: ', res['data']);
                  if (count == 1) {
                    this.mapService.createPolygon(data[Object.keys(data)[0]].latLngs);
                    console.log("Single", data[Object.keys(data)[0]]);
                  }
                  else if (count > 1) {
                    let latLngsArray = [];
                    let show = "Unknown";
                    let isMain = false;
                    let isSec = false;
                    let minDis = 100000;
                    let minIndex = -1;
                    for (const datax in data) {
                      isMain = false;
                      if (data.hasOwnProperty(datax)) {
                        const datav = data[datax];
                        if (datax == marker.id) {
                          isMain = true;
                        }
                        else if (minDis > datav.dis) {
                          isMain = false;
                          minDis = datav.dis;
                          minIndex = latLngsArray.length;
                        }
                        latLngsArray.push({
                          data: datav.latLngs, isMain: isMain, isSec: isSec, show:
                            `
                  Id: ${datax}<br>
                  Name:${datav.name}<br>
                  Location:${datav.loc_name}<br>
                  `
                        });
                      }
                    }
                    if (minIndex != -1)
                      latLngsArray[minIndex].isSec = true;
                    this.mapService.createPolygons(latLngsArray);
                  }
                  else {
                    console.log("Else");
                  }
                  this.mapService.zoomAt(this.mapService.createLatLng(marker.lat, marker.long), 16);
                  this.commonService.loading--;
                }, err => {
                  console.error(err);
                  this.commonService.showError();
                  this.commonService.loading--;
                });
            }, err => {
              console.error(err);
              this.commonService.showError();
            });
        });
      }, err => {
        console.error(err);
        this.commonService.showError();
      });
  }
  createSite(data) {
    this.data = data;
    const activeModal = this.modalService.open(LoadHaltComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (!data) {
        this.commonService.showToast("No Site Type Selected");
        return;
      }
      this.apiService.post("SitesOperation/createBufferZone", { type: data.response, lat: this.data.lat, long: this.data.long })
        .subscribe(res => {
          if (res['success']) {
            this.commonService.showToast("Success");
            let remove = this.buffers.findIndex((element) => {
              return element.halt_id == this.data.halt_id;
            })
            this.buffers.splice(remove, 1);
            this.typeId = 401;
            // this.router.navigate(['/admin/site-fencing']);
          } else
            this.commonService.showError(res['msg']);
        }, err => {
          console.error(err);
          this.commonService.showError();
        });
    });
  }
  zoomAt(lat, long) {
    this.buffers.forEach(element => {
      if (element.lat == lat && element.long == long)
        element.isHighLight = true;
      else
        element.isHighLight = false;
    });
    if (!this.createSiteMarker)
      this.createSiteMarker = this.mapService.createMarkers([{
        lat: lat,
        lng: long,
        subType: 'marker',
      }], false, false)[0];
    else {
      this.createSiteMarker.setPosition(this.mapService.createLatLng(
        lat,
        long
      ));
      this.createSiteMarker.setMap(this.mapService.map);
    }
    this.mapService.zoomAt(this.mapService.createLatLng(parseFloat(lat), parseFloat(long)));
  }
  getTypeIds() {
    this.apiService.post("SiteFencing/getSiteTypes", {})
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.typeIds = res['data'];
      }, err => {
        console.error(err);
        this.commonService.showError();
      });
  }

  showHeat() {
    if (this.isHeatAble) {
      this.mapService.resetHeatMap();
      this.isHeatAble = false;
    } else {
      if (this.mapService.map.getZoom() < this.minZoom) {
        this.commonService.showToast("bounds are huge");
        return;
      }
      var bounds = this.mapService.getMapBounds();
      console.log("Bounds", bounds);

      let params = {
        'lat': (bounds.lat1 + bounds.lat2) / 2,
        'long': (bounds.lng2 + bounds.lng2) / 2
      }
      this.commonService.loading++;
      this.apiService.get("SiteFencing/getBufferZoneCandidates?lat=" + params.lat + "&long=" + params.long)
        .subscribe(res => {
          console.log('Res: ', res['data']);
          this.mapService.createHeatMap(res['data'], false);
          this.isHeatAble = true;
          this.commonService.loading--;
        }, err => {
          console.error(err);
          this.commonService.showError();
          this.commonService.loading--;
        });
    }
  }
}
