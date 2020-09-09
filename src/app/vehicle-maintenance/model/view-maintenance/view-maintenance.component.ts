import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { DateService } from '../../../services/date.service';
import { UserService } from '../../../@core/data/users.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'view-maintenance',
  templateUrl: './view-maintenance.component.html',
  styleUrls: ['./view-maintenance.component.scss', '../../../pages/pages.component.css']
})
export class ViewMaintenanceComponent implements OnInit {

  jobId = null;
  vehicleId = null;
  numbers = [];
  data = [];
  items = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public date: DateService,
    public user: UserService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal) {
    this.jobId = this.common.params.jobId;
    this.vehicleId = this.common.params.vehicleId;
    this.serviceMaintenanceType();
  }
  ngOnInit() {

  }
  serviceMaintenanceType() {
    this.common.loading++;
    this.api.get('VehicleMaintenance/viewDetailed?jobId=' + this.jobId + "&vehicleId=" + this.vehicleId)
      .subscribe(res => {
        this.common.loading--;
        console.log("res['data'][0]",res['data'][0]);
        let headings = Object.keys(res['data'][0]);
        console.log("headings",headings);
        for (let index = 0; index < headings.length; index++) {
          const header = headings[index];
          const value = res['data'][0][header];
          if (!header.startsWith("_") && value) {
            this.data.push({ head: header, value: value });
          }
        }
        this.items = res['data'][0]['_itemsdetails'];
        for (let index = 0; index < Math.ceil(this.data.length / 2); index++) {
          this.numbers.push(index);
        }
        console.log("Data Details", this.data);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  closeModal(isFatal) {
    this.activeModal.close({ response: isFatal });
  }
}
