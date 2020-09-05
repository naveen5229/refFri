import { ChangeHaltComponent } from '../change-halt/change-halt.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ReportIssueComponent } from '../report-issue/report-issue.component';
import { ManualHaltComponent } from '../manual-halt/manual-halt.component';
import { RemarkModalComponent } from '../remark-modal/remark-modal.component';
import { RouteMapperComponent } from '../route-mapper/route-mapper.component';
import { VehicleGpsTrailComponent } from '../../modals/vehicle-gps-trail/vehicle-gps-trail.component';
import { VehicleLrComponent } from '../vehicle-lr/vehicle-lr.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { UpdateLocationComponent } from '../update-location/update-location.component';
import { VerifyfuturetripstateComponent } from '../verifyfuturetripstate/verifyfuturetripstate.component';
import { TripStateMappingComponent } from '../trip-state-mapping/trip-state-mapping.component';

declare let google: any;

@Component({
  selector: 'change-vehicle-status',
  templateUrl: './change-vehicle-status.component.html',
  styleUrls: ['./change-vehicle-status.component.scss']
})

export class ChangeVehicleStatusComponent implements OnInit {
  @ViewChild('map1') mapElement: ElementRef;
  panelOpenState = false;
  title = '';
  map: any;
  location = {
    lat: 26.9124336,
    lng: 75.78727090000007,
    name: '',
    time: ''
  };
  vSId = null;
  isChecks = {};
  btnStatus = true;
  lUlBtn = false;
  dataType = 'events';
  VehicleStatusData;
  vehicleEvents = [];
  vehicleEventsR = [];
  vehEvent = [];
  marker: any;
  lastIndType = null;
  timeDiff = null;
  distDiff = null;
  polygons = [];
  showHideSite = 'HS';
  lastIndDetails = null;
  loadingUnLoading = null;
  customDate = null;
  onlyDrag = false;
  vehicleEvent = null;
  convertSiteHaltFlag = false;
  ref_page: null;
  toTime = new Date();
  lTime = new Date();
  hsId: any;
  tripId: null;
  zoomLevel = 19;
  constructor(public modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {
    this.VehicleStatusData = this.common.params;
    this.lTime = this.VehicleStatusData.latch_time ? new Date(this.VehicleStatusData.latch_time) : this.lTime;
    this.tripId = this.VehicleStatusData.tripId ? this.VehicleStatusData.tripId : this.tripId;
    this.ref_page = this.common.ref_page;
    if (this.ref_page != 'vsc') {
      this.toTime = new Date(this.VehicleStatusData.tTime)
    }
    this.common.handleModalSize('class', 'modal-lg', '1600', 'px', 0);
    this.common.handleModalSize('class', 'modal-lg', '1600', 'px', 1);
    this.getLastIndDetails();
    this.getEvents();
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    this.loadMap(this.location.lat, this.location.lng);
  }

  loadMap(lat = 26.9124336, lng = 75.78727090000007) {
    let mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 8,
      disableDefaultUI: true,
      mapTypeControl: true,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      scaleControl: true,
      zoomControl: true,
      styles: [{
        featureType: 'all',
        elementType: 'labels',
        stylers: [{
          visibility: 'on'
        }]
      }]

    };

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  openChangeHaltModal(vehicleEvent, type) {
    this.common.changeHaltModal = type;
    this.common.passedVehicleId = this.VehicleStatusData.vehicle_id;
    this.common.params = vehicleEvent;
    const activeModal = this.modalService.open(ChangeHaltComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.getEvents();
    });
  }

  showHalt() {
    this.getEvents();
  }

  showTrail() {
    this.dataType = 'trails';
    this.common.loading++;
    let params = {
      'vehicleId': this.VehicleStatusData.vehicle_id,
      'fromTime': this.common.dateFormatter(this.VehicleStatusData.latch_time),
      'toTime': this.common.dateFormatter(this.toTime),
      'suggestId': this.VehicleStatusData.suggest,
      'status': this.VehicleStatusData.status ? this.VehicleStatusData.status : 10,
      'tripId': this.tripId
    }
    this.api.post('VehicleStatusChange/getVehicleTrail', params)
      .subscribe(res => {
        this.common.loading--;
        this.vehicleEvents = res['data'];
        this.clearAllMarkers();
        this.createMarkers(res['data']);
      }, err => {
        this.common.loading--;
        this.common.showError(err);
      });
  }


