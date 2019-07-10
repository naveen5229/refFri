import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MapService } from '../../../services/map.service';
import { AccountService } from '../../../services/account.service';
import { AddConsigneeComponent } from '../add-consignee/add-consignee.component';
import { ChangeDriverComponent } from '../../DriverModals/change-driver/change-driver.component';
import { DatePickerComponent } from '../../date-picker/date-picker.component';
import { LRViewComponent } from '../lrview/lrview.component';
import { isArray } from 'util';
import { AddFieldComponent } from '../add-field/add-field.component';

@Component({
  selector: 'lr-generate',
  templateUrl: './lr-generate.component.html',
  styleUrls: ['./lr-generate.component.scss']
})
export class LrGenerateComponent implements OnInit {
  images = [];
  branches = null;
  vehicleId = null;
  vehicleRegNo = null;
  mobileno;
  flag = false;
  img_flag = false;
  LrData = null;
  btntxt = 'SAVE';
  lr = {
    //branch:"Jaipur",
    id: null,
    taxPaidBy: "1",
    consigneeName: null,
    consigneeAddress: null,
    consigneeId: null,
    deliveryAddress: null,
    consignorAddress: null,
    consignorName: null,
    consignorId: null,
    sameAsDelivery: false,
    paymentTerm: 1,
    payableAmount: 0,
    advanceAmount: 0,
    remainingAmount: 0,
    lrNumber: null,
    lrNumberText: '',
    sourceCity: null,
    sourceLat: null,
    sourceLng: null,
    destinationCity: null,
    destinationLat: null,
    destinationLng: null,
    remark: null,
    date: null,
    amount: 0,
    gstPer: 0,
    lrType: 1,
    vehicleType: 1,
    lrCategory: 1,
    grossWeight: 0,
    netWeight: 0,
    tareWeight: 0,
    invoicePayer: null,
    invoiceTo: 9,
    invoicePayerId: null,
  };
  fofields = []
  particulars = [
    {
      material: null,
      articles: null,
      weight: null,
      weight_unit: 'kg',
      invoice: null,
      material_value: null,
      customjsonfields: [
        {
          field1: null,
          value1: null,
          field2: null,
          value2: null,
          field3: null,
          value3: null,
          field4: null,
          value4: null,
        }
      ],
    }]

  driver = {
    name: null,
    licenseNo: null,
    id: null
  }

  taName = null;
  taId = null;
  preSelectedDriver = null;

