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
    if (this.mapService.map.getZoom() < this.minZoom)
      this.commonService.showToast("bounds are huge");
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

}
