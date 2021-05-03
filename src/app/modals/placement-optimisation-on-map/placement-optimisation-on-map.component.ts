import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { MapService } from "../../services/map.service";
import { isArray } from 'rxjs/internal/util/isArray';

@Component({
  selector: 'placement-optimisation-on-map',
  templateUrl: './placement-optimisation-on-map.component.html',
  styleUrls: ['./placement-optimisation-on-map.component.scss']
})
export class PlacementOptimisationOnMapComponent implements OnInit {

  placementData = [];
  headingData = [];
  vehCostPacketData = [];
  combinedData = [];
  markers = [];
  marker1 = [];
  
  selected = {
    markerCluster: false
  };
  markerCluster: any;
  constructor(
    public mapService: MapService,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private activeModal: NgbActiveModal
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1200');
    this.placementData = this.common.params.data;
    console.log("allPlacementData:", this.placementData);
    this.showData();
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("placement-map");
  }

  showData() {
    console.log("test:", this.placementData['siteVehicleCostPackets']);
    this.placementData['siteVehicleCostPackets'].forEach((element, index) => {
      this.headingData.push(
        {
          lat: element.siteLatitude,
          lng: element.siteLongitude,
          siteName: element.siteName,
          type: 'site',
          color: '00FF00'
        });
      this.vehCostPacketData.push(element.vehicleCostPacket);
    });
    console.log('headingArray:', this.headingData);
    console.log('cominedArray:', this.vehCostPacketData);
    this.mapService.clearAll();
    setTimeout(() => {
      this.mapService.setMapType(0);
      console.log("combinedArray:", this.vehCostPacketData);
      for (let i = 0; i < this.vehCostPacketData.length; i++) {
        console.log("condition:", Array.isArray(this.vehCostPacketData[i]))
        if (Array.isArray(this.vehCostPacketData[i])) {
          this.vehCostPacketData[i].forEach(element => {
            this.combinedData.push(element);
          });
          console.log("newArray:", this.combinedData);
        } else {
          this.combinedData.push(this.vehCostPacketData[i]);
        }
      }

      this.markers = this.mapService.createMarkers(this.combinedData).map((marker, index) => {
        const vehicle = this.combinedData[index];
        marker.setTitle(vehicle.truckRegno);
        return {marker:marker };
      });
      this.marker1=this.mapService.createMarkers(this.headingData).map((siteMarker,i) =>{
        const siteDetails=this.headingData[i];
        siteMarker.setTitle(siteDetails.siteName);
        return {marker:siteMarker};
      });
      console.log("marker:",this.markers);
      console.log("siteMarkers:",this.marker1);
      console.log("markers:", this.markers);
    }, 1000);
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  handleMarkerCluster(ischecked,index,data) {
    console.log("isChecked",ischecked);
    console.log("index",index);
    console.log("data",data);
    this.selected.markerCluster=ischecked;
    if (this.selected.markerCluster) {
      this.showclustering();
    } else {
      console.log("test");
      this.clearCluster();
      this.markers= this.mapService.createMarkers(this.markers);
    }
  }

  showclustering() {
    this.markers=[];
    
    console.log("Test");
    console.log("Markers:",this.markers);
    this.markerCluster = this.mapService.createCluster(this.markers, true);
    console.log("markerCluster:",this.markerCluster);
  }

  clearCluster() {
    if (this.markerCluster)
      this.markerCluster.clearMarkers();
  }

  selectid(event){
    console.log("data:",event);
  }


}
