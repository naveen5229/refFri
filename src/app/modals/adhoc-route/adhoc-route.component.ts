import { Component, OnInit } from '@angular/core';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
@Component({
  selector: 'adhoc-route',
  templateUrl: './adhoc-route.component.html',
  styleUrls: ['./adhoc-route.component.scss']
})
export class AdhocRouteComponent implements OnInit {
  vehicleId = null;
  vehicleNo = null;
  endLat= null;
  endLng= null;
  endName= null;
  endLocId=null;
  startLat= null;
  startLng= null;
  startName= null;
  startLocId=null;
  endLocationType = 'site';
  startLocationType = 'site';
  routeName = null;
  viaPoints =[{
    name : null,
    lat : null,
    long : null,
    locType : 'site',
    siteId  : null,
    type :1,
    radius : 200,
    tat:0,
    haltTime:0
  }];
  startTime = new Date();
  destTat = null;
  destHaltTime = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    private datePipe: DatePipe,
    private modalService: NgbModal,
    private sanitizer: DomSanitizer) { 
    this.vehicleId = this.common.params.vehicle.id;
    this.vehicleNo = this.common.params.vehicle.regNo;
  }

  ngOnInit(): void {
  }

  closeModal() {
    this.activeModal.close();
  }
  selectLoactionSite(flag,event){
    if(flag=='start'){
    console.log(flag,event,"start");
      this.startLat = event.lat;
      this.startLng = event.long;
      this.startName = event.name;
      this.startLocId = event.id;
    }else if(flag=='end'){
      console.log(flag,event,"end");
      this.endLat = event.lat;
      this.endLng = event.long;
      this.endName = event.name;
      this.endLocId = event.id;
    }
  }

  selectLocationCity(flag,event){
    console.log("flag,event",flag,event);
    if(flag=='start'){
      console.log(flag,event,"start");
      this.startLat = event.lat;
      this.startLng = event.long;
      this.startName = event.location;
      this.startLocId = event.id;

    }else if(flag=='end'){
      console.log(flag,event,"end");
      this.endLat = event.lat;
      this.endLng = event.long;
      this.endName = event.location;
      this.endLocId = event.id;

    }
  }
  addNew(){
    let vp =  {
       name:null,
       lat:null,
       long:null,
       locType : 'site',
       siteId:null,
       type :1,
       radius : 200,
       tat:0,
       haltTime:0
     };
     this.viaPoints.push(vp);
   }

   selectSite(event,i){
    console.log("event",event)
   this.viaPoints[i].name = event.name || event.location;
   this.viaPoints[i].lat = event.lat;
   this.viaPoints[i].long = event.long;
   this.viaPoints[i].siteId = event.id;
  }
  addRoute() {
    let stPoint = {
      name : this.startName,
      lat : this.startLat,
      long : this.startLng,
      locType : this.startLocationType,
      siteId  : this.startLocId,
      type :1,
      radius : 200
    };

    let edPoint = {
      name : this.endName,
      lat : this.endLat,
      long : this.endLng,
      locType : this.endLocationType,
      siteId  : this.endLocId,
      type :1,
      radius : 200,
      tat: this.destTat,
      haltTime:this.destHaltTime
    };
     console.log("edPoint",edPoint);
    let vp = JSON.parse(JSON.stringify(this.viaPoints));
   vp.unshift(stPoint,edPoint);
    const params = {
      name: this.routeName,
      kms: 0,
      routeType: 1,
      viaPoints:vp,
      vehicleId:this.vehicleId,
      startTime: this.startTime ? this.common.timeFormatter(this.startTime) : null,
    };
    console.log("Data :", params);
    this.common.loading++;
    this.api.post('ViaRoutes/saveAddHocRoute', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("test", res['data'][0].y_msg);
        if (res['data'][0].y_id <= 0) {
          this.common.showError(res['data'][0].y_msg);    
          return;
        }
        else {
          this.common.showToast(res['data'][0].y_msg);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
