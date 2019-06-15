import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddViaRoutesComponent } from '../../modals/add-via-routes/add-via-routes.component';
import { bind } from '@angular/core/src/render3';
import { ViaRoutePointsComponent } from '../../modals/via-route-points/via-route-points.component';

@Component({
  selector: 'via-routes',
  templateUrl: './via-routes.component.html',
  styleUrls: ['./via-routes.component.scss', '../../pages/pages.component.css']
})
export class ViaRoutesComponent implements OnInit {
  foData = null;
  routeId= null;
  doc;
  gpsTrail = [];
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
    this.foData = user;
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
      // if (data.response) {
      // }
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

    this.api.get('ViaRoutes/view')
      .subscribe(res => {
        this.gpsTrail = res['data'];
        let first_rec = this.gpsTrail[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action') };
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
    console.log("Data=", this.gpsTrail);
    this.gpsTrail.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]," ",this.headings[i]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        if (this.headings[i] == "via_points") {
          console.log("Data=");
          console.log("doc------------>", doc);
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'blue', action: this.openViaRoutePoints.bind(this, doc) };
        }else
        this.valobj['action'] = { value: doc[this.headings[i]]};
       
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
      foid: this.foData.id
    }
    this.api.post('ViaRoutes/delete', params)
      .subscribe(res => {
        console.log('Res: ', res['data']);
        this.viewTable();
      }, err => {
        console.error(err);
        this.common.showError();
      });
  }
  openViaRoutePoints(doc) {
    this.common.params = { doc : doc };
    console.log("params-->",this.common.params)
    const activeModal = this.modalService.open(ViaRoutePointsComponent, { size: 'lg', container: 'nb-layout', windowClass: "mycustomModalClass" });
    activeModal.result.then(data =>
      console.log("data", data)
      // this.reloadData()
    );
  }

}
