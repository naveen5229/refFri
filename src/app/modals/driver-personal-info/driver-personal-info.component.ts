import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'driver-personal-info',
  templateUrl: './driver-personal-info.component.html',
  styleUrls: ['./driver-personal-info.component.scss']
})
export class DriverPersonalInfoComponent implements OnInit {
  driverInfo=[];
 name='';
 address='';
 pNumber='';
 sNumber='';
 DOB='';
 aadhar='';
 GuranterM='';
 DLexpiry='';
 LicenceNo=''
 Gname='';
 Dltype='';
 photo='';
 pan='';
  constructor(
    public activeModal:NgbActiveModal,
    public common:CommonService,
    public api:ApiService
    ) {
      console.log("---------",this.common.params.driverId)
      this.driverPersonalInfo();
     }

  ngOnInit() {
  }
 
  closeModal(){
    this.activeModal.close({response:true});
  }


  driverPersonalInfo(){
   let params = "driverId=" + this.common.params.driverId
   console.log("=======",params)
   this.common.loading++;

   this.api.get('Drivers/getDriverPersonalInfo?'+ params)
      .subscribe(res => {
        this.common.loading--;
        this.driverInfo = res['data'];
        console.log('Res:', this.driverInfo);
         this.name=this.driverInfo[0].empname
         console.log("-------------------",this.name)
         this.address=this.driverInfo[0].address
         this.pNumber=this.driverInfo[0].mobileno
         this.DOB=this.driverInfo[0].dob
         this.aadhar=this.driverInfo[0].aadhar_no
        this.sNumber=this.driverInfo[0].mobileno2
        this.GuranterM=this.driverInfo[0].guarantor_mobileno
        this.DLexpiry=this.driverInfo[0].dl_expiry
        this.LicenceNo=this.driverInfo[0].licence_no
        this.Dltype =this.driverInfo[0].licence_type
        this.photo=this.driverInfo[0].photo
        this.pan =this.driverInfo[0].pan_no
        console.log("dataaaaaaaaaaaaa",this.driverInfo);
  })

}
}
