import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';
import { RouteMapperComponent } from '../../modals/route-mapper/route-mapper.component';
import { RoutesTimetableComponent } from '../../modals/routes-timetable/routes-timetable.component';
import { AddShortTargetComponent } from '../../modals/add-short-target/add-short-target.component';
import * as _ from "lodash";
import { AdhocRouteComponent } from '../../modals/adhoc-route/adhoc-route.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";
import { RemaptripandrouteComponent } from '../../modals/remaptripandroute/remaptripandroute.component';

@AutoUnsubscribe()
@Component({
  selector: 'route-dashboard',
  templateUrl: './route-dashboard.component.html',
  styleUrls: ['./route-dashboard.component.scss']
})
export class RouteDashboardComponent implements OnInit {
  isPrimaryStatusVisi = true;
  routeData = [];
  table = {
    data: {
      headings: {},
      columns: [],
    },
    settings: {
      hideHeader: true
    },
  };
  viewName = "Route Status";
  viewIndex = 0;
  viewOtions = [
    {
      name: "Route Status",
      key: "route_status"
    },
    {
      name: "Routes",
      key: "show_name"
    },
    {
      name: "Onward Status",
      key: "onward_status"
    }

  ];
  isGraphView = false;
  viewType = 'route_status';
  routesData = [];
  routeGroups = [];
  routeGroupsKeys = null;
  keyGroups = [];
  activePrimaryStatus = "";
  primarySubStatus = [];
  gpsStatus = null;
  gpsStatusKeys = [];

  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) {
    this.getFoWiseRouteData();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.common.stopScroll();
  }

  ngOnDestroy() {
    this.common.continuoueScroll();
  }

  refresh() {
    this.getFoWiseRouteData();
  }

  allData() {
    this.selectedFilterKey = "";
    this.filterData("All");
  }

  selectSubStatus(kpis) {
    this.routeData = kpis;
    this.table = this.setTable();
  }
  getFoWiseRouteData() {
    this.common.loading++;
    this.api.get('ViaRoutes/foRouteDashboard?')
      .subscribe(res => {
        this.common.loading--;
        console.log("api data", res);
        if (!res['data']) {
          this.routeData = [];
          this.routesData = [];
          return
        };
        this.routeData = res['data'];
        this.grouping('route_status');
        this.routeData.length ? this.table = this.setTable() : this.resetTable();
        this.getGpsStatus();
        this.routesData = res['data'];
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
      invoice_time: { title: 'Invoice Time', placeholder: 'Invoice Time' },
      addtime: { title: 'Addtime', placeholder: 'Addtime' },
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
        tableHeight: "84vh",
        count: {
          icon: "fa fa-map",
          action: this.handleView.bind(this),

        }
      }
    }
  }

  handleView() {
    this.isGraphView = !this.isGraphView;
  }

  getTableColumns() {
    let columns = [];
    this.routeData.map(route => {
      let column = {
        regno: { value: route.v_regno ? route.v_regno : '-', action: this.remapTripAndRoute.bind(this, route) },
        lastSeenTime: { value: route.v_time ? this.common.changeDateformat2(route.v_time) : '-', action: this.viewlocation.bind(this, route) },
        // routeName: { value: route.name ? route.name : '-', action: this.viewlocation.bind(this, route) },
        routeName: route.name ? this.getRouteAconym(route.name, route) : '-',// { value: route.name ? this.getRouteAconym(route.name) : '-', action: this.viewlocation.bind(this, route)  },
        invoice_time: { value: this.common.changeDateformat2(route.invoice_time) },
        addtime: { value: route.addtime ? this.common.changeDateformat2(route.addtime) : '-', action: null },
        startLocation: { value: route.f_name ? route.f_name : '-', action: this.viewlocation.bind(this, route) },
        startTime: { value: route.f_end_time ? this.common.changeDateformat2(route.f_end_time) : '-', action: this.viewlocation.bind(this, route), class: route.f_delay > 0 ? 'red' : route.f_delay < 0 ? 'green' : '' },
        endLocation: { value: route.l_name ? route.l_name : '-', action: this.viewlocation.bind(this, route) },
        lastTime: { value: route.l_end_time ? this.common.changeDateformat2(route.l_end_time) : '-', action: this.viewlocation.bind(this, route) },
        currentLocation: { value: route.c_name ? route.c_name : '-', action: this.viewlocation.bind(this, route) },
        currentLocationTime: { value: route.c_start_time ? this.common.changeDateformat2(route.c_start_time) : '-' },
        nextLocation: { value: route.n_name ? route.n_name : '-', action: this.viewlocation.bind(this, route) },
        distanceRemaining: { value: route.n_dist_rem ? route.n_dist_rem : '-' },
        etoa: { value: route.etoa_next ? this.common.changeDateformat2(route.etoa_next) : '-', },
        startDelay: { value: route.start_delay ? route.start_delay : '-' },
        totalDelay: { value: route.total_delay ? route.total_delay : '-', class: route.c_delay > 0 ? 'red' : route.c_delay < 0 ? 'green' : '' },
        lastHrKms: { value: route.last_hour_kms ? route.last_hour_kms : '-' },
        action: {
          value: "",
          isHTML: false,
          action: null,
          icons: this.actionIcons(route)
        },

        // rowActions: {
        //   click: "selectRow",
        // }
      };
      columns.push(column);
    });

    return columns;
  }



  actionIcons(route) {
    let icons = [
      {
        class: " fa fa-route mr-1",
        action: this.openRouteMapper.bind(this, route),
      },
      {
        class: "fas fa-truck-moving mr-1",
        action: this.viewRouteTimeTable.bind(this, route),
      },
      {
        class: 'fa fa-pencil-square-o',
        action: this.addShortTarget.bind(this, route)
      },
      {
        class: " fa fa-plus mr-1",
        action: this.adhocRoute.bind(this, route),
      },
    ]
    return icons;
  }

  getGpsStatus() {
    this.gpsStatus = _.groupBy(this.routeData, 'x_gps_state');
    this.gpsStatusKeys = Object.keys(this.gpsStatus)
    console.log("this.gpsStatus=", this.gpsStatus);
    console.log("this.gpsStatusKeys=", this.gpsStatusKeys);
  }

  openRouteMapper(route) {
    let today, startday, fromDate, endday, toDate;
    today = new Date();
    startday = route.f_end_time ? this.common.dateFormatter(route.f_end_time) : new Date(today.setDate(today.getDate() - 2));
    endday = route.c_start_time ? this.common.dateFormatter(route.c_start_time) : new Date();

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
    console.log("route", route);

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

    console.log('route is: ', route)

    let routeTime = {
      vehicleId: route.v_id,
      routeId: route.route_id,
      routeTimeId: route.tt_id,
      v_regno: route.v_regno,
      routeFlag: true
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

  adhocRoute(target) {
    console.log("target", target);
    let vehicle = {
      id: target.v_id || target._vehicleid,
      regNo: target.vehicle || target.Vehicle || target.regno || target.v_regno
    };
    this.common.params = { vehicle: vehicle };
    console.log("params=", this.common.params);
    const activeModal = this.modalService.open(AdhocRouteComponent, {
      size: "lg",
      container: "nb-layout"
    });
  }

  getRouteAconym(route, routeData) {
    let sortend = route.substring(0, 30);
    // route = route.replace(/\s/g,'');
    route = "\'" + route + "\'";
    let acy = { value: route ? '<acronym title=' + route + '>' + sortend + '</acronym>' : '-', action: this.viewlocation.bind(this, routeData), isHTML: true };
    console.log("route=", route);

    return acy;

  }


  grouping(viewType) {
    console.log('viewType', viewType);
    this.routeGroups = _.groupBy(this.routeData, viewType);
    this.routeGroupsKeys = Object.keys(this.routeGroups);
    this.keyGroups = [];
    this.routeGroupsKeys.map(key => {
      const hue = Math.floor(Math.random() * 359 + 1);
      this.keyGroups.push({
        name: key,
        bgColor: `hsl(${hue}, 100%, 75%)`,
        textColor: `hsl(${hue}, 100%, 25%)`
      });
    });

    this.sortData(viewType);
  }


  chartData = null;
  chartDataa = null;
  chartOptions = null;
  chartColors = [];
  textColor = [];
  selectedFilterKey = "";


  sortData(viewType) {
    let data = [];
    this.chartColors = [];
    let chartLabels = [];
    let chartData = [];

    this.keyGroups.map(group => {
      console.log('group', group, 'this.routeGroups', this.routeGroups, 'group.name=', group.name, "this.routeGroups[group.name]=", this.routeGroups[group.name]);
      data.push({ group: group, length: this.routeGroups[group.name] ? this.routeGroups[group.name].length : 0 });
    });

    this.routeGroupsKeys = [];
    _.sortBy(data, ["length"]).reverse()
      .map(keyData => {
        this.routeGroupsKeys.push(keyData.group);
      });

    this.routeGroupsKeys.map(keyGroup => {
      console.log('keyGroup', keyGroup, "keyGroup.name", '"' + keyGroup.name + '"', 'this.routeGroups=', this.routeGroups, 'this.routeGroups[keyGroup.name]=', this.routeGroups[keyGroup.name]);
      this.chartColors.push(keyGroup.bgColor);
      chartLabels.push(keyGroup.name);
      chartData.push(this.routeGroups[keyGroup.name].length);
    });


    let chartInfo = this.common.pieChart(
      chartLabels,
      chartData,
      this.chartColors
    );
    this.chartData = chartInfo.chartData;
    this.chartOptions = chartInfo.chartOptions;
    this.selectedFilterKey && this.filterData(this.selectedFilterKey, viewType);
  }


  filterData(filterKey, viewType?) {
    if (filterKey == "All") {
      this.routeData = this.routesData;
    } else {
      this.selectedFilterKey = filterKey;
      this.routeData = this.routesData.filter(route => {
        if (route[this.viewType] == filterKey) return true;
        return false;
      });
    }
    this.table = this.setTable();
  }

  changeOptions(type) {
    this.selectedFilterKey = "All";
    this.filterData('All');
    if (type === "forward") {
      ++this.viewIndex;
      if (this.viewIndex > this.viewOtions.length - 1) {
        this.viewIndex = 0;
      }
    } else {
      --this.viewIndex;
      if (this.viewIndex < 0) {
        this.viewIndex = this.viewOtions.length - 1;
      }
    }
    this.viewType = this.viewOtions[this.viewIndex].key;
    this.viewName = this.viewOtions[this.viewIndex].name;
    this.grouping(this.viewType);
  }

  remapTripAndRoute(route) {
    this.common.params = { vId: route['v_id'], routeId: route['route_id'], title: 'route-dashboard' }
    console.log('route is: ', route)
    const activeModal = this.modalService.open(RemaptripandrouteComponent, { size: 'lg', container: 'nb-layout' });

  }
}
