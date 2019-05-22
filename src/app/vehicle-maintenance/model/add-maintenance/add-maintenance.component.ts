import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../@core/data/users.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { element } from '@angular/core/src/render3';

@Component({
  selector: 'add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss', '../../../pages/pages.component.css']
})
export class AddMaintenanceComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  btn3 = 'Submit'
  isFormSubmit = false;
  vehicleId = null;
  regno = null;
  typeId = null;
  maintenanceType = [];
  nextMaintDate: any;
  currentMaintDate: any;
  nextVehicleKm = null;
  remark: any;
  currentVehicleKm = null;
  maintLocation: any;
  amount = null;
  selectedMT: string = '';
  edit = 0;
  MaintenanceId = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public date: DateService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title || 'Add Maintenance';
    this.btn1 = this.common.params.btn1 || 'Cancel';
    this.btn2 = this.common.params.btn2 || 'Add';
    this.vehicleId = this.common.params.vehicleId;
    this.regno = this.common.params.regno;
    this.serviceMaintenanceType();
    if (this.common.params.row) {
      this.edit = 1;
      this.MaintenanceId = this.common.params.row._id;
      this.typeId = this.common.params.row._type_id;
      this.selectedMT = this.common.params.row.type_name;
      this.currentMaintDate = new Date(this.common.params.row.cur_date);
      this.nextMaintDate = new Date(this.common.params.row.target_date);
      this.currentVehicleKm = this.common.params.row.cur_km,
        this.nextVehicleKm = this.common.params.row.target_km,
        this.amount = this.common.params.row.amount,
        this.maintLocation = this.common.params.row.maint_location,
        this.remark = this.common.params.row.remarks
    }
  }

  ngOnInit() {
  }


  closeModal(response) {
    this.activeModal.close({ response: response });
  }

  serviceMaintenanceType() {
    this.common.loading++;
    this.api.get('VehicleMaintenance/getHeadMaster')
      .subscribe(res => {
        this.common.loading--;
        this.maintenanceType = res['data'];
        console.log("Maintenance Type", this.maintenanceType);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  changeMaitenanceType(type) {
    this.typeId = this.maintenanceType.find((element) => {
      return element.name == type;
    }).id;
    console.log("Type Id", this.typeId);
  }

  addMaintenance() {
    let params = {
      id: this.MaintenanceId ? this.MaintenanceId : null,
      vId: this.vehicleId,
      mainTypeId: this.typeId,
      currDate: this.common.dateFormatter(this.currentMaintDate),
      targetDate: this.common.dateFormatter(this.nextMaintDate),
      currKm: this.currentVehicleKm,
      targetKm: this.nextVehicleKm,
      amt: this.amount,
      locName: this.maintLocation,
      remark: this.remark
    };
    console.log("Params:", params);
    this.common.loading++;
    this.api.post('VehicleMaintenance/add', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['data'][0].rtn_msg == 'Success') {
          this.closeModal(true);
          this.common.showToast(res['data'][0].rtn_msg);
        }
        else {
          this.common.showError(res['data'][0].rtn_msg);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
