import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddMaintenanceComponent } from '../model/add-maintenance/add-maintenance.component';

@Component({
  selector: 'add-vehicle-maintenance',
  templateUrl: './add-vehicle-maintenance.component.html',
  styleUrls: ['./add-vehicle-maintenance.component.scss', '../../pages/pages.component.css']
})
export class AddVehicleMaintenanceComponent implements OnInit {
  suggestionData = [];
  selectedVehicle = null;
  vehicleRegno = null;

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
    // this.getSuggestionData();
  }

  ngOnInit() {
  }

  getvehicleData(vehicle) {
    console.log("Data::", vehicle);
    this.selectedVehicle = vehicle.id;
    this.vehicleRegno = vehicle.regno;
    console.log('Vehicle Data: ', this.selectedVehicle);
    this.vehicleMaintenanceData();
  }

  vehicleMaintenanceData() {
    this.data = [];
    this.common.loading++;
    this.api.post('VehicleMaintenance/view', { vId: this.selectedVehicle })
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
      this.valobj['Action'] = { value: `<i class="fa fa-pencil-square"></i>`, isHTML: true, action: this.editMaintenance.bind(this, doc), class: 'image text-center del' }
      columns.push(this.valobj);
    });
    return columns;
  }


  getSuggestionData(value) {
    console.log("value:", value);

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
    const activeModal = this.modalService.open(AddMaintenanceComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
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
    const activeModal = this.modalService.open(AddMaintenanceComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("before:");

      if (data.response) {
        console.log("After:");
        this.vehicleMaintenanceData();
        this.getTableColumns();
      }
    });
  }

}
