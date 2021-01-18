import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFreightExpensesComponent } from '../FreightRate/add-freight-expenses/add-freight-expenses.component';
import { AddFreightRevenueComponent } from '../FreightRate/add-freight-revenue/add-freight-revenue.component';
import { BeehiveComponent } from '../../admin/beehive/beehive.component';
import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'voucher-type-get',
  templateUrl: './voucher-type-get.component.html',
  styleUrls: ['./voucher-type-get.component.scss']
})
export class VoucherTypeGetComponent implements OnInit {
  voucher = {
    FoName: null,
    vehRegistrationNo: null,
    voucherID: null,
    rowId: null,
    voucherType: null,
    vehId: null,
    docId: null,
    vehicleTypes: 0,
  }
  voucherList = [];
  title = '';
  images = [];
  RegList = [];
  activeImage = '';


  refDetails = [{
    name: 'LR',
    id: '11'
  },
  {
    name: 'Trip',
    id: '14'
  },
  {
    name: 'Manifest',
    id: '12'
  }];

  vehicleType = [{
    id: '0',
    name: 'Own'
  },
  {
    id: '1',
    name: 'Market'
  }];
  refId = null;
  refdata = [];
  referenceId = null;
  modaltype = null;

  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal, ) {
    this.common.handleModalSize("class", "modal-lg", "1100", "px", 0);
    console.log("voucher Value:", this.common.params.voucher);

    if (this.common.params.voucher) {
      this.voucher.FoName = this.common.params.voucher['Fo Name'];
      this.voucher.vehRegistrationNo = this.common.params.voucher.Regno;
      this.voucher.rowId = this.common.params.voucher._id;
      this.voucher.voucherType = this.common.params.voucher.Type;
      this.voucher.voucherID = this.common.params.voucher._type_id;
      this.voucher.vehId = this.common.params.voucher._vehicle_id;
      this.voucher.docId = this.common.params.voucher._doc_id;

    }

    this.getdocImages();
    if (this.common.params.modalType == 1) {
      this.modaltype = 1;
    }
    if (this.common.params.modalType == 2) {
      this.modaltype = null;
    }

    this.getItems();
  }

  ngOnDestroy(){}
ngOnInit() {
  }

  closeModal() {
    this.activeModal.close({ response: true });
  }
  handleVehicleTypeChange() {
    console.log("vehicle type", this.voucher.vehicleTypes);

    this.voucher.vehRegistrationNo = null;
    this.voucher.vehId = null;
    document.getElementById('vehicleId')['value'] = '';
  }

  getItems() {
    this.common.loading++;
    this.api.post('Suggestion/getExpensesVoucherTypeList', {})
      .subscribe(res => {
        this.common.loading--;
        console.log("items", res);
        this.voucherList = res['data'] || [];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getdocImages() {
    const params = "docId=" + this.voucher.docId;
    this.common.loading++;
    this.api.get('UploadedVouchers/getImageWrtDocId?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.images = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  selectedVehicle(Regno) {
    this.voucher.vehRegistrationNo = Regno.regno;
    this.voucher.vehId = Regno.id;
  }

  changeRefernceType(voucherList) {
    this.voucher.voucherID = voucherList.id;
  }

  UpdateVoucher() {
    let params = {
      rowId: this.voucher.rowId,
      typeId: this.voucher.voucherID,
      vehicleId: this.voucher.vehId,
      regNo: this.voucher.vehRegistrationNo,
    }
    console.log("params", params);

    this.common.loading++;
    this.api.post('UploadedVouchers/updateVoucherDetails', params)
      .subscribe(res => {
        this.common.loading--;
        this.common.showToast(res['msg']);
        if (res['code'] == '1') {
          this.closeModal();
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  onSelectedRefernce(event) {
    this.referenceId = event.id;
  }

  getReferenceTypeSelection() {
    this.selectedlist(this.refId);
  }

  selectedlist(refId) {
    const urls = {
      11: 'getLorryReceipts',
      12: 'getLorryManifest',
      14: 'getVehicleTrips'
    };

    let params = { vid: this.voucher.vehId };
    if (refId != 14) params['regno'] = this.voucher.vehRegistrationNo;

    console.log('Params', params);
    this.api.post('Suggestion/' + urls[refId], params)
      .subscribe(res => {
        this.refdata = res['data'];
        console.log('Activity Api Response:', res)
      },
        err => console.error('Activity Api Error:', err));
  }

  uploadVoucher() {
    let params = {
      vehId: this.voucher.vehId,
      regNo: this.voucher.vehRegistrationNo,
      refType: this.refId,
      refId: this.referenceId,
      docId: this.voucher.docId,
      voucherType: this.voucher.voucherID,
      rowId: this.voucher.rowId
    }

    let expenseparam = {
      id: null,
      refId: this.referenceId,
      refernceType: this.refId,
      remarks: null,
    }
    if (this.voucher.voucherID == -7) {
      this.common.params = { reference: "modal" };

      const activeModal = this.modalService.open(BeehiveComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      return;

    }
    console.log("params", params);
    this.common.loading++;
    this.api.post('UploadedVouchers/docMappingWrtVoucherType', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['code'] == '1' && this.voucher.voucherID == '-152') {
          this.common.showToast(res['msg']);
          this.common.params = { expenseData: expenseparam };
          this.common.handleModalSize("class", "modal-lg", "1500", "px", 1);
          this.modalService.open(AddFreightExpensesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        }
        else if (res['code'] == '1' && this.voucher.voucherID == '-153') {
          this.common.showToast(res['msg']);
          const params = "docId=" + this.voucher.docId;
          this.common.params = { revenueData: expenseparam };
          const activeModal = this.modalService.open(AddFreightRevenueComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
        }
        else {
          this.common.showError(res['msg']);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
