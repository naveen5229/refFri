import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { AccountService } from '../../../services/account.service';
import { AddConsigneeComponent } from '../../LRModals/add-consignee/add-consignee.component';

@Component({
  selector: 'freight-invoice',
  templateUrl: './freight-invoice.component.html',
  styleUrls: ['./freight-invoice.component.scss', '../../../pages/pages.component.css']
})
export class FreightInvoiceComponent implements OnInit {
  freightInvoice = {
    branchId: null,
    company: null,
    invoiceNo: null,
    date: new Date(),
    companyAddress: null,
    companyName: null,
    companyId: null,
    remark: null,


  };


  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService,
    public accountService: AccountService) {
    if (this.accountService.selected.branch.id) {
      this.getBranchDetails();
    }
    this.common.handleModalSize('class', 'modal-lg', '800');

  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }
  getBranchDetails() {
    this.api.get('LorryReceiptsOperation/getBranchDetilsforLr?branchId=' + this.accountService.selected.branch.id)
      .subscribe(res => {
        console.log("branchdetails", res['data'][0]);
        this.setBranchDetails(res['data'][0]);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  setBranchDetails(lrDetails) {

  }
  getConsignorDetail(consignor) {
    console.log("consignor", consignor);
    this.freightInvoice.companyAddress = consignor.address;
    this.freightInvoice.companyName = consignor.name;
    this.freightInvoice.companyId = consignor.id;
  }

  saveInvoice() {
    ++this.common.loading;
    let params = {
      branchId: this.accountService.selected.branch.id,
      partyId: this.freightInvoice.companyId,
      invoiceNo: this.freightInvoice.invoiceNo,
      invoiceDate: this.common.dateFormatter(this.freightInvoice.date).split(' ')[0],
      remarks: this.freightInvoice.remark,
    };
    this.api.post("FrieghtRate/saveInvoices", params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          this.activeModal.close({ data: true });
        }
        else {
          this.common.showError(res['data'][0].y_msg);

        }
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });

  }



}
