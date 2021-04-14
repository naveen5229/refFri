import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'buffer-polyline',
  templateUrl: './buffer-polyline.component.html',
  styleUrls: ['./buffer-polyline.component.scss', '../../pages/pages.component.css',]
})
export class BufferPolylineComponent implements OnInit {
  remainingList = [];
  circle = null;
  routeId = null;
  siteLatLng = { lat: 0, lng: 90 };
  typeId = 1;
  siteLoc = '';
  siteName = null;
  tempData = [];
  isUpdate = false;
  mergeSiteId = null;
  position = null;
  final = null;
  meterRadius = 20;
  currentCenter = null;
  lat = null;
  long = null;
  isHeatAble = false;
  kmsShow = null;
  constructor(public mapService: MapService,
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService,
    public modalService: NgbModal) {
    this.commonService.refresh = this.refresh.bind(this);

  }

  ngOnDestroy(){}
ngOnInit() {
    this.getRemainingTable();
  }
  refresh() {
    console.log('Refresh');
    this.getRemainingTable();
  }

  calKms() {
    let lat, long, total = 0;
    if (this.mapService.polygonPath) {
      var latLngs = this.mapService.polygonPath.getPath().getArray();
      for (var i = 0; i < latLngs.length; i++) {
        if (i != 0) {
          total += this.commonService.distanceFromAToB(lat, long, latLngs[i].lat(), latLngs[i].lng(), 'Mt');
        }
        lat = latLngs[i].lat();
        long = latLngs[i].lng();
      }
    }

    this.kmsShow = (total / 1000).toFixed(2);
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("buffer-polyline-map");
    this.mapService.zoomAt({ lat: 26.928826486644528, lng: 75.74931625366207 }, 14);
    this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => this.mapService.zoomAt({ lat: lat, lng: lng }, 14));
    this.mapService.createPolygonPath();
    this.mapService.map.setOptions({ draggableCursor: 'crosshair' });
    this.mapService.addListerner(this.mapService.map, 'click', (event) => {
      if (this.mapService.isDrawAllow) {
        console.log("Event", event);
        this.currentCenter = event.latLng;
        if (this.circle) {
          this.circle.setMap(null);
          this.circle = null;
        }
        this.circle = this.mapService.createCirclesOnPostion(event.latLng, this.meterRadius);
        let position = event.latLng.lat() + "," + event.latLng.lng();

        this.position = position;
        this.search(false);
        this.calKms();
      }
    });
  }

  getRemainingTable() {
    this.commonService.loading++;
    this.apiService.get("Buffer/getBufferRemaining")
      .subscribe(res => {
        let data = res['data'];
        this.commonService.loading--;
        console.log('Res: ', res['data']);
        this.remainingList = data;
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
      'typeId': -2
    };
    this.commonService.loading++;
    this.apiService.post("VehicleStatusChange/getSiteAndSubSite", bounds)
      .subscribe(res => {
        this.commonService.loading--;
        let data = res['data'];
        console.log('Res: ', res['data']);
        this.clearAll();
        this.mapService.createMarkers(data, false, true, ["id", "name"]);
      }, err => {
        console.error(err);
        this.commonService.showError();
      });
  }

  clearAll(loadTable = true) {
    this.exitTicket();
    this.mapService.isDrawAllow = false;
    this.siteName = null;
    this.siteLoc = null;
    this.routeId = null;
    if (loadTable) {

      this.getRemainingTable();
    }
    // this.meterRadius = 20;
    if (this.circle)
      this.circle.setMap(null);
    this.mapService.clearAll();
    this.mapService.resetPolyPaths();
  }


  undo() {
    if (this.mapService.isDrawAllow) {
      this.mapService.undoPolyPath();
      this.calKms();
      console.log("Here", this.mapService.polygonPath);
      if (this.circle) {
        let x = this.mapService.polygonPath.getPath().getArray();
        this.circle.setCenter(x[x.length - 1]);
      }
    }
  }

  enterTicket() {

    if (!this.mapService.isDrawAllow) {
      let params = {
        tblRefId: 8,
        tblRowId: this.routeId
      };
      if (this.routeId) {
        this.commonService.loading++;
        this.apiService.post('TicketActivityManagment/insertTicketActivity', params)
          .subscribe(res => {
            this.commonService.loading--;
            if (!res['success']) {
              this.commonService.showToast(res['msg']);
            }
            else {
              this.mapService.isDrawAllow = true;
              if (this.isUpdate) {
                this.commonService.showToast('Already Exists');
              }
            }
          }, err => {
            this.commonService.loading--;
            console.log(err);
          });
      }
      else {
        this.mapService.isDrawAllow = true;
        if (this.isUpdate) {
          this.commonService.showToast('Already Exists');
        }
      }

    }
    if (this.mapService.isDrawAllow)
      this.submitPolygon();


  }

  submitPolygon() {
    let url;
    this.mapService.createCirclesOnPostion(latLngs, this.meterRadius);
    if (this.mapService.polygonPath) {
      var path = "(";
      var latLngs = this.mapService.polygonPath.getPath().getArray();

      if (latLngs.length < 4) {
        alert("Site Should Have More Than 3 points Atleast");
        this.mapService.isDrawAllow = true;
        return;
      }

      for (var i = 0; i < latLngs.length; i++) {
        if (i == Math.floor(latLngs.length / 2))
          this.lat = latLngs[i].lat();
        this.long = latLngs[i].lng();
        path += latLngs[i].lat() + " " + latLngs[i].lng() + ",";
      }
      path = path.substr(0, path.length - 1);
      path += ")";
      let params = {
        bufferString: path,
        routeId: this.routeId,
        roadDist: this.meterRadius,
        lat: this.lat,
        long: this.long
      };
      this.commonService.loading++;
      if (this.routeId)
        url = "Buffer/updateBufferLines";
      else
        url = "Buffer/insertBufferLines";

      this.apiService.post(url, params)
        .subscribe(res => {
          this.commonService.loading--;
          this.commonService.showToast("Save");
          this.getRemainingTable();
          let position = this.lat + "," + this.long;
          this.clearAll();
          this.position = position;
          this.search();
        }, err => {
          console.error(err);
          this.commonService.showError();
          this.mapService.isDrawAllow = true;
        });

    }
  }
  mapGetCenterAndBound(){
    let boundBox = this.mapService.getMapBounds();
    let bounds = {
      lat: (boundBox.lat1 + boundBox.lat2) / 2,
      long: (boundBox.lng1 + boundBox.lng2) / 2,
      bound: Math.max(Math.abs(boundBox.lat1 - boundBox.lat2) / 2,
        Math.abs(boundBox.lng1 - boundBox.lng2) / 2)
    };
    return bounds;
  }
  boundSearch() {
    let bounds = this.mapGetCenterAndBound();
    this.commonService.loading++;
    this.apiService.post("Buffer/getBuffer", bounds)
      .subscribe(res => {
        this.commonService.loading--;
        let data = res['data'];
        if (!res['success']) {
          this.commonService.showError(res['msg']);
          return;
        }
        this.mapService.resetPolyPaths();
        this.mapService.createPolyPathsManual(data, (poly, event) => {
          this.remove(poly.id);
        });
      }, err => {
        console.error(err);
        this.commonService.showError();
        this.mapService.isDrawAllow = true;
      });
  }

  search(isZoom = true) {
    console.log("position1", this.position);
    this.final = this.position.split(",");
    console.log("array", this.final[0], this.final[1]);
    if (isZoom)
      this.mapService.zoomAt(this.mapService.createLatLng(this.final[0], this.final[1]), 15);
    let params = {
      lat: this.final[0],
      long: this.final[1],
    };

    this.commonService.loading++;
    this.apiService.post("Buffer/getBuffer", params)
      .subscribe(res => {
        this.commonService.loading--;

        let data = res['data'];
        console.log('Res: ', res['data']);
        this.mapService.resetPolyPaths();
        this.mapService.createPolyPathsManual(data, (poly, event) => {
          console.log("Poly", poly);
          this.remove(poly.id);
        });
      }, err => {
        console.error(err);
        this.commonService.showError();
        this.mapService.isDrawAllow = true;
      });
  }



  gotoSingle() {
    this.commonService.loading++;
    let site = this.routeId;
    this.apiService.post("Buffer/getSingleBuffer", { id: this.routeId })
      .subscribe(res => {
        this.commonService.loading--;
        let data = res['data'];
        this.clearAll();
        this.tempData = data;
        this.typeId = data[0].type_id;
        this.routeId = data[0].id;
        this.siteLoc = data[0].loc_name;
        this.siteName = data[0].name;
        this.routeId = site;
        this.lat = data[0].lat;
        this.long = data[0].long;

        this.getRemainingTable();
        this.commonService.loading++;
        this.apiService.post("Buffer/getBuffer", { lat: this.lat, long: this.long })
          .subscribe(res => {
            this.commonService.loading--;
            let data = res['data'];
            this.mapService.resetPolyPaths();
            this.mapService.createPolyPathsManual(data, (poly, event) => {
              console.log("Poly", poly);
              this.remove(poly.id);
            });
            this.mapService.createMarkers(this.tempData);
            this.mapService.setMapType(1);

          }, err => {
            console.error(err);
            this.commonService.showError();
            this.commonService.loading--;
          });
      }, err => {
        console.error(err);
        this.commonService.showError();
      });

  }



  remove(row) {
    console.log("row", row);
    let params = {
      id: row,
    }
    if (row) {
      console.log('id', row._id);
      this.commonService.params = {
        title: 'Delete Polyline ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Polyline' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.commonService.loading++;
          this.apiService.post('Buffer/bufferDelete', params)
            .subscribe(res => {
              this.commonService.loading--;
              this.commonService.showToast(res['msg']);
              let bounds = this.mapGetCenterAndBound();
              let position = bounds.lat + "," + bounds.long;
              this.clearAll();
              this.position = position;
              this.search();
            }, err => {
              this.commonService.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

  showHeat() {
    if (this.isHeatAble) {
      this.mapService.resetHeatMap();
      this.isHeatAble = false;
    } else {
      if (this.mapService.map.getZoom() < 12) {
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


  ignoreSite() {
    if (!this.routeId) {
      alert("Select Buffer First!!!");
      return;
    }
    this.commonService.loading++;
    this.apiService.post('Buffer/ignore', { routeId: this.routeId })
      .subscribe(res => {
        this.commonService.loading--;
        this.commonService.showToast(res['msg']);
        this.getRemainingTable();
      }, err => {
        this.commonService.loading--;
        console.log(err);
      });
    this.clearAll();
  }


  exitTicket() {
    if (this.routeId) {

      let result;
      var params = {
        tblRefId: 8,
        tblRowId: this.routeId
      };
      console.log("params", params);
      this.commonService.loading++;
      this.apiService.post('TicketActivityManagment/updateActivityEndTime', params)
        .subscribe(res => {
          this.commonService.loading--;
          result = res
          console.log(result);
          if (!result.sucess) {
            // alert(result.msg);
            return false;
          }
          else {
            return true;
          }
        }, err => {
          this.commonService.loading--;
          console.log(err);
        });
      return false;
    }
  }

}
