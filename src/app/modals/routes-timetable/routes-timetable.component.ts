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
  isLastStop = -1;
  routetrip=0;
  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal) {
    console.log("test", this.common.params.routeTime.routeId);

    if (this.common.params && this.common.params.routeTime) {
      this.vehId = this.common.params.routeTime.vehicleId;
      this.routeId = this.common.params.routeTime.routeId;
      this.routeTTId = this.common.params.routeTime.routeTimeId;
      this.routetrip = (this.common.params.routeTime.routetrip)?this.common.params.routeTime.routetrip:0;
    }
  if(this.routetrip==0){
      this.getRoutes();
  }else{
    this.getRoutesHistory();
  }
  }

  ngOnInit() {
  }

  getRoutes() {
    console.log('hello dear');
    let params = {
      vehicleId: this.vehId,
      routeId: this.routeId,
      routeTtId: this.routeTTId,
    }

    this.common.loading++;
    this.api.post('ViaRoutes/getVehicleTimeTable1', params)
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
  getRoutesHistory() {
    let params = {
      routeId: this.routeId
    }

    this.common.loading++;
    this.api.post('TripExpenseVoucher/getVehicleTimeTable', params)
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
      if (index == 0) {
        route['status'] = '1';
      }else if (route.delay) {
        if (route.delay.charAt(0) == "-") {
          route['status'] = '1';
          this.isLastStop=-1;
        } else {
          route['status'] = '0';
          this.isLastStop=-1;
        }
      } else {
        route['status'] = '2';
        if (this.routesDetails[index - 1].status == 0 || this.routesDetails[index - 1].status == 1) {
          this.isLastStop = index;
        }
      }
    });
  }

  closeModal() {
    this.activeModal.close();
  }
}
