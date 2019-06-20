import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'buffer-polyline',
  templateUrl: './buffer-polyline.component.html',
  styleUrls: ['./buffer-polyline.component.scss', '../../pages/pages.component.css',]
})
export class BufferPolylineComponent implements OnInit {
  remainingList = [];
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

  constructor(public mapService: MapService,
    private apiService: ApiService,
    private router: Router,
    private commonService: CommonService) { }

  ngOnInit() {
    this.getRemainingTable();
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.zoomAt({ lat: 26.928826486644528, lng: 75.74931625366207 }, 14);
    this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => this.mapService.zoomAt({ lat: lat, lng: lng }, 14));
    this.mapService.createPolygonPath();
    this.mapService.map.setOptions({ draggableCursor: 'crosshair' });
  }

  getRemainingTable() {
    this.apiService.post("SiteFencing/getRemainingSites", { type: -1 })
      .subscribe(res => {
        let data = res['data'];
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
      'typeId': -1
    };
    this.apiService.post("VehicleStatusChange/getSiteAndSubSite", bounds)
      .subscribe(res => {
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

    if (loadTable) {

      this.getRemainingTable();
    }
    this.mapService.clearAll();
  }


  enterTicket() {
    this.mapService.isDrawAllow = true;
    this.submitPolygon();

  }

  submitPolygon() {
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

        typeId: -1
      };
      //  console.log("Poly",this.mapService.polygon);
      this.apiService.post("Test/bufferPolylines", params)
        .subscribe(res => {
          let data = res['data'];
          console.log('Res: ', res['data']);
          this.commonService.showToast("Created");
          this.getRemainingTable();
          this.clearAll(false);
        }, err => {
          console.error(err);
          this.commonService.showError();
          this.mapService.isDrawAllow = true;
        });

    }
  }




  gotoSingle() {
    this.commonService.loading++;
    let site = this.selectedSite;
    this.apiService.post("Site/getSingleSite", { siteId: this.selectedSite })
      .subscribe(res => {
        let data = res['data'];
        console.log('Res: ', data);
        this.clearAll(false);
        this.siteLatLng = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].long) };
        this.typeId = data[0].type_id;
        this.selectedSite = data[0].id;
        this.siteLoc = data[0].loc_name;
        this.siteName = data[0].name;
        this.selectedSite = site;
        this.getRemainingTable();
        this.apiService.post("SiteFencing/get", { siteId: this.selectedSite })
          .subscribe(res => {
            this.commonService.loading++;
            let data = res['data'];
            let count = Object.keys(data).length;
            console.log('Res: ', res['data']);
            if (data[this.selectedSite]) {
              this.tempData[0]['color'] = 'f00';
              this.isUpdate = true;
            }
            else
              this.isUpdate = false;
            this.mapService.createMarkers(this.tempData);
            if (count == 1) {
              this.mapService.createPolyPathsManual(data[Object.keys(data)[0]].latLngs);
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
                  if (datax == this.selectedSite) {
                    isMain = true;
                  }
                  else if (minDis > datav.dis) {
                    this.mergeSiteId = datax;
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
              this.mapService.createPolyPathsManual(latLngsArray);
            }
            else {
              console.log("Else");
            }
            this.mapService.zoomMap(18.5);
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

    this.commonService.loading--;
  }


  search() {
    console.log("position1", this.position);
    this.final = this.position.split(",");
    console.log("array", this.final[0], this.final[1]);

    this.mapService.zoomAt(this.mapService.createLatLng(this.final[0], this.final[1]), 14);

  }


}