  setZoom(zoom) {
    this.map.setZoom(zoom);
    if (zoom >= 15) {
      this.map.setMapTypeId('hybrid');
    } else {
      this.map.setMapTypeId('roadmap');
    }
  }
  infoWindow = null;
  setEventInfo(event, isClick?) {
    if (!isClick)
      this.toggleBounceMF(event.mIndex);
    else
      this.markerZoomMF(event.mIndex, 17);

  }
  unsetEventInfo(event) {
    this.toggleBounceMF(event.mIndex, 2);

  }


  getEvents() {
    let status = this.VehicleStatusData.status ? this.VehicleStatusData.status : 10;
    this.dataType = 'events';
    //this.VehicleStatusData.latch_time = '2019-02-14 13:19:13';
    this.VehicleStatusData.loader && this.common.loading++;
    let params = "vId=" + this.VehicleStatusData.vehicle_id +
      "&fromTime=" + this.common.dateFormatter(this.VehicleStatusData.latch_time) +
      "&toTime=" + this.common.dateFormatter(this.toTime) +
      "&status=" + status +
      "&tripId=" + this.tripId;
    this.api.get('HaltOperations/getHaltHistoryV2?' + params)
      .subscribe(res => {
        this.VehicleStatusData.loader && this.common.loading--;
        this.vehicleEvents = res['data'];
        this.clearAllMarkers();
        this.createMarkers(res['data']);
        this.resetBtnStatus();
        // ------------------------ Route Mapper Code (Authored by UJ) ----------------------
        let startElement = this.vehicleEvents.find((element) => {
          return !(element.desc + "").includes('LT');
        });
        this.vehicleEvents.forEach((element) => {
          if ((element.haltTypeId == 21 || element.haltTypeId == 11)
            && (element.desc + "").includes('LT'))
            element.lastType = element.haltTypeId;
          else
            element.lastType = null;
        });
        if (startElement) {
          let start = startElement.startTime;
          let startIndex = this.vehicleEvents.indexOf(startElement);
          let end = this.vehicleEvents[this.vehicleEvents.length - 1].endTime;
          this.vehicleEventsR = [];
          let vehicleEvents = res['data'];
          let realStart = new Date(vehicleEvents[startIndex].startTime) < new Date(start) ?
            vehicleEvents[startIndex].startTime : start;
          let realEnd = null;
          if (vehicleEvents[0].endTime)
            realEnd = new Date(vehicleEvents[vehicleEvents.length - 1].endTime) > new Date(end) ?
              vehicleEvents[vehicleEvents.length - 1].endTime : end;
          let totalHourDiff = 0;
          if (vehicleEvents.length != 0) {
            totalHourDiff = this.common.dateDiffInHours(realStart, realEnd, true);
          }
          for (let index = startIndex; index < vehicleEvents.length; index++) {
            vehicleEvents[index].mIndex = index;
            startIndex++;
            vehicleEvents[index].position = (this.common.dateDiffInHours(
              realStart, vehicleEvents[index].startTime) / totalHourDiff) * 98;
            vehicleEvents[index].width = (this.common.dateDiffInHours(
              vehicleEvents[index].startTime, vehicleEvents[index].endTime, true) / totalHourDiff) * 98;
            this.vehicleEventsR.push(vehicleEvents[index]);
          }
        }

      }, err => {
        this.VehicleStatusData.loader && this.common.loading--;
        this.common.showError(err);
      })
  }

  resetBtnStatus() {
    this.btnStatus = true;
    this.vehicleEvents.forEach(vehicleEventDetail => {
      if (vehicleEventDetail.color == 'ff13ec') {
        this.btnStatus = false;
        return;
      }
    });
  }

  showPreviousLUL() {
    if (this.lUlBtn) {
      this.getLoadingUnLoading();
      this.getVehicleTrips();
    }
  }

  getDate(type, event) {
    if (type == 'lTime') {
      this.VehicleStatusData.latch_time = event;
    }
    else if (type == 'tTime') {
      this.toTime = event;
    }

  }

