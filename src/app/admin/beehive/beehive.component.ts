import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { element } from '@angular/core/src/render3';
@Component({
  selector: 'beehive',
  templateUrl: './beehive.component.html',
  styleUrls: ['./beehive.component.scss']
})
export class BeehiveComponent implements OnInit {
  lat1: "";
  long1: "";

  lat2: "";
  long2: "";
  // arr1 = [
  //   this.lat1,
  //   this.long1,
  //   this.lat2,
  //   this.long2
  // ];
  size = "";
  first =null;
  second = null;

  constructor(
    public mapService: MapService,
    public api: ApiService,
    public common: CommonService
  ) {

  }
  ngOnInit() {

  }

  ngAfterViewInit() {

    setTimeout(() => {
      this.mapService.mapIntialize("map", 8);
      this.mapService.addListerner(this.mapService.map, 'click', (e) => {
        if (this.first != null) {
          this.lat2 = e.latLng.lat();
          this.long2 = e.latLng.lng();
          this.second = this.lat2 + ',' + this.long2;
        }
        else {
          this.lat1 = e.latLng.lat();
          this.long1 = e.latLng.lng();
          this.first = this.lat1 + ',' + this.long1;
          console.log("Event", e.latLng.lat());
        }

      });
    }, 2000);
  }

  getMapping() {
    this.mapService.clearAll();
    let params = {
      bounds: [parseFloat(this.first.split(',')[0]),parseFloat(this.first.split(',')[1])
      ,parseFloat(this.second.split(',')[0]),parseFloat(this.second.split(',')[1])],
      side: this.size

    };
    console.log('params:---------------- ', params);
    this.common.loading++;
    this.api.post('Test/beeHive',params)
    .subscribe(res => {
      this.common.loading--;
      console.log(res['data'])
      this.mapService.createMarkers(res['data'],false,true,["lat","lng"]);
      // this.dateVal=res['data'];
  
},
err => {
  this.common.loading--;
  this.common.showError();
})

}
}
