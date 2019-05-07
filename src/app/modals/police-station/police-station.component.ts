import { Component, OnInit } from '@angular/core';
import { MapService } from '../../services/map.service';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { Api2Service } from '../../services/api2.service';
import { element } from '@angular/core/src/render3';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'police-station',
  templateUrl: './police-station.component.html',
  styleUrls: ['./police-station.component.scss','../../pages/pages.component.css']
})
export class PoliceStationComponent implements OnInit {
  PoliceStation = [];

  lat;
  long;
  type;

  constructor(
    public mapService: MapService,
    public api2: Api2Service,
    private activeModal: NgbActiveModal,
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
  tempData = [];
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
            this.mapService.createMarkers(this.PoliceStation,false,true,["vicinity"]);
            
        }, err => {
          this.common.loading--;
          this.common.showError();
        })
        
        
        
    
  }
  openSmartTool(i, value) {
    this.PoliceStation.forEach(vEvent => {
      if (vEvent != value)
        vEvent.isOpen = false;
    });
    value.isOpen = !value.isOpen;
    this.zoomFunctionality(i, value);
  }
  zoomFunctionality(i, value) {
    console.log("value", value);
    let latLng = this.mapService.getLatLngValue(value);
    let googleLatLng = this.mapService.createLatLng(latLng.lat, latLng.lng);
    console.log("latlngggg", googleLatLng);
    this.mapService.zoomAt(googleLatLng);
  }
  dismiss() {
    this.activeModal.close();
  }
}
