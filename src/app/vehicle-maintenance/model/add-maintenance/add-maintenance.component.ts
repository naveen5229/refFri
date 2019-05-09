import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../@core/data/users.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'add-maintenance',
  templateUrl: './add-maintenance.component.html',
  styleUrls: ['./add-maintenance.component.scss', '../../../pages/pages.component.css']
})
export class AddMaintenanceComponent implements OnInit {
  title = '';
  btn1 = '';
  btn2 = '';
  isFormSubmit = false;
  vehicleId = null;
  regno = null;
  typeId = null;
  currentMtDate = null;
  maintenanceType = [];
  constructor(public api: ApiService,
    public common: CommonService,
    public date: DateService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.title = this.common.params.title || 'Add Maintenance';
    this.btn1 = this.common.params.btn1 || 'Add';
    this.btn2 = this.common.params.btn2 || 'Cancel';
    this.vehicleId = this.common.params.vehicleId;
    this.regno = this.common.params.regno;
    this.serviceMaintenanceType();
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
    let name = type.target.value;
    let id = this.maintenanceType.filter(x => x.name === name)[0];
    console.log("Type Id", this.typeId);
    this.typeId = id.id;

  }
  addMaintenance() {
    let params = {
      vId: this.vehicleId,
      mainTypeId: this.typeId,
      currDate: this.common.dateFormatter(this.currentMtDate),
    };
    this.common.loading++;
    this.api.post('VehicleMaintenance/add', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        this.common.showToast(res['data'][0].rtn_msg);
        this.closeModal(true);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

}
