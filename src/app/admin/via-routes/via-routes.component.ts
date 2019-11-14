import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddViaRoutesComponent } from '../../modals/add-via-routes/add-via-routes.component';
import { bind } from '@angular/core/src/render3';
import { ViaRoutePointsComponent } from '../../modals/via-route-points/via-route-points.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { RoutesExpensesComponent } from '../../modals/routes-expenses/routes-expenses.component';
import { RoutesAdvancesComponent } from '../../modals/routes-advances/routes-advances.component';
import { RoutesTrafficKpisComponent } from '../../modals/routes-traffic-kpis/routes-traffic-kpis.component';
import { StrictMappingComponent } from '../../modals/strict-mapping/strict-mapping.component';
import { VehiclePriSecRoutemappingComponent } from '../../modals/vehicle-pri-sec-routemapping/vehicle-pri-sec-routemapping.component';
import { RouteTimeTableComponent } from '../../modals/route-time-table/route-time-table.component';
import { Route } from '@angular/router';
@Component({
  selector: 'via-routes',
  templateUrl: './via-routes.component.html',
  styleUrls: ['./via-routes.component.scss', '../../pages/pages.component.css']
})
export class ViaRoutesComponent implements OnInit {
  foData = null;
  routeId = null;
  doc;
  viaRoutes = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  headings = [];
  valobj = {};

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.viewTable();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.headings = [];
    this.viewTable();
  }

  selectFoUser(user) {
    this.foData = user.id;
  }
  strictRoutes() {
    this.modalService.open(StrictMappingComponent, { size: 'lg', container: 'nb-layout', });
  }

  addViaRoutes() {
    const activeModal = this.modalService.open(AddViaRoutesComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.viewTable();
      }
    });
  }

  addPriSecRoute() {
    const activeModal = this.modalService.open(VehiclePriSecRoutemappingComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  viewTable() {
    this.viaRoutes = [];
    this.common.loading++;
    this.api.get('ViaRoutes/view')
      .subscribe(res => {
        this.common.loading--;
        this.viaRoutes = res['data'] || [];
        if (!this.viaRoutes.length) return;
        let first_rec = this.viaRoutes[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }

        let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action'), hideSearch: true };
        this.table.data.headings['action'] = action;
        this.table.data.columns = this.getTableColumns();
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }

  formatTitle(title) {
    let pos = title.indexOf('_');
    if (pos > 0) {
      return title.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return title.charAt(0).toUpperCase() + title.substr(1);
    }
  }

  getTableColumns() {
    let columns = [];
    this.viaRoutes.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        if (this.headings[i] == "via_points") {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: this.openViaRoutePoints.bind(this, doc) };
        }
        if (this.headings[i] == "expenses") {

          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: this.openrouteExpenses.bind(this, doc) };
        }
        if (this.headings[i] == "traffic_kpis") {

          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: this.openrouteKpi.bind(this, doc) };
        }
        if (this.headings[i] == "advances") {

          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: this.openrouteAdvance.bind(this, doc) };
        }
        if (this.headings[i] == "time_table") {

          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: this.addRouteTimeTable.bind(this, doc) };
        }
        this.valobj['action'] = { class: '', icons: this.actionIcons(doc) };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(route) {
    let icons = [];
    icons.push(
      {
        class: "fas fa-edit mr-3",
        action: this.editRoute.bind(this, route),
      },
      {
        class: "fa fa-window-close",
        action: this.remove.bind(this, route),
      },

    )
    return icons;
  }

  remove(row) {
    let params = {
      id: row._id,
      foid: row._foid,
    }
    if (row._id) {
      this.common.params = {
        title: 'Delete Route ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }

      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('ViaRoutes/delete', params)
            .subscribe(res => {
              this.common.loading--;
              this.common.showToast(res['msg']);
              this.viewTable();
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

  openViaRoutePoints(route) {
    this.common.params = { route: route };
    const activeModal = this.modalService.open(ViaRoutePointsComponent, { size: 'lg', container: 'nb-layout', windowClass: "mycustomModalClass" });
    activeModal.result.then(data => {
      console.log("data", data);
      this.viewTable();
    });
  }

  openrouteExpenses(route) {
    this.common.params = { doc: route };
    const activeModal = this.modalService.open(RoutesExpensesComponent, { size: 'lg', container: 'nb-layout', });
    activeModal.result.then(data => {
      this.viewTable();
    });
  }

  openrouteAdvance(route) {
    this.common.params = { doc: route };
    const activeModal = this.modalService.open(RoutesAdvancesComponent, { size: 'lg', container: 'nb-layout', });
    activeModal.result.then(data => {
      this.viewTable();
    });
  }

  openrouteKpi(route) {
    this.common.params = { doc: route };
    const activeModal = this.modalService.open(RoutesTrafficKpisComponent, { size: 'lg', container: 'nb-layout', });
    activeModal.result.then(data => {
      this.viewTable();
    });
  }

  addRouteTimeTable(route) {
    let routeData = {
      routeId: route._id,
      routeName: route.name,
    }
    this.common.params = { routeData };
    const activeModal = this.modalService.open(RouteTimeTableComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }
  editRoute(route) {
    let editRoute = {
      id: route._id,
      routeName: route.name,
      routeType: route._route_type,
      kms: route.kms
    }
    console.log(".....", route);

    this.common.params = { editRoute };
    const activeModal = this.modalService.open(AddViaRoutesComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.viewTable();
      }
    });

  }



}
