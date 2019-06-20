import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'buffer-polyline',
  templateUrl: './buffer-polyline.component.html',
  styleUrls: ['./buffer-polyline.component.scss', '../../pages/pages.component.css',]
})
export class BufferPolylineComponent implements OnInit {
  remainingList = [];
  circle = null;
  selectedSite = null;
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

  constructor(public mapService: MapService,
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService,
    public modalService: NgbModal) { }

  ngOnInit() {
    this.getRemainingTable();
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
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

      }


    });

  }

  getRemainingTable() {
    this.commonService.loading++;
    this.apiService.post("SiteFencing/getRemainingSites", { type: -2 })
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
    // this.exitTicket();
    this.mapService.isDrawAllow = false;
    this.siteName = null;
    this.siteLoc = null;
    this.selectedSite = null;
    if (loadTable) {

      this.getRemainingTable();
    }
    this.meterRadius = 20;
    this.mapService.clearAll();
    this.mapService.resetPolyPaths();
  }


  undo() {
    if (this.mapService.isDrawAllow) {
      this.mapService.undoPolyPath();
      console.log("Here", this.mapService.polygonPath);
      if (this.circle) {
        let x = this.mapService.polygonPath.getPath().getArray();
        this.circle.setCenter(x[x.length - 1]);
      }
    }
  }

  enterTicket() {
    if (this.selectedSite) {

      this.mapService.isDrawAllow = true;
      this.submitPolygon();
    }
    else {
      this.commonService.showToast('Select Site First..');

    }

  }

  submitPolygon() {
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
        path += latLngs[i].lat() + " " + latLngs[i].lng() + ",";
      }
      path += latLngs[0].lat() + " " + latLngs[0].lng() + ",";
      path = path.substr(0, path.length - 1);
      path += ")";
      let params = {
        bufferString: path,
        typeId: -2,
        siteId: this.selectedSite
      };
      //  console.log("Poly",this.mapService.polygon);
      this.commonService.loading++;
      this.apiService.post("Buffer/bufferLines", params)
        .subscribe(res => {
          this.commonService.loading--;

          let data = res['data'];
          console.log('Res: ', res['data']);
          this.commonService.showToast("Created");
          this.getRemainingTable();
          let position = this.lat + "," + this.long;
          this.clearAll(false);
          this.position = position;
          this.search();
        }, err => {
          console.error(err);
          this.commonService.showError();
          this.mapService.isDrawAllow = true;
        });

    }
  }

  search() {
    console.log("position1", this.position);
    this.final = this.position.split(",");
    console.log("array", this.final[0], this.final[1]);

    this.mapService.zoomAt(this.mapService.createLatLng(this.final[0], this.final[1]), 12);
    let params = {
      lat: this.final[0],
      long: this.final[1],

    };
    this.commonService.loading++;
    console.log("params", params);
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
    let site = this.selectedSite;
    this.apiService.post("Site/getSingleSite", { siteId: this.selectedSite })
      .subscribe(res => {
        this.commonService.loading--;
        let data = res['data'];
        console.log('Res: ', data);
        // return;
        this.clearAll(false);
        this.tempData = data;
        // this.siteLatLng = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].long) };
        this.typeId = data[0].type_id;
        this.selectedSite = data[0].id;
        this.siteLoc = data[0].loc_name;
        this.siteName = data[0].name;
        this.selectedSite = site;
        this.lat = data[0].lat;
        this.long = data[0].long;
        if (this.typeId != -2) {
          this.commonService.showError("select Buffer Zone Site Id");
        }

        this.getRemainingTable();
        this.commonService.loading++;
        this.apiService.post("Buffer/getBuffer", { lat: this.lat, long: this.long })
          .subscribe(res => {
            this.commonService.loading--;
            let data = res['data'];
            let count = Object.keys(data).length;
            console.log('Res: ', res['data']);
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
              this.search();
            }, err => {
              this.commonService.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

}
