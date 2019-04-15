import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { ApiService } from "../../services/api.service";
import { CommonService } from '../../services/common.service';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { map } from 'rxjs/operators';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'route-mapper',
  templateUrl: './route-mapper.component.html',
  styleUrls: ['./route-mapper.component.scss']
})
export class RouteMapperComponent implements OnInit {

  slideToolTipLeft = 0;
  vehicleRegNo = null;
  title = 'Route Tracker';
  constructor(private modalService: NgbModal,
    private mapService: MapService,
    private apiService: ApiService,
    private activeModal: NgbActiveModal,
    private commonService: CommonService) {
  this.startDate = this.commonService.params.fromTime;
  this.endDate = this.commonService.params.toTime;
  this.vehicleSelected = this.commonService.params.vehicleId;
  this.vehicleRegNo = this.commonService.params.vehicleRegNo;
  console.log("common params:");
  console.log(this.commonService.params);
  if(this.commonService.params.title != undefined )
      this.title = this.commonService.params.title;
  console.log("title:" + this.commonService.params.title);
  console.log("this.startDate",this.startDate);
  console.log("this.endDate",this.endDate);
  console.log("this.vehicleSelected",this.vehicleSelected,this.vehicleRegNo);
      this.getHaltTrails();
     }
     

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(0);
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
      return { time: this.startDate, lat: this.polypath[0].lat, lng: this.polypath[0].lng };
    }
    for (const polypoint of this.polypath) {
      if (polypoint.odo >= odoNow) {
        return polypoint;
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
    if (!(this.vehicleSelected && this.startDate && this.endDate)) {
      this.commonService.showError("Fill All Params");
      return;
    }
    this.commonService.loading++;
    let params = {
      vehicleId:this.vehicleSelected,
      startDate:this.commonService.dateFormatter(this.startDate),
      endDate:this.commonService.dateFormatter(this.endDate)
    }
    // console.log(params);
    this.apiService.post('HaltOperations/getVehicleEvents', params)
      .subscribe(res => {
        this.commonService.loading--;
        console.log(res);
        let vehicleEvents = res['data'].reverse();
        let params = {
          'vehicleId': this.vehicleSelected,
          'startTime': this.commonService.dateFormatter(this.startDate, 'YYYYMMDD', true, "-"),
          'toTime': this.commonService.dateFormatter(this.endDate, 'YYYYMMDD', true, "-")
        }
        this.commonService.loading++;
        console.log(params);
        this.apiService.post('Vehicles/getVehDistanceBwTime', {'vehicleId': this.vehicleSelected, fromTime : params['startTime'], tTime : params['toTime']})
          .subscribe(resdist => {
            this.commonService.loading--;
            let distance = resdist['data'];
            if(distance > 0) {
              distance = Math.round((distance/1000) * 100/100);
            } else {
              distance = 0;
            }
            this.title = "Distance: " + distance + " Kms";
            this.commonService.loading++;
            this.apiService.post('VehicleTrail/getVehicleTrailAll', params)
              .subscribe(res => {
                this.commonService.loading--;
                this.mapService.clearAll();
                let i = 0;
                let prevElement = null;
                let total = 0;
                for (const element of res['data']) {

                  if (i != 0) {
                    let disS = this.commonService.distanceFromAToB
                      (element.lat, element.long, prevElement.lat, prevElement.long, "Mt");
                    let dis = parseFloat(disS);
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
                  
                  this.mapService.createPolyPathManual(this.mapService.createLatLng(element.lat, element.long));
                  this.mapService.setBounds(this.mapService.createLatLng(element.lat, element.long));
                  prevElement = element;
                  i++;
                }
                this.maxOdo = total;
                console.log("PolyLine", this.polypath);

                this.mapService.polygonPath.set('icons', [{
                  icon: this.mapService.lineSymbol,
                  offset: "0%"
                }]);
                let totalHourDiff = 0;
                if(vehicleEvents.length!=0){
                  totalHourDiff = this.commonService.dateDiffInHours(vehicleEvents[0].start_time,vehicleEvents[vehicleEvents.length-1].end_time,true);
                  console.log("Total Diff",totalHourDiff);
                }
                
                for (let index = 0; index < vehicleEvents.length; index++) {
                  if(vehicleEvents[index].halt_reason=="Unloading"||vehicleEvents[index].halt_reason=="Loading"){
                    vehicleEvents[index].subType = 'marker';
                    vehicleEvents[index].color = vehicleEvents[index].halt_reason=="Unloading"?'ff4d4d':'88ff4d';
                    vehicleEvents[index].rc = vehicleEvents[index].halt_reason=="Unloading"?'ff4d4d':'88ff4d';
                  }else{
                    vehicleEvents[index].color = "00ffff";
                  }
                  vehicleEvents[index].position = (this.commonService.dateDiffInHours(
                    vehicleEvents[0].start_time,vehicleEvents[index].start_time)/totalHourDiff)*97.9;
                  vehicleEvents[index].width = (this.commonService.dateDiffInHours(
                    vehicleEvents[index].start_time,vehicleEvents[index].end_time,true)/totalHourDiff)*109.8;
                  console.log("Width",vehicleEvents[index].width);
                   
                  vehicleEvents[index].duration = this.commonService.dateDiffInHoursAndMins(
                    vehicleEvents[index].start_time,vehicleEvents[index].end_time);
                }
                console.log("VehicleEvents", vehicleEvents);
                this.vehicleEvents = vehicleEvents;
                this.mapService.createMarkers(this.vehicleEvents, false, false);
                let markerIndex = 0
                for (const marker of this.mapService.markers) {
                  let event = this.vehicleEvents[markerIndex];
                  this.mapService.addListerner(marker,'mouseover',()=>this.setEventInfo(event));
                  this.mapService.addListerner(marker,'mouseout',()=>this.unsetEventInfo());
                  markerIndex++;
                }
              }, err => {
                this.commonService.loading--;
                console.log(err); ////
              });

          }, err => {
            this.commonService.loading--;
            console.log(err); ////
          });


      }, err => {
        this.commonService.loading--;
        console.log(err);
      });
  }
  breakPrevious = false;

  setSliderPoint() {
    this.breakPrevious = true;
    this.isPlay = false;
    this.slideToolTipLeft = (document.getElementById('myRange').offsetWidth / 100) * this.timelineValue;
    console.log("Point", this.timelineValue, 'width: ', this.slideToolTipLeft);
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
  }
  zoomOnArrow(isEvent = true) {
    let bound = this.mapService.getMapBounds();
    // console.log("Bound",bound,"TimeLinePoly",this.timeLinePoly);

    if (isEvent || !((bound.lat1 + 0.001 <= this.timeLinePoly.lat && bound.lat2 - 0.001 >= this.timeLinePoly.lat) &&
      (bound.lng1 + 0.001 <= this.timeLinePoly.lng && bound.lng2 - 0.001 >= this.timeLinePoly.lng))) {
      this.mapService.zoomAt({ lat: this.timeLinePoly.lat, lng: this.timeLinePoly.lng }, isEvent?this.zoomLevel:this.mapService.map.getZoom());
    }
  }
  eventInfo = null;
  infoWindow = null;
  setEventInfo(event) {
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
    this.infoWindow.close();
    this.infoWindow.opened = false;
  }
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  closeModal(response) {
    this.activeModal.close({ response: response });
  }
  
  openSmartTool(i, vehicleEvent) {
    this.vehicleEvents.forEach(vEvent => {
      if (vEvent != vehicleEvent)
        vEvent.isOpen = false;
    });
      vehicleEvent.isOpen = !vehicleEvent.isOpen;
      this.zoomFunctionality(i, vehicleEvent);
  }
  zoomFunctionality(i, vehicleEvent) {
    console.log("vehicleEvent", vehicleEvent);
    let latLng=this.mapService.getLatLngValue(vehicleEvent);
    let googleLatLng=this.mapService.createLatLng(latLng.lat,latLng.lng);
    console.log("latlngggg",googleLatLng);
    this.mapService.zoomAt(googleLatLng);
  }


}
