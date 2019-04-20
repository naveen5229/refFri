import { ChangeHaltComponent } from '../change-halt/change-halt.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { DatePickerComponent } from '../date-picker/date-picker.component';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatExpansionModule } from '@angular/material/expansion';
import { resetComponentState } from '@angular/core/src/render3/instructions';
import { ReportIssueComponent } from '../report-issue/report-issue.component';
import { RemarkModalComponent } from '../../modals/remark-modal/remark-modal.component';

declare let google: any;

@Component({
  selector: 'resolve-missing-industry',
  templateUrl: './resolve-missing-industry.component.html',
  styleUrls: ['./resolve-missing-industry.component.scss']
})
export class ResolveMissingIndustryComponent implements OnInit {

  panelOpenState = false;
  title = '';
  map: any;
  @ViewChild('map') mapElement: ElementRef;
  location = {
    lat: 26.9124336,
    lng: 75.78727090000007,
    name: '',
    time: ''
  };
  btnStatus = false;
  lUlBtn = false;
  dataType = 'events';
  VehicleStatusData;
  vehicleEvents = [];
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
  toTime= this.common.dateFormatter(new Date());
  constructor(
    public modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal,
  ) {
    this.VehicleStatusData = this.common.params;
    this.common.handleModalSize('class', 'modal-lg', '1600');
    console.log("VehicleStatusData", this.VehicleStatusData);
    this.getLastIndDetails();
    this.getEvents();
    this.getLoadingUnLoading();
    console.log("date1",this.toTime);
  }

  ngOnInit() {
  }
  ngAfterViewInit() {
    console.log('ionViewDidLoad MarkerLocationPage');
    // this.location = this.common.params['location'];
    this.loadMap(this.location.lat, this.location.lng);
  }

  loadMap(lat = 26.9124336, lng = 75.78727090000007) {
    let mapOptions = {
      center: new google.maps.LatLng(lat, lng),
      zoom: 8,
      disableDefaultUI: true,
      mapTypeControl: false,
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
    // this.createMarker(lat, lng);
  }


  // createMarker(lat = 26.9124336, lng = 75.78727090000007) {
  //   this.marker = new google.maps.Marker({
  //     map: this.map,
  //     animation: google.maps.Animation.DROP,
  //     position: new google.maps.LatLng(lat, lng),
  //     draggable: false
  //   });
  // }

  openChangeHaltModal(vehicleEvent, type) {
    this.common.changeHaltModal = type;
    this.common.passedVehicleId = this.VehicleStatusData.vehicle_id;
    this.common.params = vehicleEvent;
    const activeModal = this.modalService.open(ChangeHaltComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // console.log("data", data.respone);
      this.getEvents();
    });
  }

  showHalt() {
    console.log("show Halt");
    this.getEvents();
  }

