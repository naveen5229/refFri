import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFreightExpensesComponent } from '../FreightRate/add-freight-expenses/add-freight-expenses.component';
import { AddFreightRevenueComponent } from '../FreightRate/add-freight-revenue/add-freight-revenue.component';
@Component({
  selector: 'voucher-type-get',
  templateUrl: './voucher-type-get.component.html',
  styleUrls: ['./voucher-type-get.component.scss']
})
export class VoucherTypeGetComponent implements OnInit {
  FoName = null;
  RegList = [];
  vehRegistrationNo = null;
  voucherList = [];
  voucherID = null;
  rowId = null;
  voucherType = null;
  title = '';
  images = [];
  activeImage = '';
  vehId = null;
  docId = null;
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
  }]
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

    if (this.common.params.VoucherDetails) {
      this.FoName = this.common.params.VoucherDetails['Fo Name'];
      this.vehRegistrationNo = this.common.params.VoucherDetails.Regno;
      this.rowId = this.common.params.VoucherDetails._id;
      this.voucherType = this.common.params.VoucherDetails.Type;
      this.voucherID = this.common.params.VoucherDetails._type_id;
      this.vehId = this.common.params.VoucherDetails._vehicle_id;
      this.docId = this.common.params.VoucherDetails._doc_id;
      console.log('regno', this.vehRegistrationNo);
    }
    this.getdocImages();
    if (this.common.params.state == 1) {
      this.modaltype = 1;
    }
    if (this.common.params.state == 2) {
      this.modaltype = null;
    }
    this.getItems();
  }

  ngOnInit() {
  }

  getvehicleData(Regno) {
    this.vehRegistrationNo = Regno.regno;
    this.vehId = Regno.id;

  }
  closeModal() {
    this.activeModal.close({ response: true });
  }
  getItems() {
    const params = {

    }

    this.common.loading++;
    this.api.post('Suggestion/getExpensesVoucherTypeList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("items", res);
        this.voucherList = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  changeRefernceType(voucherList) {
    this.voucherID = voucherList.id;

  }
  UpdateVoucher() {
    const params = {
      rowId: this.rowId,
      typeId: this.voucherID,
      vehicleId: this.vehId
    }

    this.common.loading++;
    this.api.post('UploadedVouchers/updateVoucherDetails', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['code'] == '1') {
          this.common.showToast(res['msg']);
          this.closeModal();
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
  getdocImages() {
    const params = "docId=" + this.docId;
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

  changeRefernce(event) {
    this.referenceId = event.id;
  }
  getSelection() {
    console.log(this.refId);
    this.selectedlist(this.refId);
  }
  selectedlist(refId) {

    if (refId == 11) {
      console.log('refid', this.refId);
      const params = {
        vid: this.vehId,
        regno: this.vehRegistrationNo,
      };
      console.log("Lr", params);
      this.api.post('Suggestion/getLorryReceipts', params)
        .subscribe(res => {
          this.refdata = res['data'];
          console.log('Activity Api Response:', res)
        },
          err => console.error('Activity Api Error:', err));
    }
    if (refId == 12) {

      const params = {
        vid: this.vehId,
        regno: this.vehRegistrationNo,
      };
      console.log("manifest", params);
      this.api.post('Suggestion/getLorryManifest', params)
        .subscribe(res => {
          this.refdata = res['data'];
        },
          err => console.error('Activity Api Error:', err));
    }
    if (refId == 14) {

      const params = {
        vid: this.vehId,

      };
      console.log("manifest", params);
      this.api.post('Suggestion/getVehicleTrips', params)
        .subscribe(res => {
          this.refdata = res['data'];
        },
          err => console.error('Activity Api Error:', err));
    }
  }
  UploadVoucher() {
    const params = {
      vehId: this.vehId,
      regNo: this.vehRegistrationNo,
      refType: this.refId,
      refId: this.referenceId,
      docId: this.docId,
      voucherType: this.voucherID,
      rowId: this.rowId
    }
    let expenseData = {
      _ref_id: this.referenceId,
      _ref_type: this.refId,
      _remark: 'Mapped',
      index: 1,
    }

    this.common.loading++;
    this.api.post('UploadedVouchers/docMappingWrtVoucherType', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['code'] == '1' && this.voucherID == '-152') {
          this.common.showToast(res['msg']);
          const params = "docId=" + this.docId;

          this.common.loading++;
          this.api.get('UploadedVouchers/getImageWrtDocId?' + params)
            .subscribe(res => {
              this.common.loading--;
              this.common.params = { expenseData: expenseData };

              this.common.handleModalSize("class", "modal-lg", "1500", "px", 1);

              const activeModal = this.modalService.open(AddFreightExpensesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });

            }, err => {
              this.common.loading--;
              console.log(err);
            });

        }
        else if (res['code'] == '1' && this.voucherID == '-153') {
          this.common.showToast(res['msg']);
          const params = "docId=" + this.docId;

          this.common.loading++;
          this.api.get('UploadedVouchers/getImageWrtDocId?' + params)
            .subscribe(res => {
              this.common.loading--;
              this.common.params = { images: res['data'] };
              const activeModal = this.modalService.open(AddFreightRevenueComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })

            }, err => {
              this.common.loading--;
              console.log(err);
            });
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
