import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { ApiService } from "../../services/api.service";
import { CommonService } from '../../services/common.service';
import { DateService } from '../../services/date.service';

@Component({
  selector: 'route-mapper',
  templateUrl: './route-mapper.component.html',
  styleUrls: ['./route-mapper.component.scss']
})
export class RouteMapperComponent implements OnInit {

  slideToolTipLeft = 0;
  vehicleRegNo = null;
  title = 'Route Tracker';
  isLite = false;
  startTimePeriod = '00:00';
  endTimePeriod = '00:00';
  strSiteName = [];
  strHaltReason = [];
  getPlace = [];
  placeName = '';
  orderId = null;
  orderType = null;
  constructor(private modalService: NgbModal,
    private mapService: MapService,
    private apiService: ApiService,
    private activeModal: NgbActiveModal,
    private commonService: CommonService,
    public dateService: DateService) {
    this.startDate = new Date(this.commonService.params.fromTime);
    this.endDate = new Date(this.commonService.params.toTime);
    this.vehicleSelected = this.commonService.params.vehicleId;
    this.vehicleRegNo = this.commonService.params.vehicleRegNo;
    this.orderId = this.commonService.params.orderId;
    this.orderType = this.commonService.params.orderType;
    this.title = this.commonService.params.title ? this.commonService.params.title : this.title;

  }


  ngOnInit() {
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(0);
    this.mapService.map.setOptions({ draggableCursor: 'cursor' });
    setTimeout(() => {
      this.getHaltTrails();
      // this.getDistance();
    }, 500)
  }
  polypath = [
    {
      lat: null,
      lng: null,
      odo: null,
      time: null,
    }
  ];
  zoomLevel = 7;
  maxOdo = 0;

  get timeLinePoly() {
    let odoNow = this.maxOdo * (this.timelineValue / 100);
    if (this.timelineValue == 1) {
      return { time: this.commonService.dateFormatter(this.startDate), lat: parseFloat(this.polypath[0].lat), lng: parseFloat(this.polypath[0].lng) };
    }
    for (const polypoint of this.polypath) {
      if (polypoint.odo >= odoNow) {
        return { time: polypoint.time, lat: parseFloat(polypoint.lat), lng: parseFloat(polypoint.lng) };
      }
    };
    return { time: null, lat: null, lng: null };
  }

  startDate = null;
  endDate = null;
  vehicleSelected = null;
  vehicleEvents = [];
  timelineValue = 1;
  isPlay = false;

  getHaltTrails() {
    this.strHaltReason = [];
    this.strSiteName = [];
    this.clearAll();
    if (!(this.vehicleSelected && this.startDate && this.endDate) && !(this.orderId)) {
      this.commonService.showError("Fill All Params");
      return;
    }
    this.commonService.loading++;
    let params = {
      vehicleId: this.vehicleSelected,
      startDate: this.commonService.dateFormatter(this.startDate),
      endDate: this.commonService.dateFormatter(this.endDate),
      orderId: this.orderId,
      orderType: this.orderType
    }
    let subscription = this.apiService.post('HaltOperations/getvehicleEvents', params)
      .subscribe(res => {
        this.commonService.loading--;
        let vehicleEvents = res['data'].reverse();
        this.getPlaceName(vehicleEvents);
        this.getVehDistanceBwTime(vehicleEvents);
        subscription.unsubscribe();
      }, err => {
        this.commonService.loading--;
        console.error(err);
        subscription.unsubscribe();
      });
  }

