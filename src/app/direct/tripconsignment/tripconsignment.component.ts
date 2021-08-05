import { Component, OnInit,ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { DataService } from '../../services/data.service';
import { ApiService } from '../../services/api.service';
import * as moment from 'moment';

@Component({
  selector: 'tripconsignment',
  templateUrl: './tripconsignment.component.html',
  styleUrls: ['./tripconsignment.component.scss']
})
export class TripconsignmentComponent implements OnInit {
  data:any;
  tripid = 888291;
  tripvehicle = 'RJ14GH5991';
  vehicleEvents:any;
  vehicleSelected = null;
  strSiteName = [];
  strHaltReason = [];
  slideToolTipLeft = 0;
  isLite = false;
  startDate = null;
  endDate = null;
  orderId = null;
  orderType = null;
  trails = [];
  trailsAll = [];
  subTrailsPolyLines = [];
  vehicleTrailEvents = [];
  redSubTrails = [];
  blueSubTrails = [];
  circles = [];
  circleCenter = [];
  vehicleTripId = null;
  latLngArr = []
  getPlace = [];
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
  title = 'Route Tracker';
  timelineValue = 1;
  isPlay = false;
  eventInfo = null;
  infoWindow = null;
  infoStart = null;
  placeName = '';
  breakPrevious = false;

  constructor(private mapService: MapService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private user: UserService,
    private router: Router,
    private dataService: DataService,
    private api: ApiService,
    private cdr: ChangeDetectorRef,) { 
      console.log('nput trip consignmnt');
      this.showData();
    }
    ngOnDestroy() {
      this.subTrailsPolyLines.forEach(polyline => polyline.setMap(null));
      this.mapService.events.next({ type: 'closed' });
    }
  ngOnInit(): void {
  }
  // ngAfterViewInit() {
  //   document.getElementById('nb-global-spinner').style.display = 'none';
  // }
  
  aftergetcallinitilize() {
    document.getElementById('nb-global-spinner').style.display = 'none';
    this.mapService.mapIntialize("route-mapper-map");
    this.mapService.setMapType(0);
    this.mapService.map.setOptions({ draggableCursor: 'cursor' });
    this.initFunctionality();

  }
  showData() {
    // console.info('Login Params:', this.queryStringParam);
  
    this.commonService.loading++;
    this.api.post('TripConsignment/GetTripConsignment',{tripid:this.tripid,vehicle:this.tripvehicle})
      .subscribe((res: any) => {
        console.log("respose:", res);
        if (res['success']) {
          this.commonService.loading--;
          // this.data = JSON.parse(res['data']).map(x => {
          //   let vehicle = x.Vehicle;
          //   delete x.Vehicle;
          //   return { vehicle, _lngt: x._long, ...x };
          // });
          this.data = res['data'][0];
          this.vehicleSelected = this.data._vid;
          this.startDate = this.data._start_time;
          this.endDate = this.data._end_time;
          this.vehicleTripId = this.data._tripid;
          console.log("Data:", res['data']);
          this.aftergetcallinitilize();
        } else {
          //this.msg = res.msg;
          this.commonService.loading--;
        }
      });
  }
 clearAll() {
    this.slideToolTipLeft = 0;
    this.isLite = false;
    this.mapService.clearAll();
  }
  initFunctionality() {
    if (!this.validateDates()) return;
    let promises = [this.getHaltTrails(), this.getVehicleTrailAll()]
    Promise.all(promises).then((result) => {
      this.getSingleTripInfoForView();
      console.log('vehicleEvents', this.vehicleEvents);
      console.log('vehicleEvents', this.vehicleTrailEvents);
      this.vehicleEvents.push(...this.vehicleTrailEvents);
      this.vehicleEvents = this.vehicleEvents.sort((a, b) => a.start_time < b.start_time ? -1 : 1);
      this.getPlaceName(this.vehicleEvents);

      console.timeEnd('api time');
      console.time('execution');
      this.mapService.clearAll();
      if (this.trails.length > 1) {
        if (new Date(this.trails[0].time) > new Date(this.trails[1].time)) {
          this.trails.reverse();
        }
      }
      let i = 0;
      let prevElement = null;
      let total = 0;
      for (let index = 0; index < this.trails.length; index++) {
        const element = this.trails[index];
        if (i) {
          total += this.commonService.distanceFromAToB(element.lat, element.long, prevElement.lat, prevElement.long, "Mt");
          this.polypath.push({
            lat: element.lat, lng: element.long,
            odo: total, time: element.time
          });
        } else {
          this.polypath = [];
          this.polypath.push({ lat: element.lat, lng: element.long, odo: 0, time: element.time });
        }

        this.mapService.createPolyPathManual(this.mapService.createLatLng(element.lat, element.long), null, false);
        this.mapService.setBounds(this.mapService.createLatLng(element.lat, element.long));
        prevElement = element;
        i++;
      }
      if (this.trailsAll && this.trailsAll.length) {
        i = 0;
        prevElement = null;
        let total = 0;
        this.polypath = [];
        for (let index = 0; index < this.trailsAll.length; index++) {
          const element = this.trailsAll[index];
          if (i) {
            total += this.commonService.distanceFromAToB(element.lat, element.long, prevElement.lat, prevElement.long, "Mt");
            this.polypath.push({
              lat: element.lat, lng: element.long,
              odo: total, time: element.time
            });
          } else {
            this.polypath = [];
            this.polypath.push({ lat: element.lat, lng: element.long, odo: 0, time: element.time });
          }

          // this.mapService.createPolyPathManual(this.mapService.createLatLng(element.lat, element.long), null, false);
          // this.mapService.setBounds(this.mapService.createLatLng(element.lat, element.long));
          prevElement = element;
          i++;
        }
      }

      this.maxOdo = total;
      this.title = "Distance : " + Math.round(this.maxOdo / 1000) + " KMs";
      this.mapService.polygonPath && this.mapService.polygonPath.set('icons', [{
        icon: this.mapService.lineSymbol,
        offset: "0%"
      }]);

      let realStart = new Date(this.vehicleEvents[0].start_time) < new Date(this.startDate) ? this.vehicleEvents[0].start_time : this.commonService.dateFormatter(this.startDate);
      let realEnd = null;

      if (this.vehicleEvents[0].end_time)
        realEnd = new Date(this.vehicleEvents[this.vehicleEvents.length - 1].end_time) > new Date(this.endDate) ?
          this.vehicleEvents[this.vehicleEvents.length - 1].end_time : this.commonService.dateFormatter(this.endDate);

      let totalHourDiff = 0;

      if (this.vehicleEvents.length != 0) {
        totalHourDiff = this.commonService.dateDiffInHours(realStart, realEnd, true);
      }
      let trailIndex = 0;
      let prevOdo = 0;
      for (let index = 0; index < this.vehicleEvents.length; index++) {
        this.vehicleEvents[index]["subType"] = "marker";
        for (let indexInner = trailIndex; indexInner < this.polypath.length; indexInner++) {
          const element = this.polypath[indexInner];
          if (new Date(element.time) >= new Date(this.vehicleEvents[index].start_time)) {
            trailIndex = indexInner;
            this.vehicleEvents[index]["odo"] = Math.round((element.odo - prevOdo) / 1000);
            this.vehicleEvents[index]["grand"] = Math.round(element.odo / 1000);
            prevOdo = element.odo;
            break;
          }
        }
        if (this.vehicleEvents[index].halt_reason == "Unloading" || this.vehicleEvents[index].halt_reason == "Loading") {
          this.vehicleEvents[index].subType = 'marker';
          this.vehicleEvents[index].color = this.vehicleEvents[index].halt_reason == "Unloading" ? 'ff4d4d' : '88ff4d';
          this.vehicleEvents[index].rc = this.vehicleEvents[index].halt_reason == "Unloading" ? 'ff4d4d' : '88ff4d';
        } else {
          this.vehicleEvents[index].rc = this.vehicleEvents[index].site_id ? '00b8e6' : 'FFFF00';
        }
        if (this.vehicleEvents[index].tolls) {
          this.vehicleEvents[index].subType = 'marker';
          this.vehicleEvents[index].color = '0000ff';
          this.vehicleEvents[index].rc = '0000ff';
        } else {
          this.vehicleEvents[index].color = "00ffff";
        }
        this.vehicleEvents[index].position = (this.commonService.dateDiffInHours(
          realStart, this.vehicleEvents[index].start_time) / totalHourDiff) * 98;
        this.vehicleEvents[index].width = (this.commonService.dateDiffInHours(
          this.vehicleEvents[index].start_time, this.vehicleEvents[index].end_time ? this.vehicleEvents[index].end_time : realEnd, true) / totalHourDiff) * 98;
        this.vehicleEvents[index].duration = this.vehicleEvents[index].end_time ? this.commonService.dateDiffInHoursAndMins(
          this.vehicleEvents[index].start_time, this.vehicleEvents[index].end_time) : "-";

        this.vehicleEvents[index].color = this.vehicleEvents[index].rc
      }
      let markers = this.mapService.createMarkers(this.vehicleEvents, false, false);
      let markerIndex = 0
      for (const marker of markers) {
        let event = this.vehicleEvents[markerIndex];
        this.mapService.addListerner(marker, 'mouseover', () => this.setEventInfo(event));
        this.mapService.addListerner(marker, 'mouseout', () => this.unsetEventInfo());
        markerIndex++;
      }
      console.timeEnd('execution');
      console.timeEnd('total');
      this.cdr.detectChanges();
    })
  }
  setSliderPoint() {
    this.breakPrevious = true;
    this.isPlay = false;
    if (document.getElementById('myRange'))
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
      this.cdr.detectChanges();
      console.log("timeline value", this.timelineValue);
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
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

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
      <b>Distance:</b>${event.odo} ( ${event.grand} )<br>
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
  getSingleTripInfoForView() {
    if (this.vehicleTripId) {
      this.commonService.loading++;
      this.api.get(`TripsOperation/getSingleTripInfoForView?tripId=${this.vehicleTripId}`)
        .subscribe(res => {
          this.commonService.loading--;
          this.circles.forEach(item => {
            item.setMap(null);
          });
          this.circleCenter.forEach(item => {
            item.setMap(null);
          });
          this.circles = [];
          this.circleCenter = [];
          this.latLngArr = [];
          res['data'].forEach(element => {
            console.log("element====", element);
            if (element.type === 3 || element.type === 1) {
              console.log("element1 in side====", element);
              let color = element.type === 1 ? '00FF00' : 'FF0000';
              let center = this.mapService.createLatLng(element.rlat, element.rlong)
              this.latLngArr.push({lat:parseFloat(element.rlat),lng:parseFloat(element.rlong)})
              let circle = this.mapService.createCirclesOnPostion(center, 1000, '#' + color, '#' + color);
              this.circles.push(circle);
              if (element.type == 3) {
                let circle1 = this.mapService.createCirclesOnPostion(center, 15000, '#' + color, '#' + color);
                let circle2 = this.mapService.createCirclesOnPostion(center, 40000, '#' + color, '#' + color);
                this.circles.push(circle1);
                this.circles.push(circle2);
              }

              this.mapService.addListerner(circle, 'mouseover', () => {
                this.mapService.map.getDiv().setAttribute('title', element.name);
              });

              this.mapService.addListerner(circle, 'mouseout', () => {
                this.mapService.map.getDiv().removeAttribute('title');
              });
              let marker = [{
                lat: element.rlat,
                lng: element.rlong,
                type: 'site', subType: 'marker', color: color
              }];
              this.circleCenter.push(this.mapService.createMarkers(marker, false, false)[0]);
            }

            console.log('this.latLngArr: ', this.latLngArr)
            this.mapService.setMultiBounds(this.latLngArr, true);

          });
        }, err => {
          this.commonService.loading--;
          console.error(err);
        })
    }
  }
  getVehicleTrailAll() {
    let params = {
      'vehicleId': this.vehicleSelected,
      'startTime': this.commonService.dateFormatter(this.startDate),
      'toTime': this.commonService.dateFormatter(this.endDate),
      'orderId': this.orderId,
      'orderType': this.orderType
    }
    return new Promise((resolve, reject) => {
      console.time('getVehicleTrailAll');
      const ids = [28124, 16295, 28116, 28115, 29033];

      this.commonService.loading++;
      const subscription1 = this.api.getJavaPortDost(8083, `switches/${params.vehicleId}/${params.startTime}/${params.toTime}`)
        .subscribe(res => {
          this.commonService.loading--;
          console.log('response of getJavaPortDost is: ', res);
          res = res['data'];
          if (res['loc_data_type'] === 'is_single') {
            console.log('res loc_data_type :', res['loc_data_type']);

            this.commonService.loading++;
            const subscription = this.api.post('VehicleTrail/getVehicleTrailAll', params)
              .subscribe(res => {
                this.commonService.loading--;
                if (res['code'] == 2)
                  this.isLite = true;
                else
                  this.isLite = false;
                this.trails = res['data'];
                console.timeEnd('getVehicleTrailAll');

                resolve(true);
                subscription.unsubscribe();
              }, err => {
                this.commonService.loading--;
                console.error(err);
                resolve(false);
                subscription.unsubscribe();
              });

          } else {
            this.routeRestoreSnapped(resolve);
            return;
          }
          // resolve(true);
          // subscription1.unsubscribe();
        }, err => {
          this.commonService.loading--;
          console.error(err);
          resolve(false);
          subscription1.unsubscribe();
        });
    })
  }
  routeRestoreSnapped(resolve) {
    console.log('inside routeRestoreSnapped');

    let params = {
      'vehicleId': this.vehicleSelected,
      'startTime': this.commonService.dateFormatter(this.startDate),
      'toTime': this.commonService.dateFormatter(this.endDate),
      'orderId': this.orderId,
      'orderType': this.orderType
    }

    this.commonService.loading++;
    const subscription = this.api.getJavaPortDost(8083, `getrawdataevents/${params.vehicleId}/${params.startTime}/${params.toTime}`)
      .subscribe((res: any) => {
        console.log('res:', res);
        res = res['data'];

        if (!res.withSnap) {
          res = {
            withSnap: res.raw,
            raw: res.raw,
            events: res.events || []
          }
        }
        this.vehicleTrailEvents = res.events || [];
        this.commonService.loading--;
        this.isLite = false;
        this.trails = res.withSnap.map((point, index) => {
          point.long = point.lng;
          // delete point.lng;
          return point;
        });
        this.trailsAll = res.raw.map((point, index) => {
          point.long = point.lng;
          return point;
        });
        console.timeEnd('getVehicleTrailAll');
        this.subTrailsPolyLines.forEach(polyline => polyline.setMap(null));
        this.generateSubTrails(res);
        resolve(true);
        subscription.unsubscribe();
      }, err => {
        this.commonService.loading--;
        console.error(err);
        resolve(false);
        subscription.unsubscribe();
      });

  }
  
  generateSubTrails(res) {

    this.redSubTrails = [];
    this.blueSubTrails = [];

    let redSubTrail = [];
    let blueSubTrail = [];

    let isRedSubTrail = false;
    let isBlueSubTrail = false;

    res.raw.forEach((point, index) => {
      if (point.dataType == 0 || isRedSubTrail) {
        redSubTrail.push(point);
        isRedSubTrail = true;
      }

      if (point.dataType == 2 || isBlueSubTrail) {
        blueSubTrail.push(point);
        isBlueSubTrail = true;
      }

      if (index == res.raw.length - 1 || (point.dataType == 0 && res.raw[index + 1].dataType != 0)) {
        isRedSubTrail = false;
        this.redSubTrails.push(redSubTrail);
        redSubTrail = [];
      }

      if (index == res.raw.length - 1 || (point.dataType == 2 && res.raw[index + 1].dataType != 2)) {
        isBlueSubTrail = false;
        this.blueSubTrails.push(blueSubTrail);
        blueSubTrail = [];
      }
    });
    console.log(' this.redSubTrails', this.redSubTrails);
    this.drawSubTrails();
  }
  drawSubTrails() {
    this.redSubTrails.forEach((subTrail) => {
      const coordinates = subTrail.map(trail => {
        return { lat: trail.lat, lng: trail.lng }
      });
      const polyOptions = {
        strokeColor: 'red',
        strokeOpacity: 1,
        strokeWeight: 3,
        zIndex: 999
      };
      const polyline = this.mapService.createPolyline(coordinates, polyOptions);
      this.subTrailsPolyLines.push(polyline);
    });

    this.blueSubTrails.forEach((subTrail) => {
      const coordinates = subTrail.map(trail => {
        return { lat: trail.lat, lng: trail.lng }
      });
      const polyOptions = {
        strokeColor: 'blue',
        strokeOpacity: 1,
        strokeWeight: 3,
        zIndex: 9999
      };
      const polyline = this.mapService.createPolyline(coordinates, polyOptions);
      this.subTrailsPolyLines.push(polyline);
    });
  }
  validateDates() {
    const startDate = moment(this.startDate);
    const endDate = moment(this.endDate);
    const diff = endDate.diff(startDate, 'days');
    if (diff > 15) {
      this.commonService.showError('Route mapper time cannot be > 15 days !');
      return false;
    } else if (diff < 0) {
      this.commonService.showError('End time cannot < Start time !');
      return false;
    }
    return true;
  }
  getHaltTrails() {
    return new Promise((resolve, reject) => {
      console.time('getHaltTrails');
      this.strHaltReason = [];
      this.strSiteName = [];
      this.clearAll();
      if (!(this.vehicleSelected && this.startDate && this.endDate) && !(this.orderId)) {
        this.commonService.showError("Fill All Params");
        reject();
        return;
      }
      this.commonService.loading++;
      let params = {
        vehicleId: this.vehicleSelected,
        startDate: this.commonService.dateFormatter(this.startDate),
        endDate: this.commonService.dateFormatter(this.endDate),
       
      }
      let subscription = this.api.post('HaltOperations/getvehicleEvents', params)
        .subscribe(res => {
          console.log('response data : ', res['data']);

          this.commonService.loading--;
          if (!res['data']) {
            res['data'] = [];
          }
          this.vehicleEvents = res['data'].reverse();
          console.timeEnd('getHaltTrails');
          resolve(true);
          subscription.unsubscribe();
        }, err => {
          this.commonService.loading--;
          console.error(err);
          resolve(false);
          subscription.unsubscribe();
        });
    });
  }

}
