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
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  setTime(time) {
    return new Date('1000-10-10 ' + time);
  }
  setTimeReverse(time) {
    return this.common.timeFormatter(time);
  }



}
