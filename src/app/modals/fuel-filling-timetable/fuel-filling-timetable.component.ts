import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import * as _ from 'lodash';
import { DateService } from '../../services/date/date.service';

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
  fuelFillingData = [];
  markers = [];
  marker = [];
  fuelMarkers = [];
  latlong = [{ lat: null, long: null, color: null, subType: null }];
  locallatlong = {
    lat: null,
    long: null,
  };
  time = null;
  trailsData = [];
  infoWindow = null;
  insideInfo = null;
  constructor(
    public common: CommonService,
    public datePipe: DateService,
    public api: ApiService,
    private activeModal: NgbActiveModal,
    public mapService: MapService) {
    this.common.handleModalSize('class', 'modal-lg', '1344', 'px', 1);
    if (this.common.params && this.common.params.fuelTimeTable) {
      this.title = this.common.params.fuelTimeTable.title;
      this.regno = this.common.params.fuelTimeTable.regno;
      this.vehicleId = this.common.params.fuelTimeTable.vehicleId;
      this.startTime = this.common.dateFormatter(this.common.params.fuelTimeTable.startTime);
      this.endTime = this.common.dateFormatter(this.common.params.fuelTimeTable.endTime);
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
        this.locallatlong.lat = evt.latLng.lat();
        this.locallatlong.long = evt.latLng.lng();
        this.getClosedLatLong();
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
  }


  getFuelFillingData() {
    let params = "vehicleId=" + this.vehicleId + "&startTime=" + this.startTime + "&exitTime=" + this.endTime;
    this.common.loading++;
    this.api.get('Fuel/getFSEWrtVeh?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("res", res);
        this.fuelFillingData = res['data'];
        if (this.fuelFillingData && this.fuelFillingData.length) {
          this.fuelFillingData.map(fuel => {
            fuel['subType'] = 'marker';
            return this.fuelFillingData.push(fuel);
          });
          this.createPolyPath();

        }
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
        this.mapService.createMarkers(this.fuelFillingData, false, true);
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
        // let markerIndex = 0
        // for (const marker of this.mapService.markers) {
        //   let event = this.fuelFillingData[markerIndex];
        //   this.mapService.addListerner(marker, 'mouseover', () => this.setEventInfo(event));
        //   this.mapService.addListerner(marker, 'mouseout', () => this.unsetEventInfo());
        //   markerIndex++;
        // }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  checkFuelData(fuel, index) {
    console.log("fuel", fuel);
    this.mapService.zoomAt({ lat: fuel._lat, lng: fuel._long }, 10);
  }

  getClosedLatLong() {
    let distance: any;
    let sortedData = [];
    this.trailsData.forEach(element => {
      distance = this.common.distanceFromAToB(element.lat, element.long, this.locallatlong.lat, this.locallatlong.long, 'K');
      if (distance <= 1) {
        element['distance'] = distance;
        return sortedData.push(element);
      }
    });
    let object = _.first(_.sortBy(sortedData, ['distance'], ['asc']));
    if (object) {
      console.log("Sorted Data ", object);
      this.createMarkers(object.lat, object.long);
      this.getFuelStation(object.lat, object.long);
      this.time = object.time;
    }
    else {
      this.common.showError("No GPS Data, Near Space");
    }

  }

  getFuelStation(lat, lng) {
    const params = "lat=" + lat +
      "&long=" + lng;
    this.common.loading++;
    this.api.get('fuel/getAllSiteWrtFuelStation?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.fuelMarkers = res['data'];
        if (this.markers.length) {
          this.mapService.resetMarker(true, true, this.markers);
        }
        this.markers = this.mapService.createMarkers(this.fuelMarkers);
        this.mapService.zoomAt({ lat: lat, lng: lng }, 10);
        let markerIndex = 0
        for (const marker of this.mapService.markers) {
          let event = this.fuelMarkers[markerIndex];
          this.mapService.addListerner(marker, 'mouseover', () => this.setEventInfo(event));
          this.mapService.addListerner(marker, 'mouseout', () => this.unsetEventInfo());
          markerIndex++;
        }
      }, err => {
        this.common.showError("Error occurred");
        this.common.loading--;
        console.log(err);
      });

  }

  setEventInfo(event) {
    this.insideInfo = new Date().getTime();
    if (this.infoWindow) {
      this.infoWindow.close();
    }
    this.infoWindow = this.mapService.createInfoWindow();
    this.infoWindow.opened = false;
    this.infoWindow.setContent(`
    <p>Site Id :${event.id}</p>
    <p>Pump Name :${event.name}</p>`);
    this.infoWindow.setPosition(this.mapService.createLatLng(event.lat, event.long));
    this.infoWindow.open(this.mapService.map);
  }


  async unsetEventInfo() {
    let diff = new Date().getTime() - this.insideInfo;
    if (diff > 200) {
      this.infoWindow.close();
      this.infoWindow.opened = false;
    }
  }

  saveTime() {
    this.activeModal.close({ time: this.time });
  }
}
