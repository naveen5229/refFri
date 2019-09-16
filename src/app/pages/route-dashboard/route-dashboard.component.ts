import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { RouteMapperComponent } from '../../modals/route-mapper/route-mapper.component';
import { RoutesTimetableComponent } from '../../modals/routes-timetable/routes-timetable.component';
import { AddShortTargetComponent } from '../../modals/add-short-target/add-short-target.component';

@Component({
  selector: 'route-dashboard',
  templateUrl: './route-dashboard.component.html',
  styleUrls: ['./route-dashboard.component.scss']
})
export class RouteDashboardComponent implements OnInit {
  routeData = [];
  table = {
    data: {
      headings: {},
      columns: [],
    },
    settings: {
      hideHeader: true
    }
  };
  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) {
    this.getFoWiseRouteData();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh() {
    this.getFoWiseRouteData();
  }
  getFoWiseRouteData() {
    this.common.loading++;
    this.api.get('ViaRoutes/foRouteDashboard?')
      .subscribe(res => {
        this.common.loading--;
        console.log("api data", res);
        if (!res['data']) return;
        this.routeData = res['data'];
        this.routeData.length ? this.table = this.setTable() : this.resetTable();

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  resetTable() {
    this.table.data = {
      headings: {},
      columns: []
    };
  }

  setTable() {
    let headings = {
      regno: { title: 'Regno', placeholder: 'Regno' },
      lastSeenTime: { title: 'Last Seen Time', placeholder: 'Last Seen Time' },
      routeName: { title: 'Route Name', placeholder: 'Route Name' },
      startLocation: { title: 'Start Location', placeholder: 'Start Location' },
      startTime: { title: 'Start Time', placeholder: 'Start time' },
      endLocation: { title: 'Last Location', placeholder: 'Last Location' },
      lastTime: { title: 'Last Exit Time', placeholder: 'Last Exit Time' },
      currentLocation: { title: 'Current Location', placeholder: 'Current Location' },
      currentLocationTime: { title: 'CL Time', placeholder: 'CL Time' },
      nextLocation: { title: 'Next Location', placeholder: 'Next Location' },
      distanceRemaining: { title: 'Distance Remaining ', placeholder: 'Distance Remaining' },
      etoa: { title: 'ETOA ', placeholder: 'ETOA' },
      startDelay: { title: 'Start  delay ', placeholder: 'Start  delay' },
      totalDelay: { title: 'Total  delay ', placeholder: 'Total  delay' },
      lastHrKms: { title: 'Last Hr KMS', placeholder: 'Last Hr KMS' },
      action: { title: 'Action', placeholder: 'Action', hideSearch: true, class: 'del' },

    };

    return {
      data: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true,
        tableHeight: "72vh"
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.routeData.map(route => {
      let column = {
        regno: { value: route.v_regno ? route.v_regno : '-', },
        lastSeenTime: { value: route.v_time ? this.common.changeDateformat(route.v_time) : '-', action: this.viewlocation.bind(this, route) },
        routeName: { value: route.name ? route.name : '-', action: this.viewlocation.bind(this, route) },
        startLocation: { value: route.f_name ? route.f_name : '-', action: this.viewlocation.bind(this, route) },
        startTime: { value: route.f_end_time ? this.common.changeDateformat2(route.f_end_time) : '-', action: this.viewlocation.bind(this, route) },
        endLocation: { value: route.l_name ? route.l_name : '-', action: this.viewlocation.bind(this, route) },
        lastTime: { value: route.l_end_time ? this.common.changeDateformat2(route.l_end_time) : '-', action: this.viewlocation.bind(this, route) },
        currentLocation: { value: route.c_name ? route.c_name : '-', action: this.viewlocation.bind(this, route) },
        currentLocationTime: { value: route.c_start_time ? this.common.changeDateformat2(route.c_start_time) : '-' },
        nextLocation: { value: route.n_name ? route.n_name : '-', action: this.viewlocation.bind(this, route) },
        distanceRemaining: { value: route.n_dist_rem ? route.n_dist_rem : '-' },
        etoa: { value: route.etoa_next ? this.common.changeDateformat2(route.etoa_next) : '-', },
        startDelay: { value: route.start_delay ? route.start_delay : '-' },
        totalDelay: { value: route.total_delay ? route.total_delay : '-' },
        lastHrKms: { value: route.last_hour_kms ? route.last_hour_kms : '-' },
        action: {
          value: "",
          isHTML: false,
          action: null,
          icons: this.actionIcons(route)
        },

        rowActions: {
          click: "selectRow",
        }
      };
      columns.push(column);
    });

    return columns;
  }



  actionIcons(route) {
    let icons = [
      {
        class: " fa fa-route mr-2",
        action: this.openRouteMapper.bind(this, route),
      },
      {
        class: "fas fa-truck-moving",
        action: this.viewRouteTimeTable.bind(this, route),
      },
      {
        class: 'fa fa-pencil-square-o',
        action: this.addShortTarget.bind(this, route)
      },

    ]
    return icons;
  }

  openRouteMapper(route) {
    let today, startday, fromDate, endday, toDate;
    today = new Date();
    startday = route.f_end_time ? this.common.dateFormatter(route.f_end_time) : new Date(today.setDate(today.getDate() - 2));
    endday = route.l_end_time ? this.common.dateFormatter(route.l_end_time) : new Date();

    fromDate = this.common.dateFormatter(startday);
    toDate = this.common.dateFormatter(endday);
    let fromTime = this.common.dateFormatter(fromDate);
    let toTime = this.common.dateFormatter(toDate);
    this.common.handleModalHeightWidth("class", "modal-lg", "200", "1500");
    this.common.params = {
      vehicleId: route.v_id,
      vehicleRegNo: route.v_regno,
      fromTime: fromTime,
      toTime: toTime
    };
    const activeModal = this.modalService.open(RouteMapperComponent, {
      size: "lg",
      container: "nb-layout",
      windowClass: "myCustomModalClass"
    });

  }

  viewlocation(route) {
    const location = {
      lat: route.v_lat ? route.v_lat : 0,
      lng: route.v_long ? route.v_long : 0,
      name: "",
      time: ""
    };
    this.common.params = { location, title: "Vehicle Location" };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: "lg", container: "nb-layout", backdrop: 'static' });
  }

  viewRouteTimeTable(route) {

    let routeTime = {
      vehicleId: route.v_id,
      routeId: route.route_id,
      routeTimeId: route.tt_id
    };
    this.common.params = { routeTime };
    const activeModal = this.modalService.open(RoutesTimetableComponent, { size: "lg", container: "nb-layout", backdrop: 'static' });
  }
  addShortTarget(target) {
    console.log("target", target);
    this.common.params = {
      vehicleId: target.v_id || target._vehicleid,
      vehicleRegNo: target.vehicle || target.Vehicle || target.regno || target.v_regno

    };
    console.log("params=", this.common.params);
    const activeModal = this.modalService.open(AddShortTargetComponent, {
      size: "sm",
      container: "nb-layout"
    });
  }
}
