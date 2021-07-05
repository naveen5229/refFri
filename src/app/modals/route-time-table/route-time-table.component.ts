import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { RouteTimeTableDetailsComponent } from '../route-time-table-details/route-time-table-details.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { VehicleTimeTableAssociationComponent } from '../vehicle-time-table-association/vehicle-time-table-association.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'route-time-table',
  templateUrl: './route-time-table.component.html',
  styleUrls: ['./route-time-table.component.scss']
})
export class RouteTimeTableComponent implements OnInit {
  routesDetails = [];
  routeId = null;
  routeName = null;
  startTime = new Date();
  assocType = null;
  edit = 0;
  rowId = null;
  isNull: boolean = true;
  startType = 0;

  routeTimeTable = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  constructor(public api: ApiService,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public modalService: NgbModal) {
    if (this.common.params && this.common.params.routeData) {
      this.routeId = this.common.params.routeData.routeId;
      this.routeName = this.common.params.routeData.routeName;
    }
    if (this.routeId) {
      this.getRouteTimeTableViews();
    }
    this.getRoutes();
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    this.common.params = null;
    console.log("destroy");

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
    this.routeId = type.id
    if (this.routeId) {
      this.getRouteTimeTableViews();
    }
  }
  reset() {
    this.rowId = null;
    this.startTime = null;
    this.assocType = null;
  }

  addrouteTime() {
    let startTime = this.startTime && this.isNull ? this.common.timeFormatter(this.startTime) : null;
    let params = {
      rowId: this.rowId ? this.rowId : null,
      routeId: this.routeId,
      startTime,
      assType: this.assocType,
      startType: this.startType
    }
    console.log("Params:", params);
    this.common.loading++;
    this.api.post('ViaRoutes/saveTimeTable', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res:', res);
        if (res['data'][0].y_id <= 0) {
          this.common.showError(res['data'][0].y_msg);
        }
        else {
          this.common.showToast(res['data'][0].y_msg);
          this.getRouteTimeTableViews();
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getRouteTimeTableViews() {
    this.common.loading++;
    this.api.get('ViaRoutes/getTimeTable?routeId=' + this.routeId)
      .subscribe(res => {
        this.common.loading--;
        this.routeTimeTable = res['data'];
        this.routeTimeTable.length ? this.setTable() : this.resetTable();

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
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns()
    };
    return true;
  }

  generateHeadings() {
    let headings = {};
    for (var key in this.routeTimeTable[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: key, placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  getTableColumns() {
    let columns = [];
    this.routeTimeTable.map(route => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column[key] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(route)
          };
        } else {
          column[key] = { value: route[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    })

    return columns;
  }

  actionIcons(route) {
    let icons = [
      {
        class: "fas fa-pencil-alt",
        action: this.editTimeTable.bind(this, route)
      },
      {
        class: "fas fa-list-alt ml-3",
        action: this.editRoutes.bind(this, route)
      },
      {
        class: "fas fa-truck-moving ml-3",
        action: this.addvehicleAssociation.bind(this, route)
      },
      {
        class: "fas fa-trash-alt ml-3",
        action: this.deleteRouteTime.bind(this, route)
      },

    ];
    return icons;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }
  editTimeTable(route) {
    this.edit = 1;
    this.routeId = route._route_id;
    this.routeName = route._route_name;
    this.startTime = route._start_time ? new Date(route._start_time) : null;
    if(this.startTime){
      this.isNull = true;
    }else{
      this.isNull = false;
    }
    console.log("start Time", this.startTime);
    this.assocType = route._ass_type;
    this.rowId = route._rtt_id;
    this.startType = route['_start_type']
  }

  editRoutes(route) {
    console.log("route:", route);
    this.common.params = { route: route };
    const activeModal = this.modalService.open(RouteTimeTableDetailsComponent, { size: 'lg', container: 'nb-layout', });
  }

  addvehicleAssociation(route) {
    let vehicleRouteData = {
      routeId: route._route_id,
      routeName: route._route_name,
      routeTimeName: route._rtt_name,
      routeTime: route._rtt_id,
      assType: route._ass_type,
    }
    console.log("vehicleRouteData:", vehicleRouteData);
    this.common.params = { vehicleRouteData };
    const activeModal = this.modalService.open(VehicleTimeTableAssociationComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  deleteRouteTime(route) {
    let params = {
      routeId: route._route_id,
      timeTableId: route._rtt_id,

    }
    if (route._route_id) {
      this.common.params = {
        title: 'Delete Route Time',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('ViaRoutes/deleteTimeTable', params)
            .subscribe(res => {
              this.common.loading--;
              if (res['data'][0].y_id > 0) {
                this.common.showToast('Success');
                this.getRouteTimeTableViews();
              }
              else {
                this.common.showToast(res['data'][0].y_msg);
              }

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

  handleTime() {
    console.log('event', this.isNull);
    if (!this.isNull) {
      this.startTime = null;
    } else {
      this.startTime = new Date();
    }
  }


}
