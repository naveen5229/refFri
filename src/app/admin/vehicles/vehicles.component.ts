import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VehicleNextServiceDetailComponent } from '../../modals/vehicle-next-service-detail/vehicle-next-service-detail.component';
import { BulkVehicleNextServiceDetailComponent } from '../../modals/bulk-vehicle-next-service-detail/bulk-vehicle-next-service-detail.component';
import { OdoMeterComponent } from '../../modals/odo-meter/odo-meter.component';
import { VehicleDetailsUpdateComponent } from '../../modals/vehicle-details-update/vehicle-details-update.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'vehicles',
  templateUrl: './vehicles.component.html',
  styleUrls: ['./vehicles.component.scss']
})
export class VehiclesComponent implements OnInit {

  title = '';
  showTable = false;
  data = [];
  headings = [];
  valobj = {};
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
    public user: UserService,
    private modalService: NgbModal) {
      this.common.refresh = this.refresh.bind(this);

    this.getVehiclesDetail();
  }


  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    console.log('Refresh');
    this.getVehiclesDetail();
  }
  getVehiclesDetail() {
    this.common.loading++;
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
    this.api.get('Vehicles/vehiclesDetailView')
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        console.log("data:");
        console.log(this.data);
        if (this.data == null) {
          this.data = [];
          return;
        }
        let first_rec = this.data[0];
        console.log("first_Rec", first_rec);

        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: key, placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
        console.log("table:");
        console.log(this.table);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let columns = [];
    for (var i = 0; i < this.data.length; i++) {
      this.valobj = {};
      for (let j = 0; j < this.headings.length; j++) {
        j
        if (this.headings[j] == 'Action') {
          this.valobj[this.headings[j]] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(this.data[i])
          };
        } else {
          this.valobj[this.headings[j]] = { value: this.data[i][this.headings[j]], class: 'black', action: '' };

        }
      }

      columns.push(this.valobj);
    }
    return columns;
  }
  actionIcons(data) {
    let icons = [
      {
        class: 'fas fa-edit  edit-btn',
        action: this.OpenVehicleNextServiceModal.bind(this, data)
      },
      {
        class: "icon fas fa-tachometer-alt",
        action: this.openOdoMeter.bind(this, data)
      },
      {
        class: "icon fa fa-edit",
        action: this.OpenVehicleupdateModal.bind(this, data)
      },
    ];
    return icons;
  }

  openOdoMeter(data) {
    console.log("data", data);
    let vehicleId = data._vid;
    let regno = data.Vehicle;
    this.common.params = { vehicleId, regno };
    console.log('Param', this.common.params);
    const activeModal = this.modalService.open(OdoMeterComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  OpenVehicleNextServiceModal(vehicle) {
    this.common.params = { vehicleId: vehicle._vid, vehicleNo: vehicle.Vehicle };
    console.log("vehicle", vehicle);
    let activeModal = this.modalService.open(VehicleNextServiceDetailComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(res => {
      if (res.data > 0) {
        this.getVehiclesDetail();
      }
      console.log('response----', res.data);
    });
  }

  openNextBulkUpdateModal() {
    const activeModal = this.modalService.open(BulkVehicleNextServiceDetailComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.result.then(data => {
    });
  }

  OpenVehicleupdateModal(vehicle) {
    let params = {
      id:vehicle._vid
    }
    this.common.params = {vehicle: params};
    console.log("vehicle", vehicle);
    let activeModal = this.modalService.open(VehicleDetailsUpdateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(res => {
      if (res.data) {
        this.getVehiclesDetail();
      }
      console.log('response----', res.data);
    });
  }

}