  showTrail() {
    this.dataType = 'trails';
    this.common.loading++;
    console.log("show trail");
    let params = {
      'vehicleId': this.VehicleStatusData.vehicle_id,
      'fromTime': this.VehicleStatusData.latch_time,
      'toTime': this.toTime,
      'suggestId': this.VehicleStatusData.suggest,
      'status': this.VehicleStatusData.status?this.VehicleStatusData.status:10
    }
    console.log(params);
    this.api.post('VehicleStatusChange/getVehicleTrail', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.vehicleEvents = res['data'];
        this.clearAllMarkers();
        this.createMarkers(res['data']);
      }, err => {
        this.common.loading--;
        console.log(err);
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

  getEvents() {
    let status = this.VehicleStatusData.status?this.VehicleStatusData.status:10;
    this.dataType = 'events';
    //this.VehicleStatusData.latch_time = '2019-02-14 13:19:13';
    this.common.loading++;
    let params = "vId=" + this.VehicleStatusData.vehicle_id +
      "&fromTime=" + this.VehicleStatusData.latch_time +
      "&toTime=" + this.toTime+
      "&status=" +status;  
    console.log(params);
    this.api.get('HaltOperations/getHaltHistory?' + params)
      .subscribe(res => {
        this.common.loading--; 
        console.log(res);
        this.vehicleEvents = res['data'];
        this.clearAllMarkers();
        this.createMarkers(res['data']);
        this.resetBtnStatus();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  resetBtnStatus() {
    this.btnStatus = false;
    this.vehicleEvents.forEach(vehicleEventDetail => {
      // console.log("vehicleEventDetail", vehicleEventDetail)
      if (vehicleEventDetail.color == '88ff4d' || vehicleEventDetail.color == 'ff4d4d') {
        this.btnStatus = true;
        return;
      }
    });
  }

  getLoadingUnLoading() {
    this.dataType = 'events';
    //this.VehicleStatusData.latch_time = '2019-02-14 13:19:13';
    this.common.loading++;
    let params = "vId=" + this.VehicleStatusData.vehicle_id +
      "&latchTime=" + this.VehicleStatusData.latch_time +
      "&toTime=" + this.toTime;
    console.log(params);
    this.api.get('HaltOperations/getMasterHaltDetail?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.loadingUnLoading = res['data'];
        console.log("this.loadingUnLoading", this.loadingUnLoading);
      }, err => {
        this.common.loading--;
        console.log(err);
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
    console.log("Markers", markers);
    this.bounds = new google.maps.LatLngBounds();
    for (let index = 0; index < markers.length; index++) {
 
      let subType = markers[index]["subType"];
      let design = markers[index]["type"] == "site" ? this.designsDefaults[0] :
        markers[index]["type"] == "subSite" ? this.designsDefaults[1] :null ;//this.designsDefaults[2]
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
        if (subType == 'marker'){
          pinImage = "http://chart.apis.google.com/chart?chst=d_map_xpin_letter&chld=pin%7C" + text + "|" + pinColor + "|000000";
          // console.log("Pin Image:",pinImage);
 
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
      if (changeBounds&&!(''+markers[index]['desc']).endsWith('LT'))
        this.setBounds(latlng);
      thisMarkers.push(marker);
      // console.log("ThisMarker: ",thisMarkers);
 
      this.Markers.push(marker);
 
      if (markers[index]["type"] == "site") {
        let show = markers[index]['name'] + " , " + markers[index]['typename'] + " , " + markers[index]['id'];
        marker.addListener('mouseover', this.showInfoWindow.bind(this, show, marker));
        marker.addListener('mouseout', this.closeInfoWindow.bind(this));
        marker.addListener('click', this.convertSiteHalt.bind(this, markers[index]['id']));
 
      }
      // else {
      //   let show = text;
      //   marker.addListener('mouseover', this.showInfoWindow.bind(this, show, marker));
      //   marker.addListener('mouseout', this.closeInfoWindow.bind(this));
      //   marker.addListener('click', this.convertSiteHalt.bind(this, markers[index]['id']));
 
      // }
      // marker.addListener('click', fillSite.bind(this,item.lat,item.long,item.name,item.id,item.city,item.time,item.type,item.type_id));
      //  marker.addListener('mouseover', showInfoWindow.bind(this, marker, show ));
    }
    return thisMarkers;
  }
  setBounds(latlng) {
    if (!this.bounds)
      this.bounds = this.map.getBounds();
    this.bounds.extend(latlng);
    this.map.fitBounds(this.bounds);
  }
  toggleBounceMF(id, evtype = 1) {
    //console.log("Bounce marker",id);
    //console.log("index",index);
    //.log("test",test);
    //console.log("item",item);
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
      this.markerZoomMF(null, 19, true);
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
    console.log("VehicleStatusData", this.VehicleStatusData);
    this.common.loading++;
    let params = {
      rowId : this.VehicleStatusData.id,
      remark:this.VehicleStatusData.remark || null,
      status: status,
      
    };
    if(params.status==-1)
    { 
      this.common.loading--;
      this.openConrirmationAlert(params);
      // this.activeModal.close();
      return ;
    }
    console.log("param:",params);  
    this.api.post('MissingIndustry/edit', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.activeModal.close();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    // this.activeModal.close();
  }

  openConrirmationAlert(params) {
          

    this.common.params={remark:params.remark,title:'Reject Reason '}
   
    
    const activeModal = this.modalService.open(RemarkModalComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        console.log("reason For delete: ", data.remark);
        params.remark = data.remark;
        this.common.loading++;
        this.api.post('MissingIndustry/edit', params)
          .subscribe(res => {
            this.common.loading--;
            console.log("data", res);
            this.activeModal.close();

          }, err => {
            this.common.loading--;
            console.log(err);

          });
      }
    });
  }




  getLastIndDetails() {
    console.log("VehicleStatusData", this.VehicleStatusData);
    this.common.loading++;
    let params = "vehId=" + this.VehicleStatusData.vehicle_id;
    console.log(params);
    this.api.get('HaltOperations/lastIndustryDetails?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.lastIndDetails = res['data'][0];
        if(this.lastIndDetails){
          console.log("lastIndDetails", this.lastIndDetails);
          this.calculateDistanceAndTime(this.lastIndDetails, this.VehicleStatusData.latch_lat, this.VehicleStatusData.latch_long, this.VehicleStatusData.latch_time);
          this.lastIndType = this.lastIndDetails.li_type;
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  zoomFunctionality(i, vehicleEvent) {
    console.log("vehicleEvent", vehicleEvent);
    this.markerZoomMF(i, 19);
    this.calculateDistanceAndTime(this.lastIndDetails, vehicleEvent.lat, vehicleEvent.long, vehicleEvent.time);
    console.log("vehicleEvent.siteId", vehicleEvent.y_site_id)
    if (vehicleEvent.y_site_id) {
      console.log("vehicleEvent.siteId", vehicleEvent.y_site_id)
      this.fnLoadGeofence(vehicleEvent.y_site_id);
    }
  }

  showHide() {
    let showHide = this.showHideSite;
    if (showHide == 'SS') {
      //this.setZoom(13);
      console.log("Show Site");
      this.showHideSite = 'HS';
      this.getSites();
    } else {
      this.showHideSite = 'SS';
      console.log("Hide Site");
      this.clearOtherMarker(this.siteMarkers);

    }
  }


  siteMarkers = [];

  getSites() {
    if (this.map) {
      this.common.loading++;
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
      console.log(params);
      this.api.post('VehicleStatusChange/getSiteAndSubSite?', params)
        .subscribe(res => {
          console.log(res);
          if (this.siteMarkers.length == 0) {
            this.siteMarkers = this.createMarkers(res['data'], false);
            this.common.loading--;
          }
          else {
            this.clearOtherMarker(this.siteMarkers);
            this.siteMarkers = this.createMarkers(res['data'], false);
            this.common.loading--;
          }

        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
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
    console.log("this.distDiff", this.distDiff);
    console.log("this.timeDiff", this.timeDiff);
  }

  Fences = null;
  FencesPoly = null;
  fnLoadGeofence(siteId) {
    this.common.loading++;

    let params = {
      siteId: siteId
    };

    this.api.post('SiteFencing/getSiteFences', params)
      .subscribe(res => {
        let data = res['data'];
        let count = Object.keys(data).length;
        console.log('Res: ', res['data']);
        if (count > 0) {
          let latLngsArray = [];
          let mainLatLng = null;
          for (const datax in data) {
            if (data.hasOwnProperty(datax)) {
              const datav = data[datax];
              if (datax == siteId)
                mainLatLng = datav.latLngs;
              latLngsArray.push(datav.latLngs);
              console.log("Multi", datax);
            }
          }
          this.createPolygons(latLngsArray, mainLatLng);
        }
        else {
          console.log("Else");
        }
        this.common.loading--;
      }, err => {
        this.common.loading--;
        console.log(err);
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
    console.log(this.onlyDrag);
    if (!this.onlyDrag) {
      this.vehicleEvents.forEach(vEvent => {
        if (vEvent != vehicleEvent)
          vEvent.isOpen = false;
      });
      vehicleEvent.isOpen = !vehicleEvent.isOpen;
      this.zoomFunctionality(i, vehicleEvent);
      this.getSites();
    }
    this.onlyDrag = false;
  }


  drop(event: CdkDragDrop<string[]>) {
    console.log('Event: ', event);
    //moveItemInArray(this.vehicleEvents, event.previousIndex, event.currentIndex);
    //console.log("hiiiiii",this.vehicleEvents, event.previousIndex, event.currentIndex);
  }

  onDragEnded(event, index, movedItem) {
    console.log('onDragEnded: ', event, index, movedItem);
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
    console.log("SiteMerge");
    console.log('Moved: ', movedItem);
    console.log('Moved On: ', movedOnItem);
    let params = {
      dragHaltId: movedItem.haltId,
      dropHaltId: movedOnItem.haltId
    };
    console.log(params);
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
        console.log(err);
      });
  }
  setSiteHalt(vehicleEvent, convertSiteHaltFlag) {
    this.convertSiteHaltFlag = convertSiteHaltFlag;
    this.vehicleEvent = vehicleEvent;

  }

  convertSiteHalt(siteId) {
    console.log(this.convertSiteHaltFlag);
    if (this.convertSiteHaltFlag) {
      this.common.loading++;
      let params = {
        vehicleHaltRowId: this.vehicleEvent.haltId,
        siteId: siteId,
      };
      console.log(params);
      this.api.post('HaltOperations/allocateVehicleHaltToSite', params)
        .subscribe(res => {
          this.common.loading--;
          console.log(res);
          this.reloadData();

          this.convertSiteHaltFlag = false;

        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  }

  deleteHalt(vehicleEvent) {
    this.common.loading++;
    let params = {
      haltId: vehicleEvent.haltId,
    };
    console.log(params);
    this.api.post('HaltOperations/deleteHalt', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.reloadData();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  infowindow = null;
  showInfoWindow(show, marker) {
    console.log('Info:', show);
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

 

  reportIssue(vehicleEvent){
    this.common.params= {refPage : 'vsc'};
    console.log("reportIssue",vehicleEvent);
    const activeModal = this.modalService.open(ReportIssueComponent, { size: 'sm', container: 'nb-layout' });
    activeModal.result.then(data => data.status && this.common.reportAnIssue(data.issue, vehicleEvent.haltId));

  }

  addAutomaticHalt(){
    
  }
}
