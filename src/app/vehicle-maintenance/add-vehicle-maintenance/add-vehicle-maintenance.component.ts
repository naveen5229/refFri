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
  }


  getSuggestionData(value) {
    console.log("value:", value);
    // this.common.loading++;
    // this.api.get('VehicleMaintenance/getHeadMaster')
    //   .subscribe(res => {
    //     this.common.loading--;
    //     this.suggestionData = res['data'];
    //   }, err => {
    //     this.common.loading--;
    //     console.log(err);
    //   });
  }
  addMaintenance() {
    if (!this.selectedVehicle) {
      this.common.showError("Please select Vehicle Number");
      return false;
    }
    this.common.params = { title: 'Add Maintenance', vehicleId: this.selectedVehicle, regno: this.vehicleRegno };
    const activeModal = this.modalService.open(AddMaintenanceComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      // if (data.response) {
      //   this.documentUpdate();
      // }
    });
  }

}
