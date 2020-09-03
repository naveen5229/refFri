import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMaintenanceComponent } from '../model/add-maintenance/add-maintenance.component';
import { ViewMaintenanceComponent } from '../model/view-maintenance/view-maintenance.component';
import { AddVehicleModalServiceComponent } from '../model/add-vehicle-modal-service/add-vehicle-modal-service.component';
import { AddAdvancedMaintenanceComponent } from '../model/add-advanced-maintenance/add-advanced-maintenance.component';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'add-vehicle-maintenance',
  templateUrl: './add-vehicle-maintenance.component.html',
  styleUrls: ['./add-vehicle-maintenance.component.scss', '../../pages/pages.component.css']
})
export class AddVehicleMaintenanceComponent implements OnInit {
  suggestionData = [];
  selectedVehicle = null;
  vehicleRegno = null;
  startTime = new Date(new Date().setMonth(new Date().getMonth() - 1));;
  endTime = new Date();
  data = [];
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
  }

  ngOnInit() {
  }

  getvehicleData(vehicle) {
    console.log("Data::", vehicle);
    this.selectedVehicle = vehicle.id;
    this.vehicleRegno = vehicle.regno;
    console.log('Vehicle Data: ', this.selectedVehicle);
  }

  refreshAuto() {
    let sugestionValue = document.getElementsByName("suggestion")[0]['value'];
    if (sugestionValue == '' || sugestionValue == null) {
      this.vehicleRegno = null;
      this.selectedVehicle = null;
    }
  }

  vehicleMaintenanceData() {
    let params = {
      vId: this.selectedVehicle,
      fromDate: this.common.dateFormatter1(this.startTime),
      toDate: this.common.dateFormatter1(this.endTime)
    };
    this.data = [];
    this.common.loading++;
    this.api.post('VehicleMaintenance/view', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("Data :", res);
        this.data = res['data'] || [];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
       
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let action = { title: this.formatTitle('Action'), placeholder: this.formatTitle('Action') };
    this.table.data.headings['Action'] = action;
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      this.valobj['Action'] = {
        icons: [
          // { class: "fa fa-pencil-square", action: this.editMaintenance.bind(this, doc) },
          { class: "fa fa-cog mr-3", action: this.viewDetails.bind(this, doc) },
          this.user.permission.delete && { class: "fa fa-trash", action: this.deleteMaintenance.bind(this, doc) }]
        , action: null
      };
      columns.push(this.valobj);
    });
    return columns;
  }

  viewDetails(doc) {
    this.common.params = { vehicleId: doc._vid, jobId: doc._jobid };
    const activeModal = this.modalService.open(ViewMaintenanceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
      }
    });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  addMaintenance() {
    if (!this.selectedVehicle || this.selectedVehicle == -1) {
      this.common.showError("Please select Vehicle Number");
      return false;
    }
    this.common.params = { title: 'Add Maintenance', vehicleId: this.selectedVehicle, regno: this.vehicleRegno };
    const activeModal = this.modalService.open(AddMaintenanceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.vehicleMaintenanceData();
        this.getTableColumns();
      }
    });
  }

  addAdvanceMaintenance() {
    if (!this.selectedVehicle || this.selectedVehicle == -1) {
      this.common.showError("Please select Vehicle Number");
      return false;
    }
    this.common.params = { title: 'Add Maintenance', vehicleId: this.selectedVehicle, regno: this.vehicleRegno };
    const activeModal = this.modalService.open(AddAdvancedMaintenanceComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.vehicleMaintenanceData();
        this.getTableColumns();
      }
    });
  }

  editMaintenance(row) {
    if (!this.selectedVehicle) {
      this.common.showError("Please select Vehicle Number");
      return false;
    }
    this.common.params = { title: 'Edit Maintenance', vehicleId: this.selectedVehicle, regno: this.vehicleRegno, row };
    const activeModal = this.modalService.open(AddMaintenanceComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.vehicleMaintenanceData();
        this.getTableColumns();
      }
    });
  }
  resetData(event) {
    this.selectedVehicle = -1;
    console.log(event);
  }

  deleteMaintenance(maintenance) {
    if (!confirm("Are you sure you want to delete?")) {
      return;
    }
    console.log("delete Maintenance", maintenance);
    let params = {
      vehicleId: maintenance._vid,
      jobId: maintenance._jobid,
    };
    this.common.loading++;
    this.api.post('VehicleMaintenance/deleteMaintenance', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("Data :", res);
        if (res['data'][0].r_id > 0) {
          this.vehicleMaintenanceData();
          this.common.showToast("Maintenance Deleted Successfully");
        }
        else {
          this.common.showError(res['data'][0].r_msg);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
