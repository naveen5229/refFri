import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { Api2Service } from '../../services/api2.service';

@Component({
  selector: 'police-station',
  templateUrl: './police-station.component.html',
  styleUrls: ['./police-station.component.scss']
})
export class PoliceStationComponent implements OnInit {
  PoliceStation = [];

  lat;
  long;
  type;

  constructor(
    public mapService: MapService,
    public api2: Api2Service,
    public common: CommonService) { 
      this.common.handleModalSize('class', 'modal-lg', '1000');
      this.lat = this.common.params.lat;
    this.long = this.common.params.long;
    console.log("------------",this.lat);
    this.getPoliceStation();
    
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    
  }

  getPoliceStation(){
    
    let params = "lat="+this.lat+
      "&lng=" +this.long+
      "&type=" +this.type;

      console.log('params: ', params);
      this.common.loading++;
      this.api2.get('Location/getNearBy?'+params)
        .subscribe(res => {
          this.common.loading--;
          console.log(res['data'])

          if (res['success'])
            this.common.showToast('Success');
            this.PoliceStation = res['data'];
            this.mapService.createMarkers(this.PoliceStation);
        }, err => {
          this.common.loading--;
          this.common.showError();
        })
    
  }
}
