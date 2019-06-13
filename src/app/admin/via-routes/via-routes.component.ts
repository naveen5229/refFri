import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddViaRoutesComponent } from '../../modals/add-via-routes/add-via-routes.component';
import { bind } from '@angular/core/src/render3';

@Component({
  selector: 'via-routes',
  templateUrl: './via-routes.component.html',
  styleUrls: ['./via-routes.component.scss', '../../pages/pages.component.css']
})
export class ViaRoutesComponent implements OnInit {
  foData = null;

  gpsTrail = [];
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
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.gpsTrail);
    this.gpsTrail.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        this.valobj['action'] = { value: null, isHTML: false, action: null, class: '', icons: this.actionIcons(doc) }

      }
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(details) {
    let icons = [];


    icons.push({
      class: "fa fa-check-circle",
      action: this.edit.bind(this, details),
    },

      {
        class: "fa fa-window-close",
        action: this.remove.bind(this, details),
      }
    )
    return icons;



  }

  edit(data) {

  }
  remove(row) {
    console.log("row", row);

    let params = {
      id: row._id,
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


}
