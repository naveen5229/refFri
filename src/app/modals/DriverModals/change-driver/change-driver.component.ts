import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'change-driver',
  templateUrl: './change-driver.component.html',
  styleUrls: ['./change-driver.component.scss']
})
export class ChangeDriverComponent implements OnInit {
  vehicleRegNo = null;
  vehicleId = null;
  driver = {
    mobileNo: null,
    id: null,
    name: null,
    licence:null,
  }
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.vehicleRegNo = this.common.params.vehicleRegNo;
    this.vehicleId = this.common.params.vehicleId;
  }

  ngOnInit() {
  }

  searchVehicle(driver) {

  }

  searchDriver(driver) {
    console.log("driver", driver)
    this.driver.name = driver.empname;
    this.driver.mobileNo = driver.mobileno;
    this.driver.id = driver.id;
    this.driver.licence = driver.licence_no;

  }
  closeModal() {
    this.activeModal.close();
  }
  changDriver() {

    this.common.loading++;
    let params = {
      vehicleId: this.vehicleId,
      driverId: this.driver.id ? this.driver.id : -1,
      driverMobileno: this.driver.mobileNo ? this.driver.mobileNo : document.getElementById('driverno')['value'],
      driverName: this.driver.name,
      licenceNo : this.driver.licence
    }

    this.api.post('Drivers/changeDriver', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        if (res['data'][0].r_id > 0) {
          this.common.showToast('Driver Changed Successfully');
          setTimeout(() => {
            this.activeModal.close({ data: res['data'][0].r_id });
          }, 100);
        }
        else
          this.common.showError(res['data'][0].r_msg);

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

}
