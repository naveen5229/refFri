import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ConfirmComponent } from '../confirm/confirm.component';
// import { UserService } from '../../../services/user.service';
@Component({
  selector: 'driver-vehicle-remapping',
  templateUrl: './driver-vehicle-remapping.component.html',
  styleUrls: ['./driver-vehicle-remapping.component.scss']
})
export class DriverVehicleRemappingComponent implements OnInit {
  // submitted = false;
  //driverRemapForm: FormGroup;
  driverStatus = [];
  driverList = [];
  maping = {
    regno: '',
    primary: null,
    pdriverMobile: null,
    secondary: null,
    SdriverMobile: null,
    pdStatus: '901',
    sdStatus: '902',
    driverId1: null,
    driverId2: null,
    refId: null,
  };
  md = null;
  sd = null;
  constructor(
    public common: CommonService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    private formbuilder: FormBuilder,
    public api: ApiService,
    // public user: UserService,
  ) {
    this.maping.refId = this.common.params.driver.v_id;
    //console.log('vehicle', this.maping.refId);
    this.maping.regno = this.common.params.driver.regno;
    //console.log('info', this.common.params.driver);
    this.md = this.common.params.driver.md_id;
    this.sd = this.common.params.driver.sd_id;
    if (this.common.params.driver) {
      this.maping.primary = { empname: this.common.params.driver.md_name };

      this.maping.pdriverMobile = this.common.params.driver.md_no;
      this.maping.driverId1 = this.common.params.driver.md_id;
      //  console.log('id', this.maping.driverId1);

      this.maping.secondary = { empname: this.common.params.driver.sd_name };

      this.maping.SdriverMobile = this.common.params.driver.sd_no;
      this.maping.driverId2 = this.common.params.driver.sd_id;
      // console.log('id1', this.maping.driverId2);
      // console.log('mob2', this.common.params.driver.sd_no);
    }
    // console.log('Params: ', this.common.params);
    this.getdriverStatus();
    this.getdriverList();
    // if(this.common.params.driver){

    // }
  }

  ngOnInit() {


  }



  getvehicleData(Fodriver, driverType) {

    if (driverType == 'primary') {
      this.maping.primary = { empname: Fodriver.empname };
      this.maping.pdriverMobile = Fodriver.mobileno;
      this.maping.driverId1 = Fodriver.id;
      // this.common.params=Fodriver;

    }
    if (driverType == 'secondary') {
      this.maping.secondary = Fodriver.empname;
      this.maping.SdriverMobile = Fodriver.mobileno;
      this.maping.driverId2 = Fodriver.id;

    }
    //this.common.params=driver;
    // this.maping.primary = this.common.params.driver;


  }

  closeModal() {
    this.activeModal.close({ response: true });
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
  getdriverList() {
    this.common.loading++;
    let response;
    this.api.get('Drivers/getFoDrivers')
      .subscribe(res => {
        this.common.loading--;

        this.driverList = res['data'];
        console.log("Driver Status:", this.driverStatus);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
    return response;

  }

  Remapdriver() {
    //let response;
    let params = {
      isCheck: 1,
      driverId1: this.maping.driverId1,
      driverId2: this.maping.driverId2,
      refId: this.maping.refId,
      statusCode1: this.maping.pdStatus,
      statusCode2: this.maping.sdStatus,
    };
    this.common.loading++;

    this.api.post('/Drivers/setInputs', params)
      .subscribe(res => {
        this.common.loading--;

        this.openConrirmationAlert(res);
        console.log('responsedata', res);
        //this.closeModal();

        //console.log("Driver Status:", this.driverStatus);
      }, err => {
        this.common.loading--;
        console.log(err);
      });


  }
  openConrirmationAlert(data) {
    if (data.code == 1) {
      console.log('data response', data.code);
      let params = {
        isCheck: 1,
        driverId1: this.maping.driverId1,
        driverId2: this.maping.driverId2,
        refId: this.maping.refId,
        statusCode1: this.maping.pdStatus,
        statusCode2: this.maping.sdStatus,
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
    else if (data.code == 0) {
      console.log('code', data.code);
      this.common.params = {
        title: data.msg,
        description: " Do you want to continue ?"
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
        if (data.response) {

          let params = {
            isCheck: 0,
            driverId1: this.maping.driverId1,
            driverId2: this.maping.driverId2,
            refId: this.maping.refId,
            statusCode1: this.maping.pdStatus,
            statusCode2: this.maping.sdStatus,
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
      });
    }

    else if (data.code == -1) {
      this.common.showError('', data.msg);
    }
  }

}
