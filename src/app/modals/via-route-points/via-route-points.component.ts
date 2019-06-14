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
latlong;
location = '';
loc='';
siteNamee = '';
lat = null;
mapName = null;
duration = null;
kms = null;
long= null;
selected = 0;
siteId;
zoom = null;
latlng;
routeData = {
  siteId : null,
  lat : null,
  long : null,
  siteName: null
};
position = null;
mark = null;
  constructor(private activeModal: NgbActiveModal,
    public mapService: MapService,
    public common: CommonService,
    public api: ApiService) { 
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
      
      this.mapService.addListerner(this.mapService.map, 'click', evt => {
        if (this.selected == 1){
        
        console.log("latlong", evt.latLng.lat(), evt.latLng.lng());
        this.latlong = [{
          lat: evt.latLng.lat(),
          long: evt.latLng.lng(),
          color: 'FF0000',
          subType: 'marker'
        }];
        if (this.mark != null) {
          this.mark[0].setMap(null);
          this.mark = null;
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
      this.mapService.clearAll();
      this.reset();
    }
  }
  reset(){
    this.latlong = null;
    this.siteId = null;
    this.routeData.siteId = null;
    this.routeData.lat = null;
    this.routeData.long =
    console.log("Value are Null",this.latlong);
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
     
      routeId : null,
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
      }, err => {
        this.common.loading--;
        this.common.showError();
      })

  }
}

