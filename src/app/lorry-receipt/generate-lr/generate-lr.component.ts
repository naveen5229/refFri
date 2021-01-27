import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { ParticlularsComponent } from '../../modals/LRModals/particlulars/particlulars.component';
import { windowWhen } from 'rxjs/operators';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { AddConsigneeComponent } from '../../modals/LRModals/add-consignee/add-consignee.component';
import { AddDriverComponent } from '../../modals/add-driver/add-driver.component';
import { AccountService } from '../../services/account.service';
import { MapService } from '../../services/map.service';
import { LRViewComponent } from '../../modals/LRModals/lrview/lrview.component';
import { ChangeDriverComponent } from '../../modals/DriverModals/change-driver/change-driver.component';
import { start } from 'repl';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'generate-lr',
  templateUrl: './generate-lr.component.html',
  styleUrls: ['./generate-lr.component.scss']
})
export class GenerateLRComponent implements OnInit {
  materialDetails = null;
  branches = null;
  vehicleId = null;
  vehicleRegNo = null;
  mobileno;
  flag = false;
  lr = {
    //branch:"Jaipur",
    taxPaidBy: null,
    consigneeName: null,
    consigneeAddress: null,
    consigneeId: null,
    deliveryAddress: null,
    consignorAddress: null,
    consignorName: null,
    consignorId: null,
    sameAsDelivery: false,
    paymentTerm: "1",
    payableAmount: 0,
    lrNumber: null,
    sourceCity: null,
    sourceLat: null,
    sourceLng: null,
    destinationCity: null,
    destinationLat: null,
    destinationLng: null,
    remark: null,
    date: null,
    amount: 0,
    gstPer: 0
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
    id: null
  }

  taName = null;
  taId = null;
  preSelectedDriver = null;
  constructor(private modalService: NgbModal,
    public common: CommonService,
    public accountService: AccountService,
    public api: ApiService,
    public mapService: MapService) {
    let date = new Date();
    date.setDate(date.getDate());
    this.lr.date = date;


    // this.branches = ['Jaipur',"Mumbai", "delhi"];
    // this.lr.date = this.common.dateFormatter(new Date(this.lr.date));
    // this.lr.date = this.common.dateFormatter1(new Date(this.lr.date));
    // console.log("new Date()", new Date(), this.lr.date);


  }

