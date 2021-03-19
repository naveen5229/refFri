import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { MapService } from "../../services/map.service";

@Component({
  selector: 'placementoptimize',
  templateUrl: './Placementoptimize.component.html',
  styleUrls: ['./Placementoptimize.component.scss']
})
export class PlacementoptimizeComponent implements OnInit {

  map: any;
  placementData=[];
  infoWindow = null;
  infoStart = null;
  isZoomed = false;
  filterData=[];

  constructor(
    public mapService: MapService,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,    
    private activeModal: NgbActiveModal
  ) {
    this.placementData=this.common.params.data;
   }

   

  ngOnInit(): void {
  }

  closeModal(event){

  }


  ngAfterViewInit() {
    
    this.mapService.mapIntialize("placement-map");
    this.mapService.clearAll();
    
    setTimeout(() => {
      this.mapService.setMapType(0);
      this.mapService.createMarkers(this.placementData);
      this.mapService.addListerner(this.mapService.map, "center_changed", () => {
        this.setMarkerLabels();
      });
      this.mapService.addListerner(this.mapService.map, "zoom_changed", () => {
        this.setMarkerLabels();
      });
      let markerIndex = 0;
      for (const marker of this.mapService.markers) {
        let event = this.placementData[markerIndex];
        this.mapService.addListerner(marker, "mouseover", () =>
          this.setEventInfo(event)
        );
        this.mapService.addListerner(marker, "mouseout", () =>
          this.unsetEventInfo()
        );
        markerIndex++;
      }
    }, 1000);
  }


  setMarkerLabels() {
    if (this.mapService.markers.length != 0) {
      for (const zoomMarker of this.mapService.markers) {
        zoomMarker.setLabel("");
      }
    }
    if (this.mapService.map.getZoom() >= 9) {
      for (let index = 0; index < this.mapService.markers.length; index++) {
        const element = this.mapService.markers[index];
        element.setLabel(this.placementData[index].truckRegno);
      }
    }
  }

  setEventInfo(event) {
    this.infoStart = new Date().getTime();
    if (this.infoWindow)
      this.infoWindow.close();
    this.infoWindow = this.mapService.createInfoWindow();
    this.infoWindow.opened = false;
    this.infoWindow.setContent(
      `
       <b>Vehicle:</b>${event.truckRegno}
       `
    );
    
    this.infoWindow.setPosition(
      this.mapService.createLatLng(event.latitude, event.longitude)
    ); 
    this.infoWindow.open(this.mapService.map);
    let bound = this.mapService.getMapBounds();
  }
  unsetEventInfo() {
    let diff = new Date().getTime() - this.infoStart;
    if (diff > 500) {
      this.infoWindow.close();
      this.infoWindow.opened = false;
    }
  }

}
