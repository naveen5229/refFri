import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
// import { UserService } from '../../../services/user.service';
@Component({
  selector: 'driver-vehicle-remapping',
  templateUrl: './driver-vehicle-remapping.component.html',
  styleUrls: ['./driver-vehicle-remapping.component.scss']
})
export class DriverVehicleRemappingComponent implements OnInit {
  submitted = false;
  driverRemapForm: FormGroup;
  driverStatus = [];

  maping = {
    regno: '',
    driver: {
      primary: '',
      secondary: ''
    },
    mobile: {
      primary: '',
      secondary: ''
    }
  };

  constructor(
    public common: CommonService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private formbuilder: FormBuilder,
    public api: ApiService,
    // public user: UserService,
  ) {
    this.maping.regno = this.common.params.driver.regno;
    console.log('Params: ', this.common.params);
    this.getdriverStatus();
  }

  ngOnInit() {
    this.driverRemapForm = this.formbuilder.group({
     primaryDriver: [this.common.params.driver.md_name],
      pdriverMobile: [this.common.params.driver.md_no, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      scndryDriver: [this.common.params.driver.sd_name],
      SdriverMobile: [this.common.params.driver.sd_no, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      pdStatus: ['901', [Validators.required]],
      sdStatus: ['902', [Validators.required]],

    });
  }

  get f() { return this.driverRemapForm.controls; }

  closeModal() {
    this.activeModal.close({response:true});
  }
  getdriverStatus() {
    this.common.loading++;
    let response;
    this.api.get('/Drivers/getStatus')
      .subscribe(res => {
        this.common.loading--;

        this.driverStatus = res['data'];
        console.log("Driver Status:", this.driverStatus);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }
  Remapdriver() {
    let response;
    let params = {
      driverId1 :this.common.params.driver.md_id,
      driverId2:this.common.params.driver.sd_id,
      refId:this.common.params.driver.v_id,
      statusCode1: this.driverRemapForm.controls.pdStatus.value,
      statusCode2: this.driverRemapForm.controls.sdStatus.value,
    };
    this.common.loading++;

    this.api.post('/Drivers/setInputs', params)
      .subscribe(res => {
        this.common.loading--;
         this.closeModal();

        //console.log("Driver Status:", this.driverStatus);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    

  }

}
