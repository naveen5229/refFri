import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateTicketPropertiesComponent } from '../../modals/update-ticket-properties/update-ticket-properties.component'
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'ticket-properties',
  templateUrl: './ticket-properties.component.html',
  styleUrls: ['./ticket-properties.component.scss', '../../pages/pages.component.css']
})
export class TicketPropertiesComponent implements OnInit {

  ticketProperties = [];
  checkFlag = false;
  // foid = '';

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


  constructor(public api: ApiService, public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);
    this.refresh();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    this.getFoProperties();
  }
  // getSuggestions(suggestionList) {
  //   this.getFoProperties();
  // }

  getFoProperties() {
    let params = {
    };
    this.common.loading++;
    this.api.post('FoTicketProperties/getFoProperties',params)
      .subscribe(res => {
        this.common.loading--;
        this.ticketProperties = [];
        this.ticketProperties = res['data'];
        if (this.ticketProperties == null) {
          return this.ticketProperties = [];
        }

        let first_rec = this.ticketProperties[0];
        let headings = {};
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            headings[key] = headerObj;
          }
        }
        this.table.data = {
          headings: headings,
          columns: this.getTableColumns()
        };
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }


  getTableColumns() {
    let columns = [];
    this.ticketProperties.map(matrix => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: matrix[this.headings[i]], class: 'black', action: '' };
      }
      this.valobj['Action'] = { class: '', icons: this.actionIcons(matrix) };
      columns.push(this.valobj);
    });
    return columns;
  }

  actionIcons(details) {
    let icons = [];
    icons.push(
      {
        class: "fas fa-pencil-alt",
        action: this.addNewProperties.bind(this, details)

      },
      {
        class: 'fa fa-trash ml-2',
        action: this.deleteProperties.bind(this, details)
      }
    );
    if (details._row_id) {
      icons.push({
        class: "fa fa-edit ml-2",
        action: this.openUpdatePropertiesModel.bind(this, details)

      })

    }
    return icons;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  openUpdatePropertiesModel(values) {
    let flag = 'Edit';
    // let foid = this.foid;
    this.common.params = { values, flag };
    const activeModel = this.modalService.open(UpdateTicketPropertiesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModel.result.then(data => {
      this.getFoProperties();
    });
  }
  addNewProperties(values) {
    let flag = 'Add';
    // let foid = this.foid;
    this.common.params = { values, flag};
    const activeModel = this.modalService.open(UpdateTicketPropertiesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModel.result.then(data => {
      this.getFoProperties();
    });
  }

  deleteProperties(properties) {
    let params = {
      id: properties._row_id
    };
    if (properties._row_id) {
      this.common.params = {
        title: 'Delete Property ',
        description: `<b>&nbsp;` + 'Are You Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('FoTicketProperties/deleteFoProperties ', params)
            .subscribe(res => {
              this.common.loading--
              if (res['code'] == "1") {
                this.common.showToast([res][0]['msg']);
              }
              this.getFoProperties();

            }, err => {
              this.common.loading--;
              this.common.showError();
            })
        }
      });
    }
  }

}