  getVehDistanceBwTime(vehicleEvents) {
    let params = {
      'vehicleId': this.vehicleSelected,
      'startTime': this.commonService.dateFormatter(this.startDate),
      'toTime': this.commonService.dateFormatter(this.endDate),
      'orderId': this.orderId,
      'orderType': this.orderType
    }
    this.commonService.loading++;

    let subscription = this.apiService.post('Vehicles/getVehDistanceBwTime', { 'vehicleId': this.vehicleSelected, fromTime: params['startTime'], tTime: params['toTime'], orderId: this.orderId, orderType: this.orderType })
      .subscribe(resdist => {
        this.commonService.loading--;
        let distance = resdist['data'];
        if (distance > 0) {
          distance = Math.round((distance / 1000) * 100 / 100);
        } else {
          distance = 0;
        }
        this.title = "Distance: " + distance + " Kms";
        // this.getVehicleTrailAll(vehicleEvents, params)
        subscription.unsubscribe();
      }, err => {
        this.commonService.loading--;
        console.error(err);
        subscription.unsubscribe();
      });

    this.getVehicleTrailAll(vehicleEvents, params)
  }

  getVehicleTrailAll(vehicleEvents, params) {
    this.commonService.loading++;
    const subscription = this.apiService.post('VehicleTrail/getVehicleTrailAll', params)
      .subscribe(res => {
        this.commonService.loading--;
        if (res['code'] == 2)
          this.isLite = true;
        else
          this.isLite = false;
        this.mapService.clearAll();
        let i = 0;
        let prevElement = null;
        let total = 0;
        for (const element of res['data']) {

          if (i != 0) {
            let disS = this.commonService.distanceFromAToB
              (element.lat, element.long, prevElement.lat, prevElement.long, "Mt");
            let dis = disS;
            total += dis;
            this.polypath.push({
              lat: element.lat, lng: element.long,
              odo: total, time: element.time
            }
            );

          } else {
            this.polypath = [];
            this.polypath.push({ lat: element.lat, lng: element.long, odo: 0, time: element.time });
          }

          this.mapService.createPolyPathManual(this.mapService.createLatLng(element.lat, element.long), null, false);
          this.mapService.setBounds(this.mapService.createLatLng(element.lat, element.long));
          prevElement = element;
          i++;
        }
        this.maxOdo = total;

        this.mapService.polygonPath && this.mapService.polygonPath.set('icons', [{
          icon: this.mapService.lineSymbol,
          offset: "0%"
        }]);
        let realStart = new Date(vehicleEvents[0].start_time) < new Date(this.startDate) ?
          vehicleEvents[0].start_time : this.commonService.dateFormatter(this.startDate);
        let realEnd = null;
        if (vehicleEvents[0].end_time)
          realEnd = new Date(vehicleEvents[vehicleEvents.length - 1].end_time) > new Date(this.endDate) ?
            vehicleEvents[vehicleEvents.length - 1].end_time : this.commonService.dateFormatter(this.endDate);

        let totalHourDiff = 0;
        if (vehicleEvents.length != 0) {
          totalHourDiff = this.commonService.dateDiffInHours(realStart, realEnd, true);
        }

        for (let index = 0; index < vehicleEvents.length; index++) {
          if (vehicleEvents[index].halt_reason == "Unloading" || vehicleEvents[index].halt_reason == "Loading") {
            vehicleEvents[index].subType = 'marker';
            vehicleEvents[index].color = vehicleEvents[index].halt_reason == "Unloading" ? 'ff4d4d' : '88ff4d';
            vehicleEvents[index].rc = vehicleEvents[index].halt_reason == "Unloading" ? 'ff4d4d' : '88ff4d';
          }
          if (vehicleEvents[index].tolls) {
            vehicleEvents[index].subType = 'marker';
            vehicleEvents[index].color = '0000ff';
            vehicleEvents[index].rc = '0000ff';
          } else {
            vehicleEvents[index].color = "00ffff";
          }
          vehicleEvents[index].position = (this.commonService.dateDiffInHours(
            realStart, vehicleEvents[index].start_time) / totalHourDiff) * 98;
          vehicleEvents[index].width = (this.commonService.dateDiffInHours(
            vehicleEvents[index].start_time, vehicleEvents[index].end_time, true) / totalHourDiff) * 98;

          vehicleEvents[index].duration = this.commonService.dateDiffInHoursAndMins(
            vehicleEvents[index].start_time, vehicleEvents[index].end_time);
        }
        this.vehicleEvents = vehicleEvents;
        let markers = this.mapService.createMarkers(this.vehicleEvents, false, false);
        let markerIndex = 0
        for (const marker of markers) {
          let event = this.vehicleEvents[markerIndex];
          this.mapService.addListerner(marker, 'mouseover', () => this.setEventInfo(event));
          this.mapService.addListerner(marker, 'mouseout', () => this.unsetEventInfo());
          markerIndex++;
        }
        subscription.unsubscribe();
      }, err => {
        this.commonService.loading--;
        console.error(err);
        subscription.unsubscribe();
      });
  }

