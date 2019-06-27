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
  // doc = null;
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
  selectFoUser(user) {
    console.log("user", user);
    this.foData = user.id;
  }

  addViaRoutes() {
    if (!this.foData) {
      this.common.showError("Please select FoUser");
      return false;
    }
    this.common.params = { foData: this.foData };
    this.common.handleModalSize('class', 'modal-lg', '1250');

    const activeModal = this.modalService.open(AddViaRoutesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.viewTable();
      }
    });

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

  viewTable() {
    this.viaRoutes = [];
    this.api.get('ViaRoutes/view')
      .subscribe(res => {
        this.viaRoutes = res['data'];
        let first_rec = this.viaRoutes[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action'), hideHeader: true };
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
    console.log("Data=", this.viaRoutes);
    this.viaRoutes.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]], " ", this.headings[i]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        if (this.headings[i] == "via_points") {
          console.log("Data=");
          console.log("doc------------>", doc);
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: this.openViaRoutePoints.bind(this, doc) };
        }
        if (this.headings[i] == "expenses") {

          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: this.openrouteExpenses.bind(this, doc) };
        }
        this.valobj['action'] = { class: '', icons: this.actionIcons(doc) };
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(details) {
    let icons = [];


    icons.push(
      {
        class: "fa fa-window-close",
        action: this.remove.bind(this, details),
      }
    )
    return icons;
  }
  remove(row) {
    console.log("row", row);


    let params = {
      id: row._id,
      foid: row._foid,
    }
    if (row._id) {
      console.log('id', row._id);
      this.common.params = {
        title: 'Delete Route ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
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
  openViaRoutePoints(doc) {
    this.common.params = { doc: doc };
    console.log("params-->", this.common.params)
    const activeModal = this.modalService.open(ViaRoutePointsComponent, { size: 'lg', container: 'nb-layout', windowClass: "mycustomModalClass" });
    activeModal.result.then(data =>
      console.log("data", data)
      // this.reloadData()
    );
  }

  openrouteExpenses(doc) {
    this.common.params = { doc: doc };
    console.log("params-->", this.common.params);
    const activeModal = this.modalService.open(RoutesExpensesComponent, { size: 'lg', container: 'nb-layout', });
    activeModal.result.then(data => {

      console.log("data", data);
      this.viewTable();
    }
    );
  }

}
