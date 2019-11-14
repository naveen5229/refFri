import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import * as _ from 'lodash';
import { DateService } from '../../services/date/date.service';
import { GeometryService } from '../../services/geometry/geometry.service';

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
  fuelFillingMarkers = [];
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
  polyLineXY = [{
    x: null,
    y: null,
    time: new Date()
  }]
  constructor(
    public common: CommonService,
    public datePipe: DateService,
    public api: ApiService,
    private activeModal: NgbActiveModal,
    public geometry: GeometryService,
    public mapService: MapService) {
    this.common.handleModalSize('class', 'modal-lg', '1344', 'px', 1);
    if (this.common.params && this.common.params.fuelTimeTable) {
      this.title = this.common.params.fuelTimeTable.title;
      this.regno = this.common.params.fuelTimeTable.regno;
      this.vehicleId = this.common.params.fuelTimeTable.vehicleId;
      this.startTime = this.common.dateFormatter(this.common.params.fuelTimeTable.startTime);
      this.endTime = this.common.dateFormatter(this.common.params.fuelTimeTable.endTime);
      this.getFuelFillingData();
      this.createPolyPath();
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
        this.fuelFillingMarkers = this.mapService.createMarkers(this.fuelFillingData, false, true);
        let i = 0;
        let prevElement = null;
        let tempTrail = res['data'];
        console.log("api Data", tempTrail);
        this.polyLineXY = [];
        for (let i = 0; i < tempTrail.length - 1; i++) {
          const curr = tempTrail[i];
          const next = tempTrail[i + 1];
          if (curr.lat != next.lat || curr.long != next.long) {
            this.trailsData.push(curr);
          }
        }
        this.trailsData.push(tempTrail[tempTrail.length - 1]);
        this.trailsData.map((element, index) => {
          element['previous'] = index ? Object.assign({}, this.trailsData[index - 1]) : null,
            element['next'] = index < this.trailsData.length - 1 ? Object.assign({}, this.trailsData[index + 1]) : null
          if (element['previous']) {
            delete element['previous']['previous']
            delete element['previous']['next']
          }
        });
        for (const element of this.trailsData) {
          this.polyLineXY.push({ x: element.lat, y: element.long, time: element.time });
          this.mapService.createPolyPathManual(this.mapService.createLatLng(element.lat, element.long));
          this.mapService.setBounds(this.mapService.createLatLng(element.lat, element.long));
          prevElement = element;
          i++;
        }
        console.log("Trails", this.polyLineXY);

        this.mapService.addListerner(this.mapService.polygonPath, 'click', event => {
          this.locallatlong.lat = event.latLng.lat();
          this.locallatlong.long = event.latLng.lng();
          this.getClosedLatLong();
        });
        this.mapService.polygonPath && this.mapService.polygonPath.set('icons', [{
          icon: this.mapService.lineSymbol,
          offset: "0%"
        }]);
        let markerIndex = 0
        for (const marker of this.fuelFillingMarkers) {
          let event = this.fuelFillingData[markerIndex];
          this.mapService.addListerner(marker, 'mouseover', () => this.setEventInfo(event));
          this.mapService.addListerner(marker, 'mouseout', () => this.unsetEventInfo());
          markerIndex++;
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  getClosedLatLong() {
    let distance: any;
    let point = {
      x: null,
      y: null
    };
    let marker = {
      lat: null,
      long: null,
      ratio: null

    }
    let resultData: any;
    let t1: any;
    let t2: any;
    point = {
      x: this.locallatlong.lat,
      y: this.locallatlong.long
    };
    if (point) {
      console.log("point", point);
      console.log("polyLine", this.polyLineXY);
      resultData = this.geometry.getClosestPointOnLines(point, this.polyLineXY);
      marker.lat = resultData.x, marker.long = resultData.y, marker.ratio = resultData.fTo;
      console.log("closed point", this.geometry.getClosestPointOnLines(point, this.polyLineXY));
      this.createMarkers(marker.lat, marker.long);
      this.getFuelStation(marker.lat, marker.long);
      t1 = new Date(resultData.pointTime).getTime();
      t2 = new Date(resultData.previousPointTime).getTime();
      console.log("t1", t1);
      console.log("t2", t2);
      this.time = new Date(t1 + (marker.ratio * (t2 - t1)));
      console.log("time", this.time);

    }
  }

  getFuelStation(lat, lng) {
    const params = "lat=" + lat + "&long=" + lng;
    this.common.loading++;
    this.api.get('fuel/getAllSiteWrtFuelStation?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.fuelMarkers = res['data'];
        if (this.markers.length) {
          this.mapService.resetMarker(true, true, this.markers);
        }
        this.markers = this.mapService.createMarkers(this.fuelMarkers, false, false);
        this.mapService.centerAt(this.mapService.createLatLng(lat, lng));
        let markerIndex = 0
        for (const marker of this.markers) {
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
    if (event.id || event.site_id) {
      this.insideInfo = new Date().getTime();
      if (this.infoWindow) {
        this.infoWindow.close();
      }
      this.infoWindow = this.mapService.createInfoWindow();
      this.infoWindow.opened = false;
      this.infoWindow.setContent(`
      <p>Site Id :${event.id || event.site_id}</p>
      <p>Pump Name :${event.name}</p>`);
      this.infoWindow.setPosition(this.mapService.createLatLng(event.lat, event.long));
      this.infoWindow.open(this.mapService.map);
    }
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
  checkFuelData(fuel, index) {
    console.log("fuel", fuel);
    this.mapService.zoomAt(this.mapService.createLatLng(fuel._lat, fuel._long), 10);
  }

}
