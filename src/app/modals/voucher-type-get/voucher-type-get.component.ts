import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
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


  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal, ) {
    if (this.common.params.VoucherDetails) {
      this.FoName = this.common.params.VoucherDetails['Fo Name'];
      this.vehRegistrationNo = this.common.params.VoucherDetails.Regno;
      this.rowId = this.common.params.VoucherDetails._id;
      this.voucherType = { name: this.common.params.VoucherDetails.Type };
      this.voucherID = this.common.params.VoucherDetails._type_id;
      this.vehId = this.common.params.VoucherDetails._vehicle_id;
      this.docId = this.common.params.VoucherDetails._doc_id;
      console.log('regno', this.vehRegistrationNo);
    }


    this.getItems();
    this.getdocImages();

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
}
