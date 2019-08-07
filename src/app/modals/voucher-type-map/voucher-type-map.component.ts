import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'voucher-type-map',
  templateUrl: './voucher-type-map.component.html',
  styleUrls: ['./voucher-type-map.component.scss']
})
export class VoucherTypeMapComponent implements OnInit {
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
  vid = null;
  regno = null;
  voucherType = null;
  referenceId = null;
  documentId = null;
  rowId = null;
  voucherId = null;
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    this.vid = this.common.params.VoucherDetails._vehicle_id;
    this.regno = this.common.params.VoucherDetails.Regno;
    this.voucherType = this.common.params.VoucherDetails.Type;
    this.documentId = this.common.params.VoucherDetails._doc_id;
    this.rowId = this.common.params.VoucherDetails._id;
    this.voucherId = this.common.params.VoucherDetails._type_id;
    console.log('vid:', this.vid);
    this.selectedlist(this.refId);
    console.log(this.refId);
  }

  ngOnInit() {
  }
  getSelection() {
    console.log(this.refId);
    this.selectedlist(this.refId);
  }
  selectedlist(refId) {

    if (refId == 11) {
      console.log('refid', this.refId);
      const params = {
        vid: this.vid,
        regno: this.regno,
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
        vid: this.vid,
        regno: this.regno,
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
        vid: this.vid,

      };
      console.log("manifest", params);
      this.api.post('Suggestion/getVehicleTrips', params)
        .subscribe(res => {
          this.refdata = res['data'];
        },
          err => console.error('Activity Api Error:', err));
    }
  }
  changeRefernceType(event) {
    this.referenceId = event.id;

  }
  closeModal() {
    this.activeModal.close();
  }
  UploadVoucher() {
    const params = {
      vehId: this.vid,
      regNo: this.regno,
      refType: this.refId,
      refId: this.referenceId,
      docId: this.documentId,
      voucherType: this.voucherId,
      rowId: this.rowId
    }

    this.common.loading++;
    this.api.post('UploadedVouchers/docMappingWrtVoucherType', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['code'] == '1') {
          this.common.showToast(res['msg']);

        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
