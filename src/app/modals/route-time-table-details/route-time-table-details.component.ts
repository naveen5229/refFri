import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    this.api.get('ViaRoutes/viewvia?routeId=' + this.routeId + '&routeTimeTableId' + this.routeTime)

      .subscribe(res => {
        this.common.loading--;
        console.log('getRoutesWrtFo:', res);
        this.routesData = res['data'];
        this.routesData.map(route => {
          route.day = route.day || 1;
          route.Arrival_Time = route.Arrival_Time || '12:00:00';
        });
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  setTime(time) {
    return new Date('2001-10-10 ' + time);
  }
  setTimeReverse(time) {
    return this.common.timeFormatter(time);
  }

  handleArrivalTimeSelection(time, route, index) {
    route.Arrival_Time = this.common.timeFormatter(time);
    this.arrivalTimeChecker();
  }

  arrivalTimeChecker() {
    this.routesData.map((route, index) => {
      if (index) {
        let previousRoute = this.routesData[index - 1];
        if (previousRoute.day > route.day) {
          route.errorMsg = 'Previous arrival day is higher than me.';
        } else if (previousRoute.day == route.day && previousRoute.Arrival_Time >= route.Arrival_Time) {
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
      if (route.errorMsg) isError = true;
    });
    if (isError) {
      this.common.showError('Please enter valid values:)');
      return;
    }

    console.log('You can hit api:)))))');
  }

}
