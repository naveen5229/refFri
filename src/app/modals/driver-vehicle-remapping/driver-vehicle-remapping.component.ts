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
 // submitted = false;
  //driverRemapForm: FormGroup;
  driverStatus = [];

  maping = {
    regno: '',
    primary: null,
    pdriverMobile:null,
    secondary: null,
    SdriverMobile:null,
    pdStatus:'901',
    sdStatus:'902',
     driverId1:null,
     driverId2:null,

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
    // if(this.common.params.driver){
      
    // }
  }

  ngOnInit() {
    // this.driverRemapForm = this.formbuilder.group({
    //   primaryDriver: [this.common.params.driver.md_name],
    //   pdriverMobile: [this.common.params.driver.md_no, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    //   // scndryDriver: [this.common.params.driver.sd_name],
    //   SdriverMobile: [this.common.params.driver.sd_no, [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
    //   pdStatus: ['901', [Validators.required]],
    //   sdStatus: ['902', [Validators.required]],

    // });
    
  }

 // get f() { return this.driverRemapForm.controls; }

  getvehicleData(Fodriver, driverType) {
    console.log(Fodriver);
    console.log(Fodriver.id);
    console.log(Fodriver.mobileno);
   if(driverType=='primary'){
     this.maping.primary=Fodriver.empname;
     this.maping.pdriverMobile=Fodriver.mobileno;
    this.maping.driverId1=Fodriver.id;
   // this.common.params=Fodriver;

   }
   if(driverType=='secondary'){
    this.maping.secondary=Fodriver.empname;
    this.maping.SdriverMobile=Fodriver.mobileno;
    this.maping.driverId2=Fodriver.id;

   }
    //this.common.params=driver;
   // this.maping.primary = this.common.params.driver;
     
    console.log('Mapping: ', this.maping);
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

  Remapdriver() {
    //let response;
    let params = {
      driverId1: this.maping.driverId1,
      driverId2: this.maping.driverId2,
      refId: this.common.params.driver.v_id,
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


}