  clearAll() {
    this.slideToolTipLeft = 0;
    this.isLite = false;
    this.mapService.clearAll();
  }
  breakPrevious = false;

  setSliderPoint() {
    this.breakPrevious = true;
    this.isPlay = false;
    this.slideToolTipLeft = (document.getElementById('myRange').offsetWidth / 100) * this.timelineValue;
    this.mapService.polygonPath.set('icons', [{
      icon: this.mapService.lineSymbol,
      offset: this.timelineValue + "%"
    }]);
    this.zoomOnArrow(false);
  }

  async runLineSymbol() {
    if (!this.isPlay) {
      this.breakPrevious = true;
      return;
    }
    this.breakPrevious = false;
    for (let index = this.timelineValue; index <= 100; index++) {
      await this.sleep(100);
      this.mapService.polygonPath.set('icons', [{
        icon: this.mapService.lineSymbol,
        offset: index + "%"
      }]);
      this.slideToolTipLeft = (document.getElementById('myRange').offsetWidth / 100) * index;
      this.zoomOnArrow(false);
      this.timelineValue = index;
      if (this.breakPrevious) {
        break;
      }
    }
    if (!this.breakPrevious) {
      this.timelineValue = 0;
      this.mapService.polygonPath.set('icons', [{
        icon: this.mapService.lineSymbol,
        offset: this.timelineValue + "%"
      }]);
      this.zoomOnArrow();
      this.isPlay = false;
    }
  }

  zoomOnArrow(isEvent = true) {
    let bound = this.mapService.getMapBounds();
    if (isEvent || !((bound.lat1 + 0.001 <= this.timeLinePoly.lat && bound.lat2 - 0.001 >= this.timeLinePoly.lat) &&
      (bound.lng1 + 0.001 <= this.timeLinePoly.lng && bound.lng2 - 0.001 >= this.timeLinePoly.lng))) {
      this.mapService.zoomAt({ lat: this.timeLinePoly.lat, lng: this.timeLinePoly.lng }, isEvent ? this.zoomLevel : this.mapService.map.getZoom());
    }
  }

