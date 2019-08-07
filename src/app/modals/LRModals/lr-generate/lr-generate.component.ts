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
import { LocationSelectionComponent } from '../../location-selection/location-selection.component';
import { AddMaterialComponent } from '../add-material/add-material.component';
import { AddTransportAgentComponent } from '../add-transport-agent/add-transport-agent.component';

@Component({
  selector: 'lr-generate',
  templateUrl: './lr-generate.component.html',
  styleUrls: ['./lr-generate.component.scss', '../../../pages/pages.component.css']
})
export class LrGenerateComponent implements OnInit {
  lr = {
    lrType: 1,
    vehicleType: 1,
    lrCategory: 1
  }
  keepGoing = true;
  btnTxt = "SAVE";
  img_flag = false;
  lrGeneralField = [
    { r_title: 'vehicle No', r_colorder: 1, r_coltype: 1, r_value: null, r_id: null, r_name: 'vehicle_no', r_required: null },
    { r_title: 'Lr No', r_colorder: 2, r_coltype: 1, r_value: null, r_required: null, r_id: null, r_name: 'lr_no' },
    { r_title: 'Date', r_colorder: 3, r_coltype: 1, r_value: null, r_required: null, r_id: null, r_name: 'date' },
    { r_title: null, r_colorder: 4, r_coltype: 1, r_value: null, r_id: null, r_name: null },
    { r_title: 'Consignor Name', r_colorder: 5, r_coltype: 1, r_value: null, r_id: null, r_name: 'company' },
    { r_title: 'Consignor Address', r_colorder: 6, r_coltype: 1, r_value: null, r_id: null, r_name: 'address' },
    { r_title: 'Consignee Name', r_colorder: 7, r_coltype: 1, r_value: null, r_id: null, r_name: 'company' },
    { r_title: 'Consignee Address', r_colorder: 8, r_coltype: 1, r_value: null, r_id: null, r_name: 'address' },
    { r_title: 'Source City', r_colorder: 9, r_coltype: 1, r_value: null, r_id: null, r_name: 'location' },
    { r_title: 'Destination City', r_colorder: 10, r_coltype: 1, r_value: null, r_id: null, r_name: 'location' },
    { r_title: 'Tax Paid By', r_colorder: 11, r_coltype: 1, r_value: null, r_id: null, r_name: 'tax_paid_by' }
  ];

  evenArray = [];
  oddArray = [];
  constructor(
    public common: CommonService,
    public accountService: AccountService,
    public api: ApiService,
    public mapService: MapService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) {
    if (this.img_flag) {
      this.common.handleModalSize('class', 'modal-lg', '1600');
    }
    else {
      this.common.handleModalSize('class', 'modal-lg', '1000');

    }
    this.formatArray();

    if (this.accountService.selected.branch.id) {
      this.getBranchDetails();
    }
  }

  ngOnInit() {
  }
  ngAfterViewInit(): void {

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

  }
  addCompany() {
    console.log("open consignee modal")
    const activeModal = this.modalService.open(AddConsigneeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);

    });
  }

  changeLrTypeData() {

  }

  addTransportAgent() {
    console.log("open T a. modal")
    const activeModal = this.modalService.open(AddTransportAgentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);

    });
  }

  addDriver() {
    this.common.params = { vehicleId: null, vehicleRegNo: null };
    const activeModal = this.modalService.open(ChangeDriverComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log("data", data);
      if (data.data) {
        this.getDriverInfo();
      }
    });
  }

  getvehicleData(vehicle) {

  }
  getDriverInfo() {



  }
  getDriverData(driver) {

  }
  getConsignorDetail(consignor) {

  }
  getConsigneeDetail(consignee) {

  }

  getInvoicePayerDetail(InvoicePayer) {

  }
  fillConsigneeAddress() {

  }
  addMore() {

  }
  searchTaName(taDetail) {

  }
  setMaterialDetail(material, i) {

  }

  material(i) {

  }

  saveDetails() {
    this.lrGeneralField = this.evenArray.concat(this.oddArray);

    console.log("lr details", JSON.stringify(this.lrGeneralField));
  }



  lrView(lrId) {
    console.log("receipts", lrId);
    this.common.params = { lrId: lrId }
    const activeModal = this.modalService.open(LRViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  addMaterial() {
    console.log('add material');
    const activeModal = this.modalService.open(AddMaterialComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  getDate() {

  }

  resetData() {

  }

  calculateTotalAmount() {

  }

  calculateTareWeight() {

  }

  calculateReminingAmount() {

  }
  closeModal() {
    this.activeModal.close(true);
  }

  loadImage(flag) {

  }

  getLrDetails() {

  }
  setlrDetails(lrDetails) {
    let branchDetails = {
      id: lrDetails.branch_id,
      name: lrDetails.branch_name,
      lr_number: null,
      is_constcenterallow: false
    }
    console.log("branchDetails", branchDetails);


  }
  setlrParticulars(particularDetails) {

  }

  addField(index) {

  }
  addFoField() {

  }

  getAllFieldName() {

  }

  getUnit() {

  }

  getWeightUnitId(type, index) {

  }

  takeActionSource(type, res, i) {
    console.log("here", type, res, i, "this.oddArray", this.oddArray, "this.evenArray", this.evenArray);
    setTimeout(() => {
      if (type == 'oddArray') {
        this.oddArray[i].r_value = this.oddArray[i].r_value ? this.oddArray[i].r_value : '-------';
        if (this.keepGoing && this.oddArray[i].r_value.length) {
          this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

          const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
          this.keepGoing = false;
          activeModal.result.then(res => {
            this.keepGoing = true;
            if (res && res.location.lat) {
              console.log('response----', res.location);
              this.oddArray[i].r_value = res.location.name;
              this.oddArray[i].r_id = res.id;
              this.keepGoing = true;
            }
          })
        }
      }
      else if (type == 'evenArray') {
        this.evenArray[i].r_value = this.evenArray[i].r_value ? this.evenArray[i].r_value : '-------';
        if (this.keepGoing && this.evenArray[i].r_value.length) {
          this.common.params = { placeholder: 'selectLocation', title: 'SelectLocation' };

          const activeModal = this.modalService.open(LocationSelectionComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
          this.keepGoing = false;
          activeModal.result.then(res => {
            this.keepGoing = true;
            if (res && res.location.lat) {
              console.log('response----', res.location);
              this.evenArray[i].r_value = res.location.name;
              this.evenArray[i].r_id = res.id;
              this.keepGoing = true;
            }
          })
        }
      }
    }, 1000);

  }

  onChangeAuto(search, type) {

  }

  formatArray() {
    this.evenArray = [];
    this.oddArray = [];
    this.lrGeneralField.map(dd => {
      if (dd.r_coltype == 3) {
        dd.r_value = dd.r_value ? new Date(dd.r_value) : new Date();
        console.log("date==", dd.r_value);
      }
      if (dd.r_colorder % 2 == 0) {
        this.evenArray.push(dd);
      } else {
        this.oddArray.push(dd);
      }
    });
    console.log("evenArray", this.evenArray);
    console.log("oddArray", this.oddArray);
  }
}