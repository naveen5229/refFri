import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { NumberFormatStyle } from '@angular/common';
import { MapService } from '../../services/map.service';

declare var google: any;

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicles-on-map',
  templateUrl: './vehicles-on-map.component.html',
  styleUrls: ['./vehicles-on-map.component.scss']
})
export class VehiclesOnMapComponent implements OnInit {
  vehicles = null;
  constructor(public common: CommonService,
    private activeModal: NgbActiveModal,
    public api: ApiService,
    public mapService : MapService
   ) {
   this.vehicles = this.common.params.vehicles;
   console.log("vehicles",this.vehicles);
   }

  ngOnDestroy(){}
ngOnInit() {
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("vehicles-on-map-map");
    setTimeout(() => {
      this.mapService.createMarkers(this.vehicles);
      let markerIndex = 0;
      for (const marker of this.mapService.markers) {
        let event = this.vehicles[markerIndex];
        this.mapService.addListerner(marker,'mouseover',()=>this.setEventInfo(event));
        this.mapService.addListerner(marker,'mouseout',()=>this.unsetEventInfo());
        markerIndex++;
      }
    }, 1000); 

  }
  //eventInfo = null;
  infoWindow = null;
  setEventInfo(event) {
    this.infoWindow = this.mapService.createInfoWindow();
    this.infoWindow.opened = false;
    this.infoWindow.setContent(
      `
      <b>Vehicle:</b>${event.x_showveh} <br>
      `
    );
    this.infoWindow.setPosition(this.mapService.createLatLng(event.x_tlat, event.x_tlong)); // or evt.latLng
    this.infoWindow.open(this.mapService.map);
    let bound = this.mapService.getMapBounds();

    // if (!((bound.lat1 + 0.001 <= event.lat && bound.lat2 - 0.001 >= event.lat) &&
    //   (bound.lng1 + 0.001 <= event.long && bound.lng2 - 0.001 >= event.long))) {
    //   this.mapService.zoomAt({ lat: event.lat, lng: event.lng }, this.zoomLevel);
    // }
  }
  unsetEventInfo() {
    this.infoWindow.close();
    this.infoWindow.opened = false;
  }

  

  closeModal() {
    this.activeModal.close();
  }


  
}
