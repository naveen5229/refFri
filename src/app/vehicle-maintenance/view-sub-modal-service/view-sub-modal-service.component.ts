import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddVehicleSubModalServiceComponent } from '../model/add-vehicle-sub-modal-service/add-vehicle-sub-modal-service.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'view-sub-modal-service',
  templateUrl: './view-sub-modal-service.component.html',
  styleUrls: ['./view-sub-modal-service.component.scss']
})
export class ViewSubModalServiceComponent implements OnInit {

  data = [];

  modelId = null;
  models = [];
  brands = [];
  brandId;
  mapping = 0;
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
  vehicleModelTypes() {
    if (!this.brandId)
      return;
    this.common.loading++;
    this.api.get('Vehicles/getVehicleModelsMaster?brandId=' + this.brandId)
      .subscribe(res => {
        this.common.loading--;
        this.models = res['data'];
        console.log("models Type", this.models);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  addModalService() {
    if (!this.modelId) {
      this.common.showError("Select Model");
      return;
    }
    this.common.params = { modelId: this.modelId };
    const activeModal = this.modalService.open(AddVehicleSubModalServiceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.modelId = data.modelId;
        this.mapping = -1;
        this.refresh();
      }
    });
  }

  refresh() {
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
    this.getSubModelService();
  }

  deleteVehicleModel(id, modelId) {
    if (!confirm("Are You Sure you want to delete the Entry??")) {
      return;
    }
    this.common.loading++;
    this.api.post('VehicleMaintenance/deleteSubModelService', { id: id })
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['success']) {
          this.common.showToast("Sucessfully Deleted", 10000);
          console.log("Brand", this.brandId);
          this.modelId = modelId;
          this.mapping = -1;
          this.refresh();
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  resetData(event) {
    this.modelId = null;
    document.getElementsByName('suggestion')[1]['value'] = '';
  }

  getSubModelService() {
    if ((!this.brandId && !this.modelId)) {
      this.common.showError("Model/Brand not selected");
      return;
    }
    this.common.loading++;
    this.api.get('VehicleMaintenance/viewSubModalService?'
      + 'brandId=' + (this.brandId || -1)
      + '&modelId=' + (this.modelId || -1)
      + "&mapping=" + this.mapping)
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
          { value: '', class: doc['_id'] > 0 ? " fa fa-trash remove" : null, action: this.deleteVehicleModel.bind(this, doc['_id'], doc['_modelid']) }]
        , action: null
      };
      columns.push(this.valobj);
    });
    return columns;
  }

}
