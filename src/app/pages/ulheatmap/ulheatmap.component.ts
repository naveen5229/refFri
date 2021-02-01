import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { MapService } from '../../services/map.service';

@Component({
  selector: 'ulheatmap',
  templateUrl: './ulheatmap.component.html',
  styleUrls: ['./ulheatmap.component.scss']
})
export class UlheatmapComponent implements OnInit {

  markers = [];
  markerCluster:any;
  heatmap:any;

  constructor(public mapService: MapService,
    public apiService: ApiService,
    public commonService: CommonService) { 
      this.commonService.refresh = this.refresh.bind(this);
    }
    
  refresh(){
    this.setHeatMap('today');
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(1);
  }

  getDataHeatMap(startDate,endDate) {
    return new Promise((resolve, reject) => {
      let params = {
        startDate: this.commonService.dateFormatter(startDate),
        endDate: this.commonService.dateFormatter(endDate),
      };
      this.apiService.post('TripsOperation/getHeatMapData',params)
        .subscribe(response => {
          let data = [];
          let datax = response["data"];
          datax.forEach(datai => {
            datai["title"] = datai["weight"]+"";
            datai["lat"] = parseFloat(datai["lat"]);
            datai["long"] = parseFloat(datai["long"]);
            if(datai["lat"] && datai["lat"]!=0){
              data.push(this.mapService.createLatLng(datai["lat"],datai["long"]));
            }
          });
          this.markers = this.mapService.createSimpleMarkers(datax);
          // this.mapService.setMultiBounds(datax);
          // Add a marker clusterer to manage the markers.
          this.markerCluster = this.mapService.createMarkerCluster(this.markers);
          this.markerCluster.setCalculator(function (markers, numStyles) {
            let ton = 0;
            let index = 0;
            markers.forEach(marker => {
              ton += parseInt(marker.label)
            });
            return {
              text: ton + "Mt",
              index: index
            };
          });
          resolve(data);
        }, err => {
          this.commonService.loading--;
          console.error(err);
          resolve(false);
        });
    })
  }

  // Heatmap data: 500 Points
  setHeatMap(dayRange) {
    let startTime = new Date();
    let endTime = new Date();
  switch (dayRange) {
    case 'today':
      startTime = new Date(new Date().setHours(0,0,0,0));
      endTime = new Date(new Date().setHours(23,59,59,59));
      break;
    case '7 days':
      startTime = new Date(new Date(new Date().setDate(new Date().getDate() - 7)).setHours(0,0,0,0));
      endTime = new Date(new Date().setHours(23,59,59,59));
      break;

    case '15 days':
      startTime = new Date(new Date(new Date().setDate(new Date().getDate() - 15)).setHours(0,0,0,0));
      endTime = new Date(new Date().setHours(23,59,59,59));
      break;    
    
    case 'month':
      startTime = new Date(new Date(new Date().setMonth(-1)).setHours(0,0,0,0));
      endTime = new Date(new Date().setHours(23,59,59,59));
      break;

    case '6 months':
      startTime = new Date(new Date(new Date().setMonth(-6)).setHours(0,0,0,0));
      endTime = new Date(new Date().setHours(23,59,59,59));
      break;
    
    default:
      break;
  }
  this.mapService.clearAll();
  this.mapService.resetMarker(true,true,this.markers);
  this.markerCluster && this.markerCluster.clearMarkers();
  this.markers = [];
  this.markerCluster = null;
  this.heatmap && this.heatmap.setMap(null);
  this.heatmap = null;
  this.getDataHeatMap(startTime,endTime).then((data) => {
    console.log("Here", data);
    this.heatmap = this.mapService.setHeatMap(data);
  })
}

}
