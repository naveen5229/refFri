import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../services/user.service';
import { MapService } from "../../services/map.service";
import { isArray } from 'rxjs/internal/util/isArray';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

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
  clusterChecked: false;
  vehicleMarkes = [];
  siteMarkers = [];
  colorArray = [];


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
          color: '00FF00',
          dayIndex: element.dayIndex,
          vehicleCostPacket: element.vehicleCostPacket,
          index: index,
          vehicleMarkes: [],
          siteMarkers: [],
        });
      // this.vehCostPacketData.push(element.vehicleCostPacket);
    });
    this.getRandomColor();
    // console.log('headingArray:', this.headingData);
    // console.log('cominedArray:', this.vehCostPacketData);
    // this.mapService.clearAll();
    // setTimeout(() => {
    //   this.mapService.setMapType(0);
    //   console.log("combinedArray:", this.vehCostPacketData);
    //   for (let i = 0; i < this.vehCostPacketData.length; i++) {
    //     console.log("condition:", Array.isArray(this.vehCostPacketData[i]))
    //     if (Array.isArray(this.vehCostPacketData[i])) {
    //       this.vehCostPacketData[i].forEach(element => {
    //         this.combinedData.push(element);
    //       });
    //       console.log("newArray:", this.combinedData);
    //     } else {
    //       this.combinedData.push(this.vehCostPacketData[i]);
    //     }
    //   }

    //   this.markers = this.mapService.createMarkers(this.combinedData).map((marker, index) => {
    //     const vehicle = this.combinedData[index];
    //     marker.setTitle(vehicle.truckRegno);
    //     return {marker:marker };
    //   });
    //   this.marker1=this.mapService.createMarkers(this.headingData).map((siteMarker,i) =>{
    //     const siteDetails=this.headingData[i];
    //     siteMarker.setTitle(siteDetails.siteName);
    //     return {marker:siteMarker};
    //   });
    //   console.log("marker:",this.markers);
    //   console.log("siteMarkers:",this.marker1);
    //   console.log("markers:", this.markers);
    // }, 1000);
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  handleMarkerCluster(data, index) {

    console.log('index is: ', index);
    console.log('data is: ', data);
    console.log('heading data:', this.headingData[index]);





    if (data === true) {
      this.showclustering(index);
    } else {
      this.clearCluster(index)
    }
  }

  showclustering(index) {

    console.log("index", index);

    let vehicleCostPacketData = [];

    this.headingData[index]['vehicleCostPacket'].forEach(element => {
      vehicleCostPacketData.push({
        lat: element.latitude,
        long: element.longitude,
        truckRegno: element.truckRegno,
        type: 'vehicles',
        color: this.colorArray[index]
      })
    });

    let siteData = [];
    siteData.push({
      lat: this.headingData[index].lat,
      lng: this.headingData[index].lng,
      siteName: this.headingData[index].siteName,
      type: this.headingData[index].type,
      color: this.headingData[index].color
    });

    this.headingData[index].vehicleMarkes = this.mapService.createMarkers(vehicleCostPacketData).map((marker, index) => {
      const vehicle = vehicleCostPacketData[index];
      marker.setTitle(vehicle.truckRegno);
      return { marker: marker };
    });


    this.headingData[index].siteMarkers = this.mapService.createMarkers(siteData).map((marker, index) => {
      const vehicle = siteData[index];
      marker.setTitle(vehicle.siteName);
      return { marker: marker };
    });

  }

  clearCluster(index) {

    console.log('inside clear cluster: ', index)
    if (this.headingData[index].siteMarkers && this.headingData[index].vehicleMarkes) {
      this.mapService.resetMarkerNested(true, true, this.headingData[index].vehicleMarkes);
      this.mapService.resetMarkerNested(true, true, this.headingData[index].siteMarkers);

      this.headingData[index].vehicleMarkes = [];
      this.headingData[index].siteMarkers = [];
    }
  }

  selectid(event) {
    console.log("data:", event);
  }

  getRandomColor() {
   this.colorArray = []
    for(let i=0; i<this.headingData.length; i++){
      var letters = '0123456789ABCDEF'.split('');
      let color = ''
      for (var  j= 0; j < 6; j++) {
        color += letters[Math.round(Math.random() * 15)];
      }
      this.colorArray.push(color);
    }
    return this.colorArray;
  }
}
