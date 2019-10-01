import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
declare let google: any;

@Component({
  selector: 'un-merge-state',
  templateUrl: './un-merge-state.component.html',
  styleUrls: ['./un-merge-state.component.scss']
})
export class UnMergeStateComponent implements OnInit {
  unMergeStatus = {
    vehicleId: null,
    regno: null,

  };
  map: any;
  @ViewChild('map') mapElement: ElementRef;
  location = {
    lat: 26.9124336,
    lng: 75.78727090000007,
    name: '',
    time: ''
  };
  unMergeEvents = [];
  vehicleEventsR = [];
  Markers = [];
  designsDefaults = [
    "M  0,0,  0,-5,  -5,-5,-5,-13 , 5,-13 ,5,-5, 0,-5 z",///Rect
    "M  0,0,  0,-5,  -5,-13 , 5,-13 , 0,-5 z",//Pin
    "M  0,0,  0,-5,  -5,-13 , 5,-13 , 0,-5 z"///Rect
  ];
  bounds = null;
  infowindow = null;
  btnStatus = true;
  vSId = null;
  isChecks = {};
  hsId: any;
  onlyDrag = false;
  lastIndDetails = null;

  polygons = [];
  constructor(public modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,
    private activeModal: NgbActiveModal) {
    this.common.handleModalSize('class', 'modal-lg', '1600', 'px');
    if (this.common.params && this.common.params.unMergeStateData) {
      this.unMergeStatus.vehicleId = this.common.params.unMergeStateData.vehicleId;
      this.unMergeStatus.regno = this.common.params.unMergeStateData.regno;
      console.log("vehicle Id:", this.unMergeStatus);
      this.getUnMergeStates();
    }
  }

  ngOnInit() {
  }


  closeModal() {
    this.activeModal.close();
  }

  ngAfterViewInit() {
    console.log('ionViewDidLoad MarkerLocationPage');
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

  getUnMergeStates() {
    let params = "vehicleId=" + this.unMergeStatus.vehicleId;
    console.log(params);
    this.common.loading++;
    this.api.get('HaltOperations/getUnmergedLrState?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log("Api result,", res);
        this.unMergeEvents = res['data'];
        this.clearAllMarkers();
        this.createMarkers(res['data']);
        this.resetBtnStatus();
        // ------------------------ Route Mapper Code (Authored by UJ) ----------------------
        let startElement = this.unMergeEvents.find((element) => {
          return !(element.desc + "").includes('LT');
        });
        this.unMergeEvents.forEach((element) => {
          if ((element.haltTypeId == 21 || element.haltTypeId == 11)
            && (element.desc + "").includes('LT'))
            element.lastType = element.haltTypeId;
          else
            element.lastType = null;
        });
        console.log("StartElement", startElement);
        if (startElement) {
          let start = startElement.startTime;
          let startIndex = this.unMergeEvents.indexOf(startElement);
          let end = this.unMergeEvents[this.unMergeEvents.length - 1].endTime;
          console.log(res);
          this.vehicleEventsR = [];
          let unMergeEvents = res['data'];
          let realStart = new Date(unMergeEvents[startIndex].startTime) < new Date(start) ?
            unMergeEvents[startIndex].startTime : start;
          let realEnd = null;
          if (unMergeEvents[0].endTime)
            realEnd = new Date(unMergeEvents[unMergeEvents.length - 1].endTime) > new Date(end) ?
              unMergeEvents[unMergeEvents.length - 1].endTime : end;
          let totalHourDiff = 0;
          if (unMergeEvents.length != 0) {
            totalHourDiff = this.common.dateDiffInHours(realStart, realEnd, true);
            console.log("Total Diff", totalHourDiff);
          }
          for (let index = startIndex; index < unMergeEvents.length; index++) {
            unMergeEvents[index].mIndex = index;
            startIndex++;
            unMergeEvents[index].position = (this.common.dateDiffInHours(
              realStart, unMergeEvents[index].startTime) / totalHourDiff) * 98;
            unMergeEvents[index].width = (this.common.dateDiffInHours(
              unMergeEvents[index].startTime, unMergeEvents[index].endTime, true) / totalHourDiff) * 98;
            console.log("Width", unMergeEvents[index].width);
            this.vehicleEventsR.push(unMergeEvents[index]);
          }
          console.log("unMergeEvents", this.vehicleEventsR);
        }



      }, err => {
        this.common.loading--;
        this.common.showError(err);
        console.log(err);
      })
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
  markerZoomMF(id, zoomLevel = 19, isReset = false) {
    let latLng = !isReset ? this.Markers[id].position : new google.maps.LatLng(25, 75);
    this.map.setCenter(latLng);
    this.setZoom(zoomLevel);
  }
  setZoom(zoom) {
    this.map.setZoom(zoom);
    if (zoom >= 15) {
      this.map.setMapTypeId('hybrid');
    } else {
      this.map.setMapTypeId('roadmap');
    }
  }
  createMarkers(markers, changeBounds = true, drawPoly = false) {

    let thisMarkers = [];
    console.log("Markers", markers);
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
          console.log("Pin Image:", pinImage);

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
      console.log("ThisMarker: ", thisMarkers);

      this.Markers.push(marker);

      if (markers[index]["type"] == "site") {
        let show = markers[index]['name'] + " , " + markers[index]['typename'] + " , " + markers[index]['id'];
        marker.addListener('mouseover', this.showInfoWindow.bind(this, show, marker));
        marker.addListener('mouseout', this.closeInfoWindow.bind(this));
        // marker.addListener('click', this.convertSiteHalt.bind(this, markers[index]['id']));

      }

    }
    return thisMarkers;
  }

