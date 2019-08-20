import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocationMarkerComponent } from '../../modals/location-marker/location-marker.component';

@Component({
  selector: 'route-dashboard',
  templateUrl: './route-dashboard.component.html',
  styleUrls: ['./route-dashboard.component.scss']
})
export class RouteDashboardComponent implements OnInit {
  routeData = [];
  table = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public modalService: NgbModal) {
    this.getFoWiseRouteData();
  }

  ngOnInit() {
  }
  getFoWiseRouteData() {
    this.common.loading++;
    this.api.get('ViaRoutes/foRouteDashboard?')
      .subscribe(res => {
        this.common.loading--;
        console.log("api data", res);
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
      nextLocation: { title: 'Next Location', placeholder: 'Next Location' },
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
        lastSeenTime: { value: route.v_latch_time ? this.common.dateFormatter(route.v_latch_time) : '-', action: this.viewlocation.bind(this, route) },
        routeName: { value: route.name ? route.name : '-', action: this.viewlocation.bind(this, route) },
        startLocation: { value: route.f_name ? route.f_name : '-', action: this.viewlocation.bind(this, route) },
        startTime: { value: route.f_end_time ? this.common.dateFormatter(route.f_end_time) : '-', action: this.viewlocation.bind(this, route) },
        endLocation: { value: route.l_name ? route.l_name : '-', action: this.viewlocation.bind(this, route) },
        lastTime: { value: route.l_end_time ? this.common.dateFormatter(route.l_end_time) : '-', action: this.viewlocation.bind(this, route) },
        currentLocation: { value: route.c_name ? route.c_name : '-', action: this.viewlocation.bind(this, route) },
        nextLocation: { value: route.n_name ? route.n_name : '-', action: this.viewlocation.bind(this, route) },
        // rowActions: { class: 'del', activeModal: this.viewlocation.bind(this, route), action: this.viewlocation.bind(this, route) }

        rowActions: {
          click: "selectRow",
        }
      };
      columns.push(column);
    });

    return columns;
  }

  viewlocation(route) {
    const location = {
      lat: route.v_latch_lat,
      lng: route.v_latch_long,
      name: "",
      time: ""
    };
    this.common.params = { location, title: "Vehicle Location" };
    const activeModal = this.modalService.open(LocationMarkerComponent, { size: "lg", container: "nb-layout", backdrop: 'static' });
  }
}