  getLoadingUnLoading() {
    this.dataType = 'events';
    //this.VehicleStatusData.latch_time = '2019-02-14 13:19:13';
    this.common.loading++;
    let params = "vId=" + this.VehicleStatusData.vehicle_id +
      "&latchTime=" + this.common.dateFormatter(this.VehicleStatusData.latch_time) +
      "&toTime=" + this.common.dateFormatter(this.toTime) +
      "&tripId=" + this.tripId;
    this.api.get('HaltOperations/getMasterHaltDetail?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.loadingUnLoading = res['data'];
      }, err => {
        this.common.loading--;
        this.common.showError(err);
      });
  }


  designsDefaults = [
    "M  0,0,  0,-5,  -5,-5,-5,-13 , 5,-13 ,5,-5, 0,-5 z",///Rect
    "M  0,0,  0,-5,  -5,-13 , 5,-13 , 0,-5 z",//Pin
    "M  0,0,  0,-5,  -5,-13 , 5,-13 , 0,-5 z"///Rect
  ];
  bounds = null;
  Markers = [];
  createMarkers(markers, changeBounds = true, drawPoly = false) {

    let thisMarkers = [];
    this.bounds = new google.maps.LatLngBounds();
    for (let index = 0; index < markers.length; index++) {

      let subType = markers[index]["subType"];
      let design = markers[index]["type"] == "site" ? this.designsDefaults[0] :
        markers[index]["type"] == "subSite" ? this.designsDefaults[1] : null;//this.designsDefaults[2]
      let text = markers[index]["text"] ? markers[index]["text"] : index + 1;
      let pinColor = markers[index]["color"] ? markers[index]["color"] : "FFFF00";
      let lat = markers[index]["lat"] ? markers[index]["lat"] : 25;
      let lng = markers[index]["long"] ? markers[index]["long"] : 75;
      let title = markers[index]["title"] ? markers[index]["title"] : "Untitled";
      let latlng = new google.maps.LatLng(lat, lng);
      let pinImage;
      //pin Image  
      if (design) {
        pinImage = {
          path: design,
          // set custom fillColor on each iteration
          fillColor: "#" + pinColor,
          fillOpacity: 1,
          scale: 1.3,
          strokeColor: pinColor,
          strokeWeight: 2,
        };
      } else {
        if (subType == 'marker') {
          pinImage = "http://chart.apis.google.com/chart?chst=d_map_xpin_letter&chld=pin|" + text + "|" + pinColor + "|000000";

        }
        else //if(subType=='circle')
          pinImage = {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 3,
            fillColor: "#" + pinColor,
            fillOpacity: 0.8,
            strokeWeight: 1
          };
      }


      let marker = new google.maps.Marker({
        position: latlng,
        flat: true,
        icon: pinImage,
        map: this.map,
        title: title
      });
      if (changeBounds && !('' + markers[index]['desc']).endsWith('LT'))
        this.setBounds(latlng);
      thisMarkers.push(marker);

      this.Markers.push(marker);

      if (markers[index]["type"] == "site") {
        let show = markers[index]['name'] + " , " + markers[index]['typename'] + " , " + markers[index]['id'];
        marker.addListener('mouseover', this.showInfoWindow.bind(this, show, marker));
        marker.addListener('mouseout', this.closeInfoWindow.bind(this));
        marker.addListener('click', this.convertSiteHalt.bind(this, markers[index]['id']));

      }
      if (markers[index]['radius'])
        this.createCirclesOnPostion(latlng, markers[index]['radius'], '#00ff00');

    }
    return thisMarkers;
  }

  mergeWithVS(vsId, hsId, isCheck, j) {
    
    this.unCheckAll(j);
    if (isCheck) {
      this.vSId = vsId;
      this.hsId = hsId;
    }
    else{
      this.vSId = null;
      this.hsId = null;
    }
  }

  unCheckAll(j) {
    for (const key in this.isChecks) {
      if (this.isChecks.hasOwnProperty(key)) {
        if (key != j) {
          this.isChecks[key] = false;
        }else if(key == j) {
          this.isChecks[key] = true;
        }
      }
    }
  }

  setBounds(latlng) {
    if (!this.bounds)
      this.bounds = this.map.getBounds();
    this.bounds.extend(latlng);
    this.map.fitBounds(this.bounds);
  }
  toggleBounceMF(id, evtype = 1) {
    if (this.Markers[id]) {
      if (this.Markers[id].getAnimation() == null && evtype == 1) {
        this.Markers[id].setAnimation(google.maps.Animation.BOUNCE);
      }
      else if (evtype == 2 && this.Markers[id].getAnimation() != null) {
        this.Markers[id].setAnimation(null);
      }
    }
  }
  markerZoomMF(id, zoomLevel = 19, isReset = false) {
    let latLng = !isReset ? this.Markers[id].position : new google.maps.LatLng(25, 75);
    this.map.setCenter(latLng);
    this.setZoom(zoomLevel);
  }
  clearAllMarkers(reset = true, boundsReset = true) {
    for (let i = 0; i < this.Markers.length; i++) {
      this.Markers[i].setMap(null);
    }
    if (reset)
      this.Markers = [];
    if (boundsReset) {
      this.markerZoomMF(null, 12, true);
    }
  }
  clearOtherMarker(otherMarker) {
    for (let i = 0; i < otherMarker.length; i++) {
      otherMarker[i].setMap(null);
    }
    otherMarker = [];
  }

  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  reviewComplete(status) {
    // this.common.loading++;
    let params = {
      vehicleId: this.VehicleStatusData.vehicle_id,
      latchTime: this.common.dateFormatter(this.VehicleStatusData.latch_time),
      toTime: this.common.dateFormatter(this.toTime),
      status: status,
      tripId: this.tripId
    };
    this.api.post('HaltOperations/reviewDone?', params)
      .subscribe(res => {
        // this.common.loading--;
        this.closeModal(true);
      }, err => {
        // this.common.loading--;
        this.common.showError();
      });
    this.closeModal(true);
  }

  getLastIndDetails() {
    this.VehicleStatusData.loader && this.common.loading++;
    let params = "vehId=" + this.VehicleStatusData.vehicle_id;
    this.api.get('HaltOperations/lastIndustryDetails?' + params)
      .subscribe(res => {
        this.VehicleStatusData.loader && this.common.loading--;
        this.lastIndDetails = res['data'][0];
        if (this.lastIndDetails) {
          this.calculateDistanceAndTime(this.lastIndDetails, this.VehicleStatusData.latch_lat, this.VehicleStatusData.latch_long, this.common.dateFormatter(this.VehicleStatusData.latch_time));
          this.lastIndType = this.lastIndDetails.li_type;
        }
      }, err => {
        this.VehicleStatusData.loader && this.common.loading--;
      });
  }

  zoomFunctionality(i, vehicleEvent) {
    this.markerZoomMF(i, 19);
    if (this.lastIndDetails)
      this.calculateDistanceAndTime(this.lastIndDetails, vehicleEvent.lat, vehicleEvent.long, vehicleEvent.time);
    this.fnLoadGeofence(vehicleEvent);
  }

  showHide() {
    let showHide = this.showHideSite;
    if (showHide == 'SS') {
      //this.setZoom(13);
      this.showHideSite = 'HS';
      this.getSites();
    } else {
      this.showHideSite = 'SS';
      this.clearOtherMarker(this.siteMarkers);

    }
  }


  siteMarkers = [];

  getSites() {
    if (this.map) {
      // this.common.loading++;
      let boundsx = this.map.getBounds();
      let ne = boundsx.getNorthEast(); // LatLng of the north-east corner
      let sw = boundsx.getSouthWest(); // LatLng of the south-west corder
      let lat2 = ne.lat();
      let lat1 = sw.lat();
      let lng2 = ne.lng();
      let lng1 = sw.lng();

      let params = {
        lat1: lat1,
        lng1: lng1,
        lat2: lat2,
        lng2: lng2
      };
      this.api.post('VehicleStatusChange/getSiteAndSubSite?', params)
        .subscribe(res => {
          if (this.siteMarkers.length == 0) {
            this.siteMarkers = this.createMarkers(res['data'], false);
            // this.common.loading--;
          }
          else {
            this.clearOtherMarker(this.siteMarkers);
            this.siteMarkers = this.createMarkers(res['data'], false);
            // this.common.loading--;
          }

        }, err => {
          // this.common.loading--;
        });
    }
  }

  beforeLatchTime() {
    let ltime = new Date(this.VehicleStatusData.latch_time);
    let subtractLTime = new Date(ltime.setHours(ltime.getHours() - 3));
    this.VehicleStatusData.latch_time = this.common.dateFormatter(subtractLTime);
    this.reloadData();
  }

  reloadData() {
    if (this.dataType == 'events') {
      this.getEvents();
    } else if (this.dataType == 'trails') {
      this.showTrail();
    }
  }

  calculateDistanceAndTime(lastIndDetails, lat2, long2, time2) {
    this.distDiff = this.common.distanceFromAToB(lastIndDetails.li_lat, lastIndDetails.li_lng, lat2, long2, "K");
    this.timeDiff = this.common.differenceBtwT1AndT2(time2, lastIndDetails.li_time);
  }

  Fences = null;
  FencesPoly = null;
  fnLoadGeofence(vehicleEvent) {
    // this.common.loading++;

    let params = {
      siteId: vehicleEvent.y_site_id,
      lat: vehicleEvent.lat,
      lng: vehicleEvent.long
    };

    this.api.post('SiteFencing/getSiteFences', params)
      .subscribe(res => {
        let data = res['data'];
        let count = Object.keys(data).length;
        if (count > 0) {
          let latLngsArray = [];
          let mainLatLng = null;
          for (const datax in data) {
            if (data.hasOwnProperty(datax)) {
              const datav = data[datax];
              if (datax == vehicleEvent.y_site_id)
                mainLatLng = datav.latLngs;
              latLngsArray.push(datav.latLngs);
            }
          }
          this.createPolygons(latLngsArray, mainLatLng);
        }

        // this.common.loading--;
      }, err => {
        // this.common.loading--;
        this.common.showError(err);
      });
  }
  createPolygons(latLngsMulti, mainLatLngs?, options?) {// strokeColor = '#', fillColor = '#') {
    if (this.polygons.length > 0) {
      this.polygons.forEach(polygon => {
        polygon.setMap(null);
      });
      this.polygons = [];
    }
    latLngsMulti.forEach(latLngs => {
      let colorBorder = '#228B22';
      let colorFill = '#ADFF2F';
      if (mainLatLngs != latLngs) {
        colorBorder = '#550000';
        colorFill = '#ff7f7f';
      }
      const defaultOptions = {
        paths: latLngs,
        strokeColor: colorBorder,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        clickable: false,
        fillColor: colorFill,
        fillOpacity: 0.35
      };
      this.polygons.push(new google.maps.Polygon(options || defaultOptions));
    });
    this.polygons.forEach(polygon => {
      polygon.setMap(this.map);
    });

  }



  openSmartTool(i, vehicleEvent) {
    vehicleEvent.isOpen = !vehicleEvent.isOpen;
    if (vehicleEvent.isOpen) {
      console.log('vehicle event', vehicleEvent);
      if (this.vSId != null && this.hsId != vehicleEvent.haltId && vehicleEvent.haltId != null && vehicleEvent.haltTypeId != -1)
        if (confirm("Merge with this Halt?")) {
          // this.common.loading++;
          let params = { ms_id: this.vSId, hs_id: vehicleEvent.haltId };
          this.api.post('HaltOperations/mergeManualStates', params)
            .subscribe(res => {
              // this.common.loading--;
                       this.vSId = null;
                        this.isChecks = {};
              if (res['success']) {
                this.reloadData();
                this.common.showToast(res['msg']);
        
              } else {
                this.common.showError(res['msg']);
                this.reloadData();
              }
            }, err => {
              // this.common.loading--;
              this.common.showError(err);
            });
        }
      // this.vSId = null;
      // this.isChecks = {};
      if (!this.onlyDrag) {
        this.vehicleEvents.forEach(vEvent => {
          if (vEvent != vehicleEvent)
            vEvent.isOpen = false;
        });
        // vehicleEvent.isOpen = !vehicleEvent.isOpen;
        this.zoomFunctionality(i, vehicleEvent);
        this.getSites();
      }
      this.onlyDrag = false;
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    //moveItemInArray(this.vehicleEvents, event.previousIndex, event.currentIndex);
  }

  onDragEnded(event, index, movedItem) {
    let offsetsCurrent = document.getElementById('vehicleEvent-row-' + index).getBoundingClientRect();
    let middle = (offsetsCurrent.top + offsetsCurrent.bottom) / 2;
    let movedOnItem = null;
    this.vehicleEvents.map((vehicleEvent, i) => {
      if (index !== i) {
        let offset = document.getElementById('vehicleEvent-row-' + i).getBoundingClientRect();
        if (middle >= offset.top && middle <= offset.bottom) {
          movedOnItem = vehicleEvent;
        }
      }
    });

    if (movedOnItem) {
      //  this.common.showToast('Moved Item Detected');
      this.siteMerge(movedItem, movedOnItem);
    } else {
      this.common.showError('You have moved to different location');
    }
  }

  siteMerge(movedItem, movedOnItem) {
    this.common.loading++;
    let params = {
      dragHaltId: movedItem.haltId,
      dropHaltId: movedOnItem.haltId
    };
    this.api.post('HaltOperations/mergeHalts', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.reloadData();
        } else {
          this.common.showToast(res['msg']);
          this.reloadData();
        }
      }, err => {
        this.common.loading--;
        this.common.showError(err);
      });
  }
  setSiteHalt(vehicleEvent, convertSiteHaltFlag) {
    this.convertSiteHaltFlag = convertSiteHaltFlag;
    this.vehicleEvent = vehicleEvent;

  }

  convertSiteHalt(siteId) {
    if (this.convertSiteHaltFlag) {
      this.common.loading++;
      let params = {
        vehicleHaltRowId: this.vehicleEvent.haltId,
        siteId: siteId,
      };
      this.api.post('HaltOperations/allocateVehicleHaltToSite', params)
        .subscribe(res => {
          this.common.loading--;
          this.reloadData();

          this.convertSiteHaltFlag = false;

        }, err => {
          this.common.loading--;
        });
    }
  }

  deleteHalt(vehicleEvent) {
    this.common.loading++;
    let params = {
      haltId: vehicleEvent.haltId,
    };
    this.api.post('HaltOperations/deleteHalt', params)
      .subscribe(res => {
        this.common.loading--;
        this.reloadData();
      }, err => {
        this.common.loading--;
      });
  }
  infowindow = null;
  showInfoWindow(show, marker) {
    if (this.infowindow != null) {
      this.infowindow.close();
    }

    this.infowindow = new google.maps.InfoWindow({
      content: show,
      size: new google.maps.Size(50, 50),
      maxWidth: 300
    });

    this.infowindow.open(this.map, marker);
  }

  closeInfoWindow() {
    this.infowindow.close();
  }

  addAutomaticHalt() {
    this.common.loading++;
    let params = {
      fromTime: this.common.dateFormatter(this.VehicleStatusData.latch_time),
      vehicleId: this.VehicleStatusData.vehicle_id,
      tLat: 0.0,
      tLong: 0.0,
      tTime: this.common.dateFormatter(this.toTime),
    }


    this.api.post('AutoHalts/addSingleVehicleAutoHalts', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.reloadData();
        } else {
          this.common.showToast(res['msg']);
          this.reloadData();
        }
      }, err => {
        this.common.loading--;
      });
  }

  reportIssue(vehicleEvent) {
    this.common.params = { refPage: 'vsc' };
    let clusterData = vehicleEvent.clusterInfo ? vehicleEvent.clusterInfo['data'] : null;
    let refId = vehicleEvent.haltId ? vehicleEvent.haltId : vehicleEvent.vs_id;
    const activeModal = this.modalService.open(ReportIssueComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.result.then(data => data.status && this.common.reportAnIssue(data.issue, vehicleEvent.haltId, clusterData));
  }

  dataRefresh() {

    this.reloadData();
  }

  resetMap() {
    this.clearAllMarkers();
    this.createMarkers(this.vehicleEvents);
    this.resetBtnStatus();
    // this.reloadData();
  }

  openManualHalt(vehicleEvent) {
    this.common.params = { vehicleId: this.VehicleStatusData.vehicle_id, vehicleRegNo: this.VehicleStatusData.regno }
    const activeModal = this.modalService.open(ManualHaltComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.result.then(data =>
      this.reloadData());
  }

  resolveTicket(status) {
    this.common.loading++;
    let params = {
      rowId: this.VehicleStatusData.id,
      remark: this.VehicleStatusData.remark || null,
      status: status,

    };
    if (params.status == -1) {
      this.common.loading--;
      this.openConrirmationAlert(params);
      // this.activeModal.close();
      return;
    }
    this.api.post('MissingIndustry/edit', params)
      .subscribe(res => {
        this.common.loading--;
        this.activeModal.close();
      }, err => {
        this.common.loading--;
      });
    // this.activeModal.close();
  }

  openConrirmationAlert(params) {
    this.common.params = { remark: params.remark, title: 'Reject Reason ' }
    const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        params.remark = data.remark;
        this.common.loading++;
        this.api.post('MissingIndustry/edit', params)
          .subscribe(res => {
            this.common.loading--;
            this.activeModal.close();

          }, err => {
            this.common.loading--;

          });
      }
    });
  }

  decouplingState(vehicleEvent) {
    this.common.params = {
      title: 'Decoupling State ',
      description: `Are you sure ?`,
    }
    const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false });
    activeModal.result.then(data => {
      if (data.response) {
        let params = {
          stateId: vehicleEvent.vs_id
        };
        this.common.loading++;
        this.api.post('HaltOperations/decoupleStateHalt', params)
          .subscribe(res => {
            this.common.loading--;
            if (res['data'][0].y_id > 0) {
              this.common.showToast(res['data'][0].y_msg);
              this.reloadData();
            }
            else {
              this.common.showError(res['data'][0].y_msg);
            }


          }, err => {
            this.common.loading--;
            this.common.showError('Error!');
          });
      }
    });
  }

  openRouteMapper() {
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: this.VehicleStatusData.vehicle_id ? this.VehicleStatusData.vehicle_id : null,
      vehicleRegNo: this.VehicleStatusData.regno,
      fromTime: this.common.dateFormatter(this.VehicleStatusData.latch_time),
      toTime: this.common.dateFormatter(this.toTime)
    };
    const activeModal = this.modalService.open(RouteMapperComponent, {
      size: "lg",
      container: "nb-layout"
      , windowClass: "mycustomModalClass"
    });

  }


  gps() {
    let today = new Date(this.toTime);
    let endDate = (this.common.dateFormatter(today)).split(' ')[0];
    let startDate = (this.common.dateFormatter(new Date(today.setDate(today.getDate() - 1)))).split(' ')[0];

    let vehicleData = {

      vehicleId: this.VehicleStatusData.vehicle_id,
      vehicleRegNo: this.VehicleStatusData.regno,
      startDate: startDate,
      endDate: endDate,
    }
    this.common.params = { refPage: "cvs" };
    this.common.params = { vehicleData: vehicleData };
    this.common.handleModalSize('class', 'modal-lg', '1600');
    const activeModal = this.modalService.open(VehicleGpsTrailComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'gps-trail' });

  }

  vehicleLr() {
    let today = new Date(this.toTime);
    let endDate = (this.common.dateFormatter(today)).split(' ')[0];
    let startDate = (this.common.dateFormatter(new Date(today.setDate(today.getDate() - 1)))).split(' ')[0];

    let vehicleData = {

      vehicleId: this.VehicleStatusData.vehicle_id,
      vehicleRegNo: this.VehicleStatusData.regno,
      startDate: startDate,
      endDate: endDate,
    }
    this.common.params = { refPage: "cvs" };
    this.common.params = { vehicleData: vehicleData };
    this.common.handleModalSize('class', 'modal-lg', '1600');
    const activeModal = this.modalService.open(VehicleLrComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

  }

  vehicleTrips = [];
  getVehicleTrips() {
    let today, startday, fromDate;
    today = new Date();
    startday = new Date(today.setDate(today.getDate() - 10));
    fromDate = this.common.dateFormatter(startday);
    let fromTime = this.common.dateFormatter(fromDate);
    let toTime = this.common.dateFormatter(new Date());

    let params = "vehicleId=" + this.VehicleStatusData.vehicle_id +
      "&startDate=" + fromTime +
      "&endDate=" + toTime;
    ++this.common.loading;
    this.api.get('TripsOperation/getTrips?' + params)
      .subscribe(res => {
        --this.common.loading;
        this.vehicleTrips = res['data'];

      }, err => {
        --this.common.loading;

      });
  }

  updateLocation(vehicleEvent) {
    let location = {
      refId: vehicleEvent.vs_id,
      refType: 1,
      lat: vehicleEvent.lat,
      lng: vehicleEvent.long,
      name: vehicleEvent.loc
    }
    this.common.params = { location: location }
    const activeModal = this.modalService.open(UpdateLocationComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });

    activeModal.result.then(data => {
      this.reloadData();

    });
  }

  verifyTrip(vehicleEvent) {

    let verifyTrip = {
      startTime: vehicleEvent.startTime,
      trip_desc: vehicleEvent.trip_desc,
      trip_id: vehicleEvent.trip_id,
      stateId: vehicleEvent.vs_id
    }
    this.common.params = { verifyTrip: verifyTrip }
    const activeModal = this.modalService.open(VerifyfuturetripstateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.reloadData();
    });
  }

  tripStateMapping(vehicleEvent) {
    let vehicle = {
      stateId: vehicleEvent.vs_id
    }
    this.common.params = { vehicle: vehicle }
    const activeModal = this.modalService.open(TripStateMappingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.vSId = null;
      this.hsId = null;
      this.reloadData();
    });
  }

  circle = null;
  createCirclesOnPostion(center, radius, stokecolor = '#FF0000', fillcolor = '#FF0000', fillOpacity = 0.1, strokeOpacity = 1) {
    console.log("center, radius,color", center, radius, stokecolor);
    this.circle = new google.maps.Circle({
      strokeColor: stokecolor,
      strokeOpacity: strokeOpacity,
      strokeWeight: 2,
      fillColor: fillcolor,
      fillOpacity: fillOpacity,
      map: this.map,
      center: center,
      radius: radius
    });
    return this.circle;
  }
  routeData = null;
  getRoute(vehicleEvent) {
    console.log("show route", vehicleEvent);
    let status = this.VehicleStatusData.status ? this.VehicleStatusData.status : 10;
    this.dataType = 'events';
    //this.VehicleStatusData.latch_time = '2019-02-14 13:19:13';
    this.common.loading++;
    let params = "vId=" + this.VehicleStatusData.vehicle_id +
      "&fromTime=" + vehicleEvent.startTime +
      "&toTime=" + vehicleEvent.endTime +
      "&haltId=" + vehicleEvent.haltId +
      "&isProximity=1"
      ;

    this.api.get('HaltOperations/getTimeTrails?' + params)
      .subscribe(res => {
        this.common.loading--;
        if (this.polygonPath) {
          this.polygonPath.setMap(null);
          this.polygonPath = null;
        }
        this.routeData = res['data'];
        console.log('route data', this.routeData);
        this.routeData.forEach(rd => {
          this.createPolyPathManual(new google.maps.LatLng(rd.lat, rd.long));
        });
        this.animateCircle(this.polygonPath);
        console.log("this.polygonPath", this.polygonPath);

      }, err => {
        this.common.loading--;
        this.common.showError(err);
      })
  }
  polygonPath = null;
  lineSymbol = {
    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW
  };

  createPolyPathManual(latLng, polygonOptions?) {

    if (!this.polygonPath) {
      const defaultPolygonOptions = {
        strokeColor: 'black',
        strokeOpacity: 1,
        strokeWeight: 1,
        icons: [{
          icon: this.lineSymbol,
          offset: '0',
          strokeWeight: 3
          // repeat : '100px'
        }]
      };
      this.polygonPath = new google.maps.Polyline(polygonOptions || defaultPolygonOptions);
      this.polygonPath.setMap(this.map);
    }
    let path = this.polygonPath.getPath();
    path.push(latLng);
  }
  animateCircle(line) {
    var count = 0;
    setInterval(function () {
      count = (count + 1) % 200; // change this to 1000 to only show the line once
      var icons = line.get('icons');
      icons[0].offset = (count / 2) + '%';
      line.set('icons', icons);
    }, 25); // change this value to change the speed
  }

  tripVerification(status) {
    let remark = null;
    console.log('this.VehicleStatusData.verifystatus', this.VehicleStatusData.verifystatus);
    if (this.VehicleStatusData.verifystatus && this.VehicleStatusData.verifystatus == -2) {
      this.common.params = { remark: null, title: 'Add Objection ' }
      const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.response) {
          remark = data.remark;
          this.tripStampped(status, remark);
        }
      });
    }
    else {
      this.tripStampped(status);
    }
  }

  tripStampped(status, remark?) {

    console.log("this.tripId", this.tripId);
    let params = {
      tripId: this.tripId,
      status: status,
      remark: remark
    };
    ++this.common.loading;
    this.api.post('HaltOperations/tripVerification', params)
      .subscribe(res => {
        --this.common.loading;
        this.common.showToast(res['data'][0].y_msg);
        this.activeModal.close();

      }, err => {
        --this.common.loading;

      });
  }
  clusters = [];
  getClusteres(vehicleEvent) {
    console.log("vehicleEvent",vehicleEvent);
    this.clusters.forEach(e => {
      e.setMap(null);
    })
    this.clusters = [];
    this.resetClusterInfo();
    if(vehicleEvent.vs_id){
    this.common.loading++;
    let params = "vsId=" + vehicleEvent.vs_id;
    this.api.get('HaltOperations/getStateClustures?' + params)
      .subscribe(res => {
        this.common.loading--;

        res['data'].forEach((ele, index) => {
          this.vehicleEvents.map(ve => {
            let distance = this.common.distanceFromAToB(ve.lat, ve.long, ele.lat, ele.long, 'Mt');
            console.log("index,distance,ele.radius", index, distance, ele.radius);
            if (distance < ele.radius && !ve['clusterInfo']) {
              ve['clusterInfo'] = {
                index: index + 1,
                data: ele
              }
            }

          });
          this.clusters.push(this.createCirclesOnPostion(new google.maps.LatLng(ele.lat, ele.long), ele.radius, ele.strokeColor, ele.fillColor, ele.fillOpacity, ele.strokeOpacity));
          console.log('vehicleevents', this.vehicleEvents)

        }
        );

      }, err => {
        this.common.loading--;
        this.common.showError(err);
      })
    }else{
      this.common.showError("There is no clusters");
    }
  }
  resetClusterInfo() {
    this.vehicleEvents.map(ve => {
      if (ve['clusterInfo']) {
        ve['clusterInfo'] = false;
      }
    });
  }


  details(vehicleEvent) {

  }
 
  isSingleClick: Boolean = true;     

method1CallForClick(i,event){
   this.isSingleClick = true;
        setTimeout(()=>{
            if(this.isSingleClick){
              console.log('single click');
                 this.openSmartTool(i,event);
            }
         },250)
}
method2CallForDblClick(event){
         this.isSingleClick = false;
         console.log('double click');
        this.getClusteres(event);
}
}


