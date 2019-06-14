import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../services/map.service';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'via-route-points',
  templateUrl: './via-route-points.component.html',
  styleUrls: ['./via-route-points.component.scss']
})
export class ViaRoutePointsComponent implements OnInit {
latlong=[{lat:null,long:null,color:null,subType:null}];
locType="site";
polypath =[];
markerlat = null;
markerlong = null;
location = '';
loc='';
siteNamee = '';
rowCoordinates;
tableData=[];
lat = null;
mapName = null;
duration = null;
kms = null;
long= null;
doc;
selected = 0;
siteId;
zoom = null;
routeId = null;
firstCoordinates;
secondCoordinates;
latlng;
rowId;
routeData = {
  siteId : null,
  lat : null,
  long : null,
  siteName: null
};
position = null;
mark = null;
viaMark = [];
  constructor(private activeModal: NgbActiveModal,
    public mapService: MapService,
    public common: CommonService,
    public api: ApiService) { 
      this.doc = this.common.params.doc;
      this.routeId = this.doc._id;
      this.firstCoordinates = [{
        lat: this.doc._start_lat,
        lng: this.doc._start_long,
        color: '00FF00',
        subType: 'marker'},
       { lat: this.doc._end_lat,
        lng: this.doc._end_long,
        color: 'FF0000',
        subType: 'marker'
      }];
      console.log(this.secondCoordinates);
     
   
      this.viewTable();
      console.log("RouteID-->",this.routeId);
      setTimeout(() => {

        this.mapService.autoSuggestion("loc", (place, lat, lng) => {
          console.log('Lat: ', lat);
          console.log('Lng: ', lng);
          console.log('Place: ', place);
          console.log("position", this.position);
          this.loc = place;
          this.zoom = this.mapService.zoomAt(this.mapService.createLatLng(lat,lng) , 11);
        });
  
      }, 2000)
    }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  ngAfterViewInit() {
    this.mapService.mapIntialize("map");
    this.mapService.setMapType(0);
    this.mapService.zoomMap(5);
    this.mapService.map.setOptions({ draggableCursor: 'cursor' });
    
    setTimeout(() => {
     this.mapService.createMarkers(this.firstCoordinates);
      this.mapService.addListerner(this.mapService.map, 'click', evt => {
        if (this.selected == 1){
        
        console.log("latlong", evt.latLng.lat(), evt.latLng.lng());
        this.latlong = [{
          lat: evt.latLng.lat(),
          long: evt.latLng.lng(),
          color: '0000FF',
          subType: 'marker'
        }];
        if (this.mark != null) {
          this.mark[0].setMap(null);
        }
        this.mark = this.mapService.createMarkers(this.latlong, false, false);
        }
       
      });
    }, 1000);
  

  }
  setRadio(type){
    if (type == 1){
      this.selected =1;
      this.reset();
    }
    else{
      this.selected = 0;
      this.mark[0].setMap(null);
      this.reset();
    }
  }
  reset(){
    this.latlong = null;
    this.siteId = null;
    this.routeData.siteId = null;
    this.routeData.lat = null;
    this.routeData.long = null;
    console.log("Value are Null",this.latlong);
  }
  viewTable(){
    this.common.loading++;
    this.api.get('ViaRoutes/viewvia?routeId='+ this.routeId)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        let data = res['data'];
        this.tableData = data;
        this.rowCoordinates = [];
        this.mapService.resetPolyPath();
        this.viaMark = [];
        this.viaMark.forEach(mark => {
          mark.setMap(null);
        });
        
        for (let i = 0; i < this.tableData.length; i++){
          this.rowCoordinates.push({
            lat: this.tableData[i]._lat,
            lng : this.tableData[i]._long,
          });
        }
        this.polypath=[];
        if(this.tableData.length)
          this.viaMark = this.mapService.createMarkers(this.rowCoordinates);
        this.polypath.push({ lat:  this.doc._start_lat, lng:  this.doc._start_long });
        for (let i = 0; i < this.tableData.length; i++){
          this.rowCoordinates.push({
            lat: this.tableData[i]._lat,
            lng : this.tableData[i]._long,
          });
          this.polypath.push({ lat:  this.tableData[i]._lat, lng:  this.tableData[i]._long });
        }
        this.polypath.push({ lat:  this.doc._end_lat, lng:  this.doc._end_long });
        console.log("Polypath--->", this.polypath);
        for (let i = 0; i < this.polypath.length; i++){
          this.mapService.createPolyPathManual(this.mapService.createLatLng(this.polypath[i].lat, this.polypath[i].lng));
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }
  deleteRoutes(i){
    let params = {
      routeId : this.routeId,
      id : this.tableData[i]._id
    }
    console.log(params);
    this.common.loading++;
    this.api.post('ViaRoutes/deletevia', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.viewTable();
        if (res['success']){
          this.common.showToast("Success");
        }
        else {
          this.common.showToast(res['msg']);
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
      
  }

  
  selectSite(site) {
    console.log("Site Data", site);
 
    this.routeData.siteId = site.id;
    this.routeData.lat = site.lat;
    this.routeData.long = site.long;
    this.routeData.siteName = site.name;
  }
  sendRoute(){
    if (this.selected == 1){
      this.siteNamee = this.mapName,
      this.lat = this.latlong[0].lat,
      this.long = this.latlong[0].long,
      this.siteId = null
    }
    if (this.selected == 0){
      this.siteNamee = this.routeData.siteName,
      this.lat = this.routeData.lat,
      this.long = this.routeData.long,
      this.siteId =  this.routeData.siteId
    }
    let params = {
     
      routeId : this.routeId,
      lat: this.lat,
      long: this.long,
      duration : this.duration,
      kms : this.kms,
      siteId :this.siteId,
      name: this.siteNamee
    };
    console.log(params);
    this.common.loading++;
    this.api.post('ViaRoutes/insertvia', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        this.mark[0].setMap(null);
        this.locType="site";
        this.viewTable();
        this.mapName = null;
        this.duration = null;
        this.kms = null;
        if (res['data'][0]['y_id'] <= 0){
          this.common.showToast(res['data'][0]['y_msg']);
        }
        else{
          this.common.showToast("Success");         
        }
      }, err => {
        this.common.loading--;
        this.common.showError();
      })
     

  }
}