  constructor(
    public common: CommonService,
    public accountService: AccountService,
    public api: ApiService,
    public mapService: MapService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {
    this.common.handleModalSize('class', 'modal-lg', '1300');
    let date = new Date();
    date.setDate(date.getDate());
    this.lr.date = date;
    this.getAllFieldName();
    console.log("this.lr.date", this.lr.date);
    if (this.common.params.LrData) {
      this.lr.id = this.common.params.LrData.lr_id;
      this.getLrDetails();
      this.btntxt = 'UPDATE'
    }
    if (this.accountService.selected.branch.id) {
      this.getBranchDetails();
    }
  }

  ngOnInit() {
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

  getBranchDetails() {
    if (this.accountService.selected.branch.id) {
      this.api.get('LorryReceiptsOperation/getBranchDetilsforLr?branchId=' + this.accountService.selected.branch.id)
        .subscribe(res => {
          console.log("branchdetails", res['data']);
          this.setBranchDetails(res['data'][0]);
        }, err => {
          this.common.loading--;
          console.log(err);
        });
    }
  }

  setBranchDetails(lrDetails) {
    this.lr.lrNumber = lrDetails.lrnum;
    this.lr.lrNumberText = lrDetails.lrprefix;
  }
  addConsignee() {
    console.log("open material modal")
    const activeModal = this.modalService.open(AddConsigneeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
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
          //this.flag=true;
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
    this.driver.id = driver.id;
    this.mobileno = driver.mobileno;
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

  getInvoicePayerDetail(InvoicePayer) {
    this.lr.invoicePayer = InvoicePayer.name;
    this.lr.invoicePayerId = InvoicePayer.id;
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
      weight_unit: 'kg',
      invoice: null,
      material_value: null,

      customjsonfields: [
        {
          field1: null,
          value1: null,
          field2: null,
          value2: null,
          field3: null,
          value3: null,
          field4: null,
          value4: null,
        }
      ],
    });
  }
  searchTaName(taDetail) {
    this.taName = taDetail.name;
    this.taId = taDetail.id;
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
      console.log('particulars', particulars);

      if (particulars) {
        particulars.map(particular => {
          let keys = [];
          particular.customfields = [];
          if (typeof particular.customjsonfields == 'string') {
            particular.customjsonfields = JSON.parse(particular.customjsonfields);
            keys = Object.keys(particular.customjsonfields);
            console.log("keys---", keys);
            particular.customfields[0] = {};
            for (let i = 0; i < keys.length; i++) {
              particular.customfields[0][keys[i]] = particular.customjsonfields[keys[i]]
            }
          } else if (isArray(particular.customjsonfields)) {
            particular.customjsonfields.forEach((customjsonfield, index) => {
              keys = Object.keys(customjsonfield);
              console.log("keys:", keys);
              particular.customfields[index] = {};
              for (let i = 0; i < keys.length - 1; i = i + 2) {
                particular.customfields[index][customjsonfield[keys[i]]] = customjsonfield[keys[i + 1]]
              }
            });

          }
          delete particular.customjsonfield;
          console.log("customfields", particular.customfields);
        });
      }

      let lrDate = this.common.dateFormatter(this.lr.date).split(' ')[0];

      let params = {
        lrId: this.lr.id,
        branchId: this.accountService.selected.branch.id,
        vehicleId: this.vehicleId,
        lrNo: this.lr.lrNumber,
        lrNoText: this.lr.lrNumberText,
        lrDate: lrDate,
        driverId: this.driver.id,
        source: this.lr.sourceCity,
        destination: this.lr.destinationCity,
        consignorId: this.lr.consignorId,
        consigneeId: this.lr.consigneeId,
        invoiceTo: this.lr.invoiceTo,
        invoicePayerId: this.lr.invoicePayerId,
        amount: this.lr.amount,
        gstPer: this.lr.gstPer,
        totalAmount: this.lr.payableAmount,
        payType: this.lr.paymentTerm,
        advanceAmount: this.lr.advanceAmount,
        taxPaid: this.lr.taxPaidBy,
        travelAgentId: this.taId,
        netWeight: this.lr.netWeight,
        grossWeight: this.lr.grossWeight,
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
        lrType: this.lr.lrType,
        lrCategory: this.lr.lrCategory,
        vehicleType: this.lr.vehicleType

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
  resetData() {
    this.vehicleId = null;
  }

  calculateTotalAmount() {
    let calPer = 0;
    calPer = 100 + parseFloat('' + this.lr.gstPer);
    this.lr.payableAmount = (this.lr.amount * calPer) / 100;
    console.log(calPer, "lr payable amount", this.lr.payableAmount);
    this.calculateReminingAmount();
  }

  calculateTareWeight() {
    this.lr.tareWeight = this.lr.grossWeight - this.lr.netWeight;
    console.log("this.lr.tareWeight", this.lr.tareWeight);
  }

  calculateReminingAmount() {
    this.lr.remainingAmount = this.lr.payableAmount - this.lr.advanceAmount;
    console.log("this.lr.remainingAmount", this.lr.remainingAmount);
  }
  closeModal() {
    this.activeModal.close(true);
  }

  loadImage(flag) {
    if (flag == 'LR') {
      this.images[0] = this.LrData.lr_image;
      console.log('LR', this.images[0]);

    } else if (flag == 'Invoice') {

      if (this.LrData.invoice_image) {
        this.images[0] = this.LrData.invoice_image;
        console.log('Invoice', this.images[0]);
      } else { this.common.showError('Image not present!!') }

    } else if (flag == 'Other') {

      if (this.LrData.other) {
        this.images[0] = this.LrData.other;
        console.log('Invoice', this.images[0]);
      } else { this.common.showError('Image not present!!') }
    }
  }

  getLrDetails() {
    let lrDetails = null;
    let particularDetails = null;
    ++this.common.loading;
    let params = {
      lrId: this.lr.id
    }
    this.api.post('LorryReceiptsOperation/lrDetails', params)
      .subscribe(res => {
        --this.common.loading;
        console.log("responsedate0000", res);
        if (res['data']) {
          console.log("responsedate1", JSON.parse(res['data']).result[0], "responsedate2", JSON.parse(res['data']).details);
          lrDetails = JSON.parse(res['data']).result[0];
          this.LrData = lrDetails;
          particularDetails = JSON.parse(res['data']).details

          this.setlrDetails(lrDetails);
          this.setlrParticulars(particularDetails);
        }
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });
  }
  setlrDetails(lrDetails) {
    let branchDetails = {
      id: lrDetails.branch_id,
      name: lrDetails.branch_name,
      lr_number: null,
      is_constcenterallow: false
    }
    console.log("branchDetails", branchDetails);

    this.lr.taxPaidBy = "" + lrDetails.taxpaid_by;
    this.lr.consigneeName = lrDetails.consignee;
    this.lr.consigneeAddress = lrDetails.consignee_address;
    this.lr.consigneeId = lrDetails.consignee_id;
    this.lr.deliveryAddress = lrDetails.delivery_address;
    this.lr.consignorAddress = lrDetails.consigner_address;
    this.lr.consignorName = lrDetails.consignor;
    this.lr.consignorId = lrDetails.consigner_id;
    this.lr.invoicePayer = lrDetails.invoiceto_name;
    this.lr.invoicePayerId = lrDetails.invoice_payer_id;
    this.lr.invoiceTo = lrDetails.invoiceto_type;
    this.lr.paymentTerm = lrDetails.pay_type;
    this.lr.payableAmount = lrDetails.total_amount;
    this.lr.lrNumberText = lrDetails.lr_prefix;
    this.lr.lrNumber = lrDetails.lr_num;
    this.lr.sourceCity = lrDetails.source;
    this.lr.sourceLat = lrDetails.source_lat;
    this.lr.sourceLng = lrDetails.source_long;
    this.lr.destinationCity = lrDetails.destination;
    this.lr.destinationLat = lrDetails.destination_lat;
    this.lr.destinationLng = lrDetails.destination_long;
    this.lr.remark = lrDetails.remark;
    this.lr.date = new Date(this.common.dateFormatter(lrDetails.lr_date));
    this.lr.amount = lrDetails.amount ? lrDetails.amount : 0;
    this.lr.advanceAmount = lrDetails.advance_amount;
    this.lr.remainingAmount = lrDetails.pending_amount;
    this.lr.gstPer = lrDetails.gstrate;
    this.lr.netWeight = lrDetails.net_weight;
    this.lr.grossWeight = lrDetails.gross_weight;
    this.lr.tareWeight = lrDetails.tare_weight ? lrDetails.tare_weight : 0;
    this.lr.lrType = lrDetails.lr_asstype;
    this.lr.vehicleType = lrDetails.veh_asstype;
    this.lr.lrCategory = lrDetails.is_ltl;
    this.driver.name = lrDetails.driver_name;
    this.driver.licenseNo = lrDetails.driver_license;
    this.mobileno = lrDetails.driver_mobile
    this.driver.id = lrDetails.driver_id;
    this.taName = lrDetails.travelagent;
    this.taId = lrDetails.ta_id;
    this.vehicleId = lrDetails.vehicle_id;
    this.vehicleRegNo = lrDetails.regno;
    this.accountService.selected.branch = branchDetails;
    console.log("this.accountService.selected.branch", this.accountService.selected.branch)
    if (lrDetails.lr_image || lrDetails.invoice_image) {
      this.img_flag = true;
      this.loadImage('LR');
    }
    console.log("lr", this.lr);

  }
  setlrParticulars(particularDetails) {
    console.log("particularDetails+++++", particularDetails);
    particularDetails.forEach(detail => {
      let customjfields = [];
      if (detail.customjsonfields) {
        detail.customjsonfields.forEach((customjfield, index) => {
          const customIndex = Math.floor(index / 4);
          const fieldIndex = (index % 4) + 1;
          if (!customjfields[customIndex]) {
            customjfields[customIndex] = {};
            for (let i = 1; i <= 4; i++) {
              customjfields[customIndex]['field' + i] = "";
              customjfields[customIndex]['value' + i] = "";
            }
          }

          customjfields[customIndex]['field' + fieldIndex] = customjfield.name;
          customjfields[customIndex]['value' + fieldIndex] = customjfield.value;
        });
      }
      detail.customjsonfields = customjfields;
    });
    this.particulars = particularDetails;
    console.log("particularDetails-----", this.particulars);
  }

  addField(index) {
    this.particulars[index].customjsonfields.push(
      {
        field1: null,
        value1: null,
        field2: null,
        value2: null,
        field3: null,
        value3: null,
        field4: null,
        value4: null,
      }
    )
  }
  addFoField() {
    const activeModal = this.modalService.open(AddFieldComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', });
    activeModal.result.then(data => {
      console.log('Data:', data);

      this.getAllFieldName();

    });
  }

  getAllFieldName() {
    this.api.get('Suggestion/lrFoFields?sugId=1')
      .subscribe(res => {
        this.fofields = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }


}
