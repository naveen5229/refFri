import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ParticlularsComponent } from '../../modals/LRModals/particlulars/particlulars.component';
import { windowWhen } from 'rxjs/operators';
import { AddConsigneeComponent } from '../../modals/LRModals/add-consignee/add-consignee.component';
import { AddDriverComponent } from '../../modals/add-driver/add-driver.component';
import { AccountService } from '../../services/account.service';
import { LRViewComponent } from '../lrview/lrview.component';


@Component({
  selector: 'generate-lr',
  templateUrl: './generate-lr.component.html',
  styleUrls: ['./generate-lr.component.scss']
})
export class GenerateLRComponent implements OnInit {
  materialDetails = null;
  branches = null;
  vehicleId = null;
  lr = {
    //branch:"Jaipur",
    taxPaidBy: null,
    consigneeName:null,
    consigneeAddress: null,
    consigneeId:null,
    deliveryAddress: null,
    consignorAddress: null,
    consignorName :null,
    consignorId:null,
    sameAsDelivery: false,
    paymentTerm: "1",
    payableAmount: 1000,
    lrNumber: null,
    sourceCity:null,
    destinationCity:null,
    date: '' + new Date()
  };

  particulars = [
    {
      material: null,
      articles: null,
      weight: null,
      invoice: null,
      material_value: null,
      customfields:
      {
        containerno: null,
        sealno: null,
        dcpino: null,
        customDetail: [],
      },
      customField: false,
      customButton: true
    }]

  driver = {
    name: null,
    licenseNo: null,
    id:null
  }

  taName = null;
  taId = null;

  constructor(private modalService: NgbModal,
    public common: CommonService,
    public accountService : AccountService,
    public api: ApiService, ) {
    // this.branches = ['Jaipur',"Mumbai", "delhi"];
    this.lr.date = this.common.dateFormatter(new Date(this.lr.date));
    console.log("new Date()", new Date(), this.lr.date);
   
  }

  ngOnInit() {
    this.getBranches();
    
  }
  getBranches() {
    this.api.post('Suggestion/GetBranchList', { search: 123 })
      .subscribe(res => {
        console.log('Branches :', res['data']);
        this.accountService.branches = res['data'];
      }, err => {
        console.log('Error: ', err);
      });
  }

  addConsignee() {
    console.log("open material modal")
    const activeModal = this.modalService.open(AddConsigneeComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  addDriver() {
    console.log("open material modal")
    const activeModal = this.modalService.open(AddDriverComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }
  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
    this.vehicleId = vehicle.id;

  }
  getDriverData(driver) {
    console.log("driver", driver);
    this.driver.name = driver.empname;
    this.driver.licenseNo = driver.licence_no;
    this.driver.id = driver.id
  }
  getConsignorDetail(consignor) {
    console.log("consignor", consignor);
    this.lr.consignorAddress = consignor.address;
    this.lr.consignorName = consignor.name;
    this.lr.consignorId = consignor.id;
  }
  getConsigneeDetail(consignee) {
    console.log("consignee", consignee);
    this.lr.consigneeAddress = consignee.address;
    this.lr.consigneeName = consignee.name;
    this.lr.consigneeId = consignee.id;
  }
  getBranchDetails() {
    // console.log(this.lr.branch)
  }
  fillConsigneeAddress() {
    console.log("sameAsDelivery", this.lr.consigneeAddress);
    if (this.lr.sameAsDelivery)
      this.lr.deliveryAddress = this.lr.consigneeAddress;
    else
      this.lr.deliveryAddress = null;
  }
  addMore() {
    this.particulars.push({
      material: null,
      articles: null,
      weight: null,
      invoice: null,
      material_value: null,
      customfields:
      {
        containerno: null,
        sealno: null,
        dcpino: null,
        customDetail: [],
      },
      customField: false,
      customButton: true

    });
  }
  searchTaName(taDetail) {
    this.taName = taDetail.name;
    this.taId = taDetail.id;
  }
  searchMaterialType(material, i) {
    this.particulars[i].material = material.name;
  }

  saveDetails() {
    ++this.common.loading;
    let particulars = JSON.parse(JSON.stringify(this.particulars));
    particulars.map(particular => {
      for (let i = 0; i < particular.customfields.customDetail.length; i += 2) {
        particular.customfields[particular.customfields.customDetail[i]] = particular.customfields.customDetail[i + 1];
      }
      particular.customfields = Object.assign({}, particular.customfields);
      delete particular.customfields.customDetail;
    });

    this.lr.date = this.common.dateFormatter(new Date(this.lr.date));
    // let params1 = {
    //   lrDetails: this.lr,
    //   particulars: particulars
    // }
    // console.log("params1", params1);
    // console.log("Branch Id",this.accountService.selected.branch);
    let params = {
      branchId : this.accountService.selected.branch,
      vehicleId :this.vehicleId,
      lrNo : this.lr.lrNumber ,
      lrDate :this.lr.date,
      driverId :this.driver.id,
      source :this.lr.sourceCity,
      destination :this.lr.destinationCity,
      consignorId :this.lr.consignorId,
      consigneeId :this.lr.consigneeId,
      amount : this.lr.payableAmount,
      payType : this.lr.paymentTerm,
      taxPaid :this.lr.taxPaidBy,
      travelAgentId:this.taId,
      deliveryAddress:this.lr.deliveryAddress,
      lrDetails:JSON.stringify(this.particulars),
      remarks:null
    }
    console.log("params",params);
    
    this.api.post('LorryReceiptsOperation/generateLR', params)
      .subscribe(res => {
        console.log('response :', res);
        --this.common.loading;
      }, err => {
        --this.common.loading;
        console.log('Error: ', err);
      });
  }
}
