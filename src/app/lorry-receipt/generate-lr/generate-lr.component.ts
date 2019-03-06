import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ParticlularsComponent } from '../../modals/LRModals/particlulars/particlulars.component';
import { windowWhen } from 'rxjs/operators';
import { AddConsigneeComponent } from '../../modals/LRModals/add-consignee/add-consignee.component';
import { AddDriverComponent } from '../../modals/add-driver/add-driver.component';


@Component({
  selector: 'generate-lr',
  templateUrl: './generate-lr.component.html',
  styleUrls: ['./generate-lr.component.scss']
})
export class GenerateLRComponent implements OnInit {
materialDetails = null;
branches = null;
lr = {
  branch:"Jaipur",
  taxPaidBy:null,
  consigneeAddress:null,
  deliveryAddress:null,
  consignorAddress:null,
  sameAsDelivery: false,
  paymentTerm : "ToBeFilled",
  payableAmount:1000,
  //date:this.common.dateFormatter(new Date())
};

particulars = [
  {
     articleNo:null,    
     weight:null,
     otherDetail :
    {
     invoice:null,
     material:null,
     materialValue:null,
     containerNo:null,
     sealNo:null,
     dcpiNo:null,
     customDetail:[],
    },
    customField:false,
    customButton:true
   }]

   driver={
     name:"Lalit",
     licenseNo:"ABDV1234"
   }

  constructor(private modalService: NgbModal,
    public common: CommonService,
    public api: ApiService,) {
      this.branches = ['Jaipur',"Mumbai", "delhi"];
     }

  ngOnInit() {
  }

  addConsignee(){
    console.log("open material modal")
    const activeModal = this.modalService.open(AddConsigneeComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  addDriver(){
    console.log("open material modal")
    const activeModal = this.modalService.open(AddDriverComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }
  getvehicleData(vehicle) {
     console.log('Vehicle Data: ', vehicle);
    // this.selectedVehicle = vehicle.id;
    // this.common.loading++;
    // this.api.post('Vehicles/getVehicleDocumentsById', { x_vehicle_id: vehicle.id })
    //   .subscribe(res => {
    //     this.common.loading--;
    //     this.documentUpdate();
    //   }, err => {
    //     this.common.loading--;
    //     console.log(err);
    //   });

  }
  getDriverData(driver){
    console.log("driver",driver);
    this.driver.name = driver.empname;
    this.driver.licenseNo = "567555";
  }
  getConsignorDetail(consignor){
    console.log("consignor",consignor);
  }
  getConsigneeDetail(consignee){
    console.log("consignee",consignee);
  }
  getBranchDetails(){
    console.log(this.lr.branch)
  }
  fillConsigneeAddress()
{
  console.log("sameAsDelivery",this.lr.consigneeAddress);
  if(this.lr.sameAsDelivery)
   this.lr.deliveryAddress= this.lr.consigneeAddress ;
  else
  this.lr.deliveryAddress = null;
}
addMore() {
  this.particulars.push({   
      articleNo:null,    
      weight:null,
      otherDetail :
     {
      invoice:null,
      material:null,
      dcpiNo:null,
      materialValue:null,
      containerNo:null,
      sealNo:null,
      customDetail:[],
     },
     customField:false,
     customButton:true
  });
}

saveDetails(){
  let params={
    lrDetails:this.lr,
    particulars:this.particulars
  }
  console.log("params",params);
}
}
