import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Timestamp } from 'rxjs/internal/operators/timestamp';
import { RouteTimeTableDetailsComponent } from '../route-time-table-details/route-time-table-details.component';

@Component({
  selector: 'route-time-table',
  templateUrl: './route-time-table.component.html',
  styleUrls: ['./route-time-table.component.scss']
})
export class RouteTimeTableComponent implements OnInit {
  routesDetails = [];
  routeId = null;
  startTime = new Date();
  assocType = null;

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
    this.routeId = type.id
    if (this.routeId) {
      this.getRouteTimeTableViews();
    }
  }


  addrouteTime() {
    let params = {
      routeId: this.routeId,
      startTime: this.common.timeFormatter(this.startTime),
      assType: this.assocType,

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
        console.log('res:', res);

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
        class: "icon fas fa-edit",
        action: this.editRoutes.bind(this, route)
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

  editRoutes(route) {

    console.log("route:", route);
    this.common.params = { route: route };
    const activeModal = this.modalService.open(RouteTimeTableDetailsComponent, { size: 'lg', container: 'nb-layout', });

  }


}
