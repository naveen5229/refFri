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
  placementData = [];
  headingData=[];
  infoWindow = null;
  infoStart = null;
  isZoomed = false;
  selected = {
    markerCluster: false
  };
  markerCluster: any;
  markers = [];

  constructor(
    public mapService: MapService,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal
  ) {
      this.placementData = this.common.params.data;
      this.headingData=[{
      latitude:this.common.params.latitude,
      longitude:this.common.params.longitude,
      title:this.common.params.regno,
      type:'site',
      color:'00FF00'
    }]
  }



  ngOnInit(): void {
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  


  ngAfterViewInit() {
    this.mapService.mapIntialize("placement-map");
    this.mapService.clearAll();
    setTimeout(() => {
      this.mapService.setMapType(0);
      // this.placementData.map(e=>{return e.title = e.truckRegno;});
      // console.log("Testing-data:",this.placementData);
      this.markers=this.mapService.createMarkers(this.placementData).map((siteMarker,i) =>{
        const siteDetails=this.placementData[i];
        siteMarker.setTitle(siteDetails.truckRegno);
        return {marker:siteMarker};
      });
    }, 1000);
    this.mapService.createMarkers(this.headingData);
  }

  handleMarkerCluster() {
    console.log('this.selected.markerCluster', this.selected.markerCluster);
    if (this.selected.markerCluster) {
      this.showclustering();
    } else {
      this.clearCluster();
      this.markers= this.mapService.createMarkers(this.placementData)
      // .map((siteMarker,i) =>{
      //   const siteDetails=this.placementData[i];
      //   siteMarker.setTitle(siteDetails.truckRegno);
      //   return {marker:siteMarker};
      // });
    }
  }

  showclustering() {
    this.markerCluster = this.mapService.createCluster(this.markers, true);
  }

  clearCluster() {
    if (this.markerCluster)
      this.markerCluster.clearMarkers();
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
