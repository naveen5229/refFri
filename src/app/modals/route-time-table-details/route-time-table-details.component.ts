import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'route-time-table-details',
  templateUrl: './route-time-table-details.component.html',
  styleUrls: ['./route-time-table-details.component.scss']
})
export class RouteTimeTableDetailsComponent implements OnInit {
  routesDetails = [];
  routeId = null;
  routesData = [];
  routeTimes = [];
  routeTime = null;
  routeName = null;
  routeTimeName = null;

  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal) {
    if (this.common.params && this.common.params.route) {
      console.log("this.common.params.route",this.common.params.route)
      this.routeId = this.common.params.route._route_id;
      this.routeName = this.common.params.route._route_name;
      this.routeTimeName = this.common.params.route._rtt_name;
      this.routeTime = this.common.params.route._rtt_id;
    }
    if (this.routeId) {
      this.getrouteTime();

    }
    if (this.routeTime && this.routeId) {
      this.getrouteTimeDetails();

    }


    this.getRoutes();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getRoutes() {
    this.common.loading++;
    this.api.get('Suggestion/getRoutesWrtFo')
      .subscribe(res => {
        this.common.loading--;
        console.log('getRoutesWrtFo:', res);
        this.routesDetails = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  changeRouteType(type) {
    this.routeId = type.id;
    if (this.routeId) {
      this.getrouteTime();

    }



    // this.routeId = this.routesDetails.find((element) => {
    //   console.log(element.name == type);
    //   return element.id == type.id;
    // }).id;
  }
  changeRouteTime(time) {
    this.routeTime = time.id;
    this.getrouteTimeDetails();
  }
  getrouteTime() {
    this.common.loading++;
    this.api.get('ViaRoutes/getTimeTable?routeId=' + this.routeId + '&isSug=true')
      .subscribe(res => {
        this.common.loading--;
        console.log('getRoutesWrtFo:', res);
        this.routeTimes = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getrouteTimeDetails() {
    this.common.loading++;
    this.api.get('ViaRoutes/viewvia?routeId=' + this.routeId + '&routeTimeTableId=' + this.routeTime)

      .subscribe(res => {
        this.common.loading--;
        this.routesData = res['data'].map(route => {
          route.Arrival_Day = route.Arrival_Day || 1;
          route.Arrival_Time = new Date(this.common.dateFormatter(new Date(), 'YYYYMMDD', false) + ' ' + (route.Arrival_Time || '00:00:00'));
          route.Halt_Time = new Date(this.common.dateFormatter(new Date(), 'YYYYMMDD', false) + ' ' + (route.Halt_Time || '00:00:00'));

          return route;
        });
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


  handleArrivalTimeSelection(time, route, index) {
    route.Arrival_Time = time;
    this.arrivalTimeChecker();
  }
  handleHaltTimeSelection(time, route) {
    route.Halt_Time = time;
  }

  arrivalTimeChecker() {
    this.routesData.map((route, index) => {
      if (index) {
        let previousRoute = this.routesData[index - 1];
        if (previousRoute.Arrival_Day > route.Arrival_Day) {
          route.errorMsg = 'Previous arrival Arrival_Day is higher than me.';
        } else if (previousRoute.Arrival_Day == route.Arrival_Day && this.common.timeFormatter(previousRoute.Arrival_Time) >= this.common.timeFormatter(route.Arrival_Time)) {
          route.errorMsg = 'Previous arrival time is higher or equal to me.';
        } else {
          route.errorMsg = '';
        }
      }
    });
  }

  setArrivalTime() {
    let isError = false;
    this.routesData.map(route => {
      route.Arr_Time = this.common.timeFormatter(route.Arrival_Time);
      route.Hlt_Time = this.common.timeFormatter(route.Halt_Time);
      if (route.errorMsg) isError = true;
    });
    if (isError) {
      this.common.showError('Please enter valid values:)');
      return;
    }
    const params = {
      data: JSON.stringify(this.routesData),
      routeId: this.routeId,
      routeTimeTableId: this.routeTime
    }
    this.common.loading++;
    this.api.post('ViaRoutes/SaveTimeTableDetails', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("res", res);

        let id = res['data'][0].y_id;
        if (id > 0) {
          this.common.showToast(res['data'][0].y_msg);
        }
        else {
          this.common.showError(res['data'][0].y_msg);

        }



      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


}
