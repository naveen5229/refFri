import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMaintenanceComponent } from '../model/add-maintenance/add-maintenance.component';
import { ViewMaintenanceComponent } from '../model/view-maintenance/view-maintenance.component';
import { AddVehicleModalServiceComponent } from '../model/add-vehicle-modal-service/add-vehicle-modal-service.component';

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

  vehicleMaintenanceData() {
    let params = {
      vId: -1,
      fromDate: this.common.dateFormatter1(this.startTime),
      toDate: this.common.dateFormatter1(this.endTime)
    };
    this.data = [];
    this.common.loading++;
    this.api.post('VehicleMaintenance/view', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("Data :", res);
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        let action = { title: this.formatTitle('action'), placeholder: this.formatTitle('action') };
        this.table.data.headings['Action'] = action;
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    this.selectedVehicle = null;
    this.vehicleRegno = null;
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
      this.valobj['Action'] = {
        icons: [
          // { class: "fa fa-pencil-square", action: this.editMaintenance.bind(this, doc) },
          { class: "fa fa-cog", action: this.viewDetails.bind(this, doc) }]
        , action: null
      };
      columns.push(this.valobj);
    });
    return columns;
  }

  viewDetails(doc) {
    // this.common.params = { title: 'Edit Maintenance', vehicleId: this.selectedVehicle, regno: this.vehicleRegno, doc };
    // const activeModal = this.modalService.open(ViewMaintenanceComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    // activeModal.result.then(data => {
    //   if (data.response) {
    //   }
    // });
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  addMaintenance() {
    if (!this.selectedVehicle) {
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
      this.selectedVehicle = null;
      this.vehicleRegno = null;
    });
  }

  editMaintenance(row) {
    if (!this.selectedVehicle) {
      this.common.showError("Please select Vehicle Number");
      return false;
    }
    this.common.params = { title: 'Edit Maintenance', vehicleId: this.selectedVehicle, regno: this.vehicleRegno, row };
    const activeModal = this.modalService.open(AddMaintenanceComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.vehicleMaintenanceData();
        this.getTableColumns();
      }
    });
  }

}
