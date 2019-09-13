import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'routes-timetable',
  templateUrl: './routes-timetable.component.html',
  styleUrls: ['./routes-timetable.component.scss']
})
export class RoutesTimetableComponent implements OnInit {
  routesDetails = [];
  vehId = null;
  routeId = null;
  routeTTId = null;

  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal) {
    console.log("test", this.common.params.routeTime.routeId);

    if (this.common.params && this.common.params.routeTime) {
      this.vehId = this.common.params.routeTime.vehicleId;
      this.routeId = this.common.params.routeTime.routeId;
      this.routeTTId = this.common.params.routeTime.routeTimeId;
    }

    this.getRoutes();
  }

  ngOnInit() {
  }

  getRoutes() {
    let params = {
      vehicleId: this.vehId,
      routeId: this.routeId,
      routeTtId: this.routeTTId,
    }

    this.common.loading++;
    this.api.post('ViaRoutes/getVehicleTimeTable', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('getRoutesWrtFo:', res);
        this.routesDetails = res['data'];
        this.statusFinder();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  statusFinder() {
    this.routesDetails.map((route, index) => {
      if(route.delay){
        if(route.delay.toString()>"00:00"){
          route['status']='0';
        }
        else if(route.delay.toString()=="00:00"){
          route['status']='1';
        }       
      }else{
        route['status']='2'
      }  
      if(index==0){
        route['status']='1';
      }
     
      
      // if (index == 0) {
      //   route.class = 'completed';
        
      // } else if (index == 1) {
      //   route.class = 'delayed';
        
      // } else if (index == 2) {
      //   route.class = 'running';
      // } else {
      //   route.class = "upcoming";
      // }
    });
    console.log("class",this.routesDetails);
  }

  closeModal() {
    this.activeModal.close();
  }
}
