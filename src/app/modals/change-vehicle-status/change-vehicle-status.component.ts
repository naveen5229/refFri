import { ChangeHaltComponent } from '../change-halt/change-halt.component';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

declare var google: any;

@Component({
  selector: 'change-vehicle-status',
  templateUrl: './change-vehicle-status.component.html',
  styleUrls: ['./change-vehicle-status.component.scss']
})

export class ChangeVehicleStatusComponent implements OnInit {

  title = '';
  map: any;
  @ViewChild('map') mapElement: ElementRef;
  location = {
    lat: 26.9124336,
    lng: 75.78727090000007,
    name: '',
    time: ''
  };
  VehicleStatusData;
  vehicleEvents:null
  marker: any;
  constructor(
    public modalService: NgbModal,
    public common:CommonService,
    public api:ApiService,
    private activeModal: NgbActiveModal,
  ) { 
    this.VehicleStatusData = this.common.params;
    this.common.handleModalSize('class', 'modal-lg', '1400');
    console.log("VehicleStatusData",this.VehicleStatusData);
    this.getEvents();
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
    };
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
    this.createMarker(lat, lng);
  }


  createMarker(lat = 26.9124336, lng = 75.78727090000007) {
    this.marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(lat, lng),
      draggable: false
    });
  }

   openChangeHaltModal(vehicleEvent,type) {
    this.common.changeHaltModal = type;
    this.common.params=vehicleEvent;
    const activeModal = this.modalService.open(ChangeHaltComponent, { size: 'sm', container: 'nb-layout',backdrop: 'static'});
    activeModal.result.then(data => {
     console.log("data",data.respone); 
     this.getEvents();
    });
  }

  showHalt(){
    console.log("show Halt");
    this.getEvents();
  }

  showTrail(){
    this.common.loading++;
    console.log("show trail");
    let params = {
      'vehicleId': this.VehicleStatusData.vehicle_id,
      'fromTime': this.VehicleStatusData.latch_time,
      'toTime': this.VehicleStatusData.ttime,
      'suggestId':this.VehicleStatusData.suggest
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

  getEvents(){
    //this.VehicleStatusData.latch_time = '2019-02-14 13:19:13';
    this.common.loading++;
    let params =  "vId="+this.VehicleStatusData.vehicle_id+
    "&fromTime="+this.VehicleStatusData.latch_time+
    "&toTime="+this.VehicleStatusData.ttime ;
     console.log(params);
    this.api.get('HaltOperations/getHaltHistory?' + params)
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

  designsDefaults=[
    "M  0,0,  0,-5,  -5,-5,-5,-13 , 5,-13 ,5,-5, 0,-5 z",///Rect
    "M  0,0,  0,-5,  -5,-13 , 5,-13 , 0,-5 z"//Pin
  ];
  bounds=null;
  Markers = [];
  createMarkers(markers,changeBounds=true,drawPoly=false) {

    let thisMarkers=[];
    console.log("Markers",markers);
    for (let index = 0; index < markers.length; index++) {
  
        let subType = markers[index]["subType"];
        let design = markers[index]["type"]=="site"?this.designsDefaults[0]:
         markers[index]["type"]=="subSite"?this.designsDefaults[1]:null;
        let text = markers[index]["text"]?markers[index]["text"]:" ";
        let pinColor = markers[index]["color"]?markers[index]["color"]:"FFFF00";
        let lat = markers[index]["lat"]?markers[index]["lat"]:25;
        let lng = markers[index]["long"]?markers[index]["long"]:75;
        let title = markers[index]["title"]?markers[index]["title"]:"Untitled";
        let latlng = new google.maps.LatLng(lat, lng);
        let pinImage;
        //pin Image  
        if(design){
          pinImage = {
            path:design,
            // set custom fillColor on each iteration
            fillColor: "#"+pinColor,
            fillOpacity: 1,
            scale: 1.3,
            strokeColor: pinColor,
            strokeWeight: 2
          };
        }else{
          if(subType=='marker')
          pinImage="http://chart.apis.google.com/chart?chst=d_map_xpin_letter&chld=pin|"+text+"|"+pinColor+"|000000";
           else //if(subType=='circle')
           pinImage = {
               path: google.maps.SymbolPath.CIRCLE,
               scale: 3,
               fillColor: "#"+pinColor,
               fillOpacity: 0.8,
               strokeWeight: 1
           };
        }
  
  
         var marker = new google.maps.Marker({
               position: latlng,
               flat:true,
               icon: pinImage,
               map: this.map,
               title:title
           });
          if(changeBounds)
            this.setBounds(latlng);
          thisMarkers.push(marker);
          this.Markers.push(marker);
         //  marker.addListener('click', fillSite.bind(this,item.lat,item.long,item.name,item.id,item.city,item.time,item.type,item.type_id));
         //  marker.addListener('mouseover', showInfoWindow.bind(this, marker, show ));
  
         // marker.addListener('click', fillSite.bind(this,item.lat,item.long,item.name,item.id,item.city,item.time,item.type,item.type_id));
         //  marker.addListener('mouseover', showInfoWindow.bind(this, marker, show ));
      }
     return thisMarkers;
    }
    setBounds(latlng) {
      if(!this.bounds)
        this.bounds = this.map.getBounds();
        this.bounds.extend(latlng);
        this.map.fitBounds(this.bounds);
    }
    toggleBounceMF(id,evtype=1){
        console.log("Bounce marker",id);
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
        markerZoomMF(id,zoomLevel=19,isReset=false) {
          var latLng = !isReset?this.Markers[id].position:new google.maps.LatLng(25,75);
          this.map.setCenter(latLng);
          this.setZoom(zoomLevel);
        }
        clearAllMarkers(reset=true,boundsReset=true) {
          for (var i = 0; i < this.Markers.length; i++) {
            this.Markers[i].setMap(null);
          }
          if(reset)
          this.Markers = [];
          if(boundsReset){
            this.markerZoomMF(null,19,true);
          }
        }

        closeModal(response) {
          this.activeModal.close({ response: response });
        }
        reviewComplete(){
          console.log("VehicleStatusData",this.VehicleStatusData);
          this.common.loading++;
          let params = {
            alertId : this.VehicleStatusData.id ,
            status : 1} ;          
          console.log(params);
          this.api.post('HaltOperations/reviewDone?' , params)
            .subscribe(res => {
              this.common.loading--;
              console.log(res);
              this.activeModal.close();
            }, err => {
              this.common.loading--;
              console.log(err);
            });
          this.activeModal.close();
        }
}
