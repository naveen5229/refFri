import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddVehicleModalServiceComponent } from '../model/add-vehicle-modal-service/add-vehicle-modal-service.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'view-modal-service',
  templateUrl: './view-modal-service.component.html',
  styleUrls: ['./view-modal-service.component.scss']
})
export class ViewModalServiceComponent implements OnInit {

  data = [];

  brands = [];
  brandId;
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

  constructor(private datePipe: DatePipe,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    private modalService: NgbModal) {
    this.vehicleBrandTypes();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  vehicleBrandTypes() {
    this.common.loading++;
    this.api.get('Vehicles/getVehicleBrandsMaster')
      .subscribe(res => {
        this.common.loading--;
        this.brands = res['data'];
        console.log("Brand Type", this.brands);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  addModalService() {
    const activeModal = this.modalService.open(AddVehicleModalServiceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.refresh(data);
      }
    });
  }

  refresh(data) {
    this.data = [];
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
    this.valobj = {};
    this.getModelService(data.response);
  }

  deleteVehicleModel(id) {
    if (!confirm("Are You Sure you want to delete the Entry??")) {
      return;
    }
    this.common.loading++;
    this.api.post('VehicleMaintenance/deleteModelService', { id: id })
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['success']) {
          this.common.showToast("Sucessfully Deleted", 10000);
          console.log("Brand", this.brandId);
          this.refresh({ response: this.brandId });
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getModelService(brandId) {
    if (!brandId)
      return;
    this.common.loading++;
    this.api.get('VehicleMaintenance/viewModalService?brandId=' + brandId)
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
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
        this.valobj = {};
        if (!this.data || !this.data.length) {
          //document.getElementById('mdl-body').innerHTML = 'No record exists';
          return;
        }
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        let headerObj = { title: 'Action', placeholder: 'Action' };
        this.table.data.headings['action'] = headerObj;
        this.table.data.columns = this.getTableColumns();
      }, err => {

        this.common.loading--;
        console.log(err);
      });
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }
  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      this.valobj['action'] = {
        icons: [
          { class: " fa fa-trash remove", action: this.deleteVehicleModel.bind(this, doc['_id']) }]
        , action: null
      };
      columns.push(this.valobj);
    });
    return columns;
  }

}