  setBounds(latlng) {
    if (!this.bounds)
      this.bounds = this.map.getBounds();
    this.bounds.extend(latlng);
    this.map.fitBounds(this.bounds);
  }
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

  closeInfoWindow() {
    this.infowindow.close();
  }

  resetBtnStatus() {
    this.btnStatus = true;
    this.unMergeEvents.forEach(vehicleEventDetail => {
      console.log("vehicleEventDetail", vehicleEventDetail)
      if (vehicleEventDetail.color == 'ff13ec') {
        this.btnStatus = false;
        return;
      }
    });
  }

  openSmartTool(i, vehicleEvent) {
    if (this.vSId != null && this.hsId != vehicleEvent.haltId && vehicleEvent.haltId != null)
      // if (confirm("Merge with this Halt?")) {
      //   this.common.loading++;
      //   let params = { ms_id: this.vSId, hs_id: vehicleEvent.vs_id };
      //   console.log("params", params);
      //   this.api.post('HaltOperations/mergeManualStates', params)
      //     .subscribe(res => {
      //       this.common.loading--;
      //       if (res['success']) {
      //         this.reloadData();
      //       } else {
      //         this.common.showToast(res['msg']);
      //         this.reloadData();
      //       }
      //     }, err => {
      //       this.common.loading--;
      //       this.common.showError(err);
      //       console.log(err);
      //     });
      // }
      this.vSId = null;
    this.isChecks = {};
    console.log(this.onlyDrag);
    if (!this.onlyDrag) {
      this.unMergeEvents.forEach(vEvent => {
        if (vEvent != vehicleEvent)
          vEvent.isOpen = false;
      });
      vehicleEvent.isOpen = !vehicleEvent.isOpen;
      this.zoomFunctionality(i, vehicleEvent);
      // this.getSites();
    }
    this.onlyDrag = false;
  }

  zoomFunctionality(i, vehicleEvent) {
    console.log("vehicleEvent", vehicleEvent);
    this.markerZoomMF(i, 19);
    console.log(">>>>>>>>>>>>>>>>", this.lastIndDetails);

    console.log("vehicleEvent.siteId", vehicleEvent.site_type_id)
    if (vehicleEvent.site_type_id) {
      console.log("vehicleEvent.siteId", vehicleEvent.site_type_id)
      this.fnLoadGeofence(vehicleEvent.site_type_id);
    }
  }


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
        this.common.showError(err);
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


}
