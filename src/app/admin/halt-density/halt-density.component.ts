import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from "../../services/api.service";
import { CommonService } from '../../services/common.service';

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

  constructor(public mapService: MapService,
    private apiService: ApiService,
    private commonService: CommonService) { }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.autoSuggestion("moveLoc", (place, lat, lng) => this.mapService.zoomAt({ lat: lat, lng: lng }, this.minZoom));
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
          this.mapService.createMarkers(res['data']);
        else
          this.mapService.createHeatMap(res['data']);
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
        this.mapService.createMarkers(data, false, true, ["id", "name"], (marker) => {
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

}
