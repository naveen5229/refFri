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
    name: null
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

  searchDriver(driver) {
    console.log("driver", driver)
    this.driver.name = driver.empname;
    this.driver.mobileNo = driver.mobileno;
    this.driver.id = driver.id;

  }
  closeModal() {
    this.activeModal.close();
  }
  changDriver() {
    this.common.loading++;
    let params = {
      vehicleId: this.vehicleId,
      driverId: this.driver.id
    }
    console.log("change driver params", params);
    this.api.post('Drivers/changeDriver', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res['data']);
        if (res['code'] == '1') {
          this.common.showToast('Driver Changed Successfully');
          this.closeModal();
        }
        else
          this.common.showError('Driver Not Changed');

      }, err => {
        this.common.loading--;
        this.common.showError();
      })
  }

}