  ngOnDestroy(){}
ngOnInit() {
    // this.getBranches();

  }
  ngAfterViewInit(): void {
    this.mapService.autoSuggestion("sourceCity", (place, lat, long) => {
      this.lr.sourceCity = place;
      this.lr.sourceLat = lat;
      this.lr.sourceLng = long;
    });
    this.mapService.autoSuggestion("destinationCity", (place, lat, long) => {
      this.lr.destinationCity = place;
      this.lr.destinationLat = lat;
      this.lr.destinationLng = long;
    });
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
    const activeModal = this.modalService.open(AddConsigneeComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);

    });
  }

  addDriver() {
    this.common.params = { vehicleId: this.vehicleId, vehicleRegNo: this.vehicleRegNo };
    const activeModal = this.modalService.open(ChangeDriverComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data);
      if (data.data) {
        this.getDriverInfo();
      }

    });
  }
  getvehicleData(vehicle) {
    console.log('Vehicle Data: ', vehicle);
    this.vehicleId = vehicle.id;
    this.vehicleRegNo = vehicle.regno;
    this.getDriverInfo();
  }
  getDriverInfo() {
    let params = {
      vid: this.vehicleId
    };
    this.common.loading++;
    this.api.post('Drivers/getDriverInfo', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res', res['data']);
        if (res['data'].length > 0) {
          this.driver.name = res['data'][0].empname;
          this.driver.id = res['data'][0].driver_id;
          this.mobileno = res['data'][0].mobileno;
          this.preSelectedDriver = { mobileno: res['data'][0].mobileno };
          console.log('------------------:', this.preSelectedDriver);
          //this.flag=true;
          console.log('name,id,number', this.driver.name, this.driver.id, this.mobileno);
        } else
          this.flag = false;


      }, err => {
        this.common.loading--;
        this.common.showError();
      })


  }
  getDriverData(driver) {
    console.log("driver", driver);
    this.driver.name = driver.empname;
    this.driver.licenseNo = driver.licence_no;
    this.driver.id = driver.id
    return this.driver.id;
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
  searchMaterialType(material, i, name) {

  }

  material(i) {
    console.log('material-' + i);
    this.particulars[i].material = document.getElementById('material-' + i)['value'];
    console.log('Vlue', this.particulars[i].material);
  }

  saveDetails() {
    if ((!this.lr.sourceLat) || (!this.lr.destinationLat)) {
      this.common.showError("Source and Destination Location selection are required");
    } else {
      ++this.common.loading;
      let particulars = JSON.parse(JSON.stringify(this.particulars));
      particulars.map(particular => {
        for (let i = 0; i < particular.customfields.customDetail.length; i += 2) {
          particular.customfields[particular.customfields.customDetail[i]] = particular.customfields.customDetail[i + 1];
        }
        particular.customfields = Object.assign({}, particular.customfields);
        delete particular.customfields.customDetail;
      });
      let lrDate = this.common.dateFormatter(this.lr.date).split(' ')[0];
      console.log('params lrdate', lrDate);

      let params = {
        branchId: this.accountService.selected.branch.id,
        vehicleId: this.vehicleId,
        lrNo: this.lr.lrNumber,
        lrDate: lrDate,
        driverId: this.driver.id,
        source: this.lr.sourceCity,
        destination: this.lr.destinationCity,
        consignorId: this.lr.consignorId,
        consigneeId: this.lr.consigneeId,
        amount: this.lr.amount,
        gstPer: this.lr.gstPer,
        totalAmount: this.lr.payableAmount,
        payType: this.lr.paymentTerm,
        taxPaid: this.lr.taxPaidBy,
        travelAgentId: this.taId,
        deliveryAddress: this.lr.deliveryAddress,
        lrDetails: JSON.stringify(particulars),
        remarks: this.lr.remark,
        sourceLat: this.lr.sourceLat,
        sourceLng: this.lr.sourceLng,
        destinationLat: this.lr.destinationLat,
        destinationLng: this.lr.destinationLng,
        consigneeAddress: this.lr.consigneeAddress,
        consignorAddress: this.lr.consignorAddress,
        vehicleRegNo: document.getElementById('vehicleno')['value'],
        lrType: 'false',

      }
      console.log("params", params);


      this.api.post('LorryReceiptsOperation/generateLR', params)
        .subscribe(res => {
          --this.common.loading;
          console.log('response :', res['data'][0].rtn_id);
          if (res['data'][0].rtn_id > 0) {
            this.common.showToast("LR Generated Successfully");
            this.lrView(res['data'][0].rtn_id);
          } else {
            this.common.showError(res['data'][0].rtn_msg);
          }
        }, err => {
          --this.common.loading;
          this.common.showError(err);
          console.log('Error: ', err);
        });
    }
  }

  lrView(lrId) {
    console.log("receipts", lrId);
    this.common.params = { lrId: lrId }
    const activeModal = this.modalService.open(LRViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  checkDateFormat() {
    let dateValue = this.lr.date;
    let datereg = /^\d{4}[-]\d{2}[-]\d{2}$/;
    console.log('this.lrdate', this.lr.date);
    if (dateValue.length < 8) return;

    if (dateValue.match(datereg))
      return;
    else {
      let date = dateValue[0] + dateValue[1];
      let month = dateValue[2] + dateValue[3];
      let year = dateValue.substring(4, 8);
      // this.lrDate= date + '/' + month + '/' + year;
      this.lr.date = year + '-' + month + '-' + date;
      console.log('checkDateFormat', this.lr.date);
    }
  }

  getDate() {
    this.common.params = { ref_page: 'generate-lr' };
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        this.lr.date = this.common.dateFormatter(data.date, 'ddMMYYYY').split(' ')[0];
        // this.dateByIcon=true;
        console.log('lrdate: by getDate ' + this.lr.date);

      }

    });
  }
  resetData(event) {
    this.vehicleId = null;
    console.log(event);
  }

  calculateTotalAmount() {
    let calPer = 0;
    calPer = 100 + parseFloat('' + this.lr.gstPer);
    this.lr.payableAmount = (this.lr.amount * calPer) / 100;
    console.log(calPer, "lr payable amount", this.lr.payableAmount);
  }
}