  eventInfo = null;
  infoWindow = null;
  infoStart = null;
  setEventInfo(event) {
    this.infoStart = new Date().getTime();
    if (this.infoWindow)
      this.infoWindow.close();
    this.infoWindow = this.mapService.createInfoWindow();
    this.infoWindow.opened = false;
    this.infoWindow.setContent(
      `
      <b> Reason: </b>${event.halt_reason} <br>
      <b>Loc: </b>${event.loc_name} <br>
      <b>Start Time:</b> ${event.start_time} <br>
      <b>End Time:</b>${event.end_time} <br>
      <b>Duration:</b>${event.duration} <br>
      `
    );
    this.infoWindow.setPosition(this.mapService.createLatLng(event.lat, event.long)); // or evt.latLng
    this.infoWindow.open(this.mapService.map);
    let bound = this.mapService.getMapBounds();

    // if (!((bound.lat1 + 0.001 <= event.lat && bound.lat2 - 0.001 >= event.lat) &&
    //   (bound.lng1 + 0.001 <= event.long && bound.lng2 - 0.001 >= event.long))) {
    //   this.mapService.zoomAt({ lat: event.lat, lng: event.lng }, this.zoomLevel);
    // }
  }
  unsetEventInfo() {
    let diff = new Date().getTime() - this.infoStart;
    if (diff > 500) {
      this.infoWindow.close();
      this.infoWindow.opened = false;
    }
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  openSmartTool(i, vehicleEvents) {
    this.vehicleEvents.forEach(vEvent => {
      if (vEvent != vehicleEvents)
        vEvent.isOpen = false;
    });
    vehicleEvents.isOpen = !vehicleEvents.isOpen;
    this.zoomFunctionality(i, vehicleEvents);
  }
  zoomFunctionality(i, vehicleEvents) {
    let latLng = this.mapService.getLatLngValue(vehicleEvents);
    let googleLatLng = this.mapService.createLatLng(latLng.lat, latLng.lng);
    this.mapService.zoomAt(googleLatLng);
  }

  setZoom(zoom, vehicleEvents) {
    this.mapService.zoomMap(zoom);
  }

  getPlaceName(E) {
    this.getPlace = [];
    let str_site_name, str_halt_reason;
    E.forEach((E) => {
      if (E.site_name != null) {
        str_site_name = E.site_name.toUpperCase();
      }
      if (E.halt_reason != null) {
        str_halt_reason = E.halt_reason.toUpperCase();
      }

      if ((str_site_name == "UNKNOWN") || (E.site_name == null)) {
        if (E.site_type != null) {
          if ((str_halt_reason != "UNKNOWN")) {
            this.placeName = E.site_type + '_' + E.halt_reason;
            this.getPlace.push(this.placeName);
          } else {
            this.placeName = E.site_type;
            this.getPlace.push(this.placeName);
          }
        } else if ((str_halt_reason != "UNKNOWN")) {
          this.placeName = E.halt_reason;
          this.getPlace.push(this.placeName);
        } else {
          this.placeName = 'Halt';
          this.getPlace.push(this.placeName);
        }
      } else if ((str_halt_reason != "UNKNOWN")) {
        if (str_site_name.substring(0, 7) == 'UNKNOWN') {
          this.placeName = str_site_name.split(',')[1] + '_' + E.halt_reason;
          this.getPlace.push(this.placeName);
        } else {
          this.placeName = E.site_name + '_' + E.halt_reason;
          this.getPlace.push(this.placeName);

        }

      } else {
        if (str_site_name.substring(0, 7) == 'UNKNOWN') {
          this.placeName = str_site_name.split(',')[1];
          this.getPlace.push(this.placeName);
        } else {
          this.placeName = E.site_name;
          this.getPlace.push(this.placeName);
        }

      }

    });
  }
  getDistance() {
    this.commonService.loading++;
    let params = {
      'vehicleId': this.vehicleSelected,
      'startTime': this.commonService.dateFormatter(this.startDate),
      'toTime': this.commonService.dateFormatter(this.endDate),
      'orderId': this.orderId,
      'orderType': this.orderType
    }
    console.log(params);
    this.apiService.post('Vehicles/getVehDistanceBwTime', { 'vehicleId': this.vehicleSelected, fromTime: params['startTime'], tTime: params['toTime'], orderId: this.orderId, orderType: this.orderType })
      .subscribe(resdist => {
        this.commonService.loading--;
        let distance = resdist['data'];
        if (distance > 0) {
          distance = Math.round((distance / 1000) * 100 / 100);
        } else {
          distance = 0;
        }
        // this.title = "Distance: " + distance + " Kms";
      }, err => {
        this.commonService.loading--;
        console.log(err); ////
      });
  }

  getTrails(vehicleEvents) {
    this.commonService.loading++;
    let params = {
      'vehicleId': this.vehicleSelected,
      'startTime': this.commonService.dateFormatter(this.startDate),
      'toTime': this.commonService.dateFormatter(this.endDate),
      'orderId': this.orderId,
      'orderType': this.orderType
    }
    this.apiService.post('VehicleTrail/getVehicleTrailAll', params)
      .subscribe(res => {
        this.commonService.loading--;
        if (res['code'] == 2)
          this.isLite = true;
        else
          this.isLite = false;
        this.mapService.clearAll();
        let i = 0;
        let prevElement = null;
        let total = 0;
        for (const element of res['data']) {

          if (i != 0) {
            let disS = this.commonService.distanceFromAToB
              (element.lat, element.long, prevElement.lat, prevElement.long, "Mt");
            let dis = disS;
            total += dis;
            this.polypath.push({
              lat: element.lat, lng: element.long,
              odo: total, time: element.time
            }
            );

          } else {
            this.polypath = [];
            this.polypath.push({ lat: element.lat, lng: element.long, odo: 0, time: element.time });
          }

          this.mapService.createPolyPathManual(this.mapService.createLatLng(element.lat, element.long), null, false);
          this.mapService.setBounds(this.mapService.createLatLng(element.lat, element.long));
          prevElement = element;
          i++;
        }
        this.maxOdo = total;
        this.title = "Distance: " + Math.round(this.maxOdo/1000) + " Kms";
        console.log("PolyLine", this.polypath);

        this.mapService.polygonPath && this.mapService.polygonPath.set('icons', [{
          icon: this.mapService.lineSymbol,
          offset: "0%"
        }]);
        let realStart = new Date(vehicleEvents[0].start_time) < new Date(this.startDate) ?
          vehicleEvents[0].start_time : this.commonService.dateFormatter(this.startDate);
        let realEnd = null;
        if (vehicleEvents[0].end_time)
          realEnd = new Date(vehicleEvents[vehicleEvents.length - 1].end_time) > new Date(this.endDate) ?
            vehicleEvents[vehicleEvents.length - 1].end_time : this.commonService.dateFormatter(this.endDate);
        console.log("RealStart", realStart, "RealEnd", realEnd);

        let totalHourDiff = 0;
        if (vehicleEvents.length != 0) {
          totalHourDiff = this.commonService.dateDiffInHours(realStart, realEnd, true);
          console.log("Total Diff", totalHourDiff);
        }

        for (let index = 0; index < vehicleEvents.length; index++) {
          if (vehicleEvents[index].halt_reason == "Unloading" || vehicleEvents[index].halt_reason == "Loading") {
            vehicleEvents[index].subType = 'marker';
            vehicleEvents[index].color = vehicleEvents[index].halt_reason == "Unloading" ? 'ff4d4d' : '88ff4d';
            vehicleEvents[index].rc = vehicleEvents[index].halt_reason == "Unloading" ? 'ff4d4d' : '88ff4d';
          }
          if (vehicleEvents[index].tolls) {
            vehicleEvents[index].subType = 'marker';
            vehicleEvents[index].color = '0000ff';
            vehicleEvents[index].rc = '0000ff';
          } else {
            vehicleEvents[index].color = "00ffff";
          }
          vehicleEvents[index].position = (this.commonService.dateDiffInHours(
            realStart, vehicleEvents[index].start_time) / totalHourDiff) * 98;
          vehicleEvents[index].width = (this.commonService.dateDiffInHours(
            vehicleEvents[index].start_time, vehicleEvents[index].end_time, true) / totalHourDiff) * 98;
          console.log("Width", vehicleEvents[index].width);

          vehicleEvents[index].duration = this.commonService.dateDiffInHoursAndMins(
            vehicleEvents[index].start_time, vehicleEvents[index].end_time);
        }
        console.log("vehicleEvents", vehicleEvents);
        this.vehicleEvents = vehicleEvents;
        let markers = this.mapService.createMarkers(this.vehicleEvents, false, false);
        let markerIndex = 0
        for (const marker of markers) {
          let event = this.vehicleEvents[markerIndex];
          this.mapService.addListerner(marker, 'mouseover', () => this.setEventInfo(event));
          this.mapService.addListerner(marker, 'mouseout', () => this.unsetEventInfo());
          markerIndex++;
        }
      }, err => {
        this.commonService.loading--;
        console.log(err); ////
      });
  }
}
