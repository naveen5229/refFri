import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import * as _ from 'lodash';

@Component({
  selector: 'fuel-filling-timetable',
  templateUrl: './fuel-filling-timetable.component.html',
  styleUrls: ['./fuel-filling-timetable.component.scss']
})
export class FuelFillingTimetableComponent implements OnInit {
  title = '';
  regno = '';
  vehicleId = null;
  startTime = new Date();
  endTime = new Date();
  isOpen = false;
  fuelFillingData = [];
  markers = [];
  marker = [];
  latlong = [{ lat: null, long: null, color: null, subType: null }];
  trailsData = [];
  constructor(
    public common: CommonService,
    private datePipe: DatePipe,
    public api: ApiService,
    private activeModal: NgbActiveModal,
    public mapService: MapService) {
    this.common.handleModalSize('class', 'modal-lg', '1344', 'px', 1);
    if (this.common.params && this.common.params.fuelTimeTable) {
      this.title = this.common.params.fuelTimeTable.title;
      this.regno = this.common.params.fuelTimeTable.regno;
      this.vehicleId = this.common.params.fuelTimeTable.vehicleId;
      this.startTime = this.common.dateFormatter(this.common.params.fuelTimeTable.startTime);
      this.endTime = this.common.dateFormatter(this.common.params.fuelTimeTable.endTime.setHours(23, 59, 59, 0));
      this.getFuelFillingData();
    }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(0);
    this.mapService.zoomMap(5);
    this.mapService.map.setOptions({ draggableCursor: 'cursor' });
    setTimeout(() => {
      this.mapService.addListerner(this.mapService.map, 'click', evt => {
        this.createMarkers(evt.latLng.lat(), evt.latLng.lng());
      });
    }, 1000);
  }

  closeModal() {
    this.activeModal.close(false);
  }

  createMarkers(lat, long) {
    this.latlong = [{
      lat: lat,
      long: long,
      color: '0000FF',
      subType: 'marker'
    }];
    if (this.marker.length) {
      this.marker[0].setMap(null);
    }
    this.marker = this.mapService.createMarkers(this.latlong, false, false);
    this.getClosedLatLong();
  }


  getFuelFillingData() {
    let params = "vehicleId=" + this.vehicleId + "&startTime=" + this.startTime + "&exitTime=" + this.endTime;
    this.common.loading++;
    this.api.get('Fuel/getFSEWrtVeh?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("res", res);
        this.fuelFillingData = res['data'];
        console.log("fuel Data:", this.fuelFillingData);
        this.createPolyPath();
      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });
  }

  createPolyPath() {
    let params = {
      vehicleId: this.vehicleId,
      startTime: this.startTime,
      toTime: this.endTime,
    }
    this.common.loading++;
    this.api.post('VehicleTrail/getVehicleTrailAll', params)
      .subscribe(res => {
        this.common.loading--;
        this.mapService.clearAll();
        let i = 0;
        let prevElement = null;
        let total = 0;
        this.trailsData = res['data'];
        for (const element of res['data']) {
          this.mapService.createPolyPathManual(this.mapService.createLatLng(element.lat, element.long));
          this.mapService.setBounds(this.mapService.createLatLng(element.lat, element.long));
          prevElement = element;
          i++;
        }
        this.mapService.polygonPath && this.mapService.polygonPath.set('icons', [{
          icon: this.mapService.lineSymbol,
          offset: "0%"
        }]);
        this.mapService.createMarkers(this.fuelFillingData, false, true);
        let markerIndex = 0
        for (const marker of this.mapService.markers) {
          let event = this.fuelFillingData[markerIndex];
          // this.mapService.addListerner(marker, 'mouseover', () => this.setEventInfo(event));
          // this.mapService.addListerner(marker, 'mouseout', () => this.unsetEventInfo());
          markerIndex++;
        }
      }, err => {
        this.common.loading--;
        console.log(err); ////
      });


  }

  checkFuelData(index, fuel) {
    this.isOpen = true;
    console.log(index, fuel);
  }

  getClosedLatLong() {
    this.trailsData;
    let distance: any;
    let sortedData = [];


    this.trailsData.forEach((element, index) => {
      distance = this.common.distanceFromAToB(element.lat, element.long, this.latlong[0].lat, this.latlong[0].long, 'K');
      if (distance <= 50) {
        element['distance'] = distance;
        return sortedData.push(element);
      }
    });

    let object = _.sortBy(sortedData, ['distance'], ['asc']);
    console.log("Sorted ", object);

    // let object = this.trailsData.filter(element => {
    //   distance = this.common.distanceFromAToB(element.lat, element.long, this.latlong[0].lat, this.latlong[0].long, 'K');
    //   return distance;
    // }).sort(function (a, b) {
    //   return b.distance - a.distance;
    // });
    // console.log("distance", distance);
    // console.log("Trails Data", object);

  }

}
