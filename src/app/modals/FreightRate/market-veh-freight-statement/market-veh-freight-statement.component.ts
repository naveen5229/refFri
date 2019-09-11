import { Component, OnInit } from '@angular/core';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { AccountService } from '../../../services/account.service';
import { AddConsigneeComponent } from '../../LRModals/add-consignee/add-consignee.component';
import { MvsLrAssignComponent } from '../mvs-lr-assign/mvs-lr-assign.component';

@Component({
  selector: 'market-veh-freight-statement',
  templateUrl: './market-veh-freight-statement.component.html',
  styleUrls: ['./market-veh-freight-statement.component.scss']
})
export class MarketVehFreightStatementComponent implements OnInit {

  showhide = {
    show: true
  }

  state = false;
  mvsFreight = {
    branchId: null,
    branchName: null,
    company: null,
    invoiceNo: null,
    date: new Date(),
    companyAddress: null,
    companyName: null,
    companyId: null,
    remark: null,
    id: null,
  };
  btnTxt = "Save & Select LR";

  constructor(public modalService: NgbModal,
    public common: CommonService,
    public activeModal: NgbActiveModal,
    public api: ApiService,
    public accountService: AccountService) {
    if (this.accountService.selected.branch.id) {
      this.getBranchDetails();
    }
    this.common.handleModalSize('class', 'modal-lg', '800');
    console.log("Branches", this.accountService.branches);
    if (this.common.params.title == 'Edit') {
      this.showhide.show = false;

      console.log("branchId:", this.common.params.freightInvoice._branch_id);
      this.btnTxt = "Update Invoice"
      this.mvsFreight.branchId = this.common.params.freightInvoice._branch_id;
      this.mvsFreight.branchName = this.common.params.freightInvoice['Branch Name'];
      this.mvsFreight.companyId = this.common.params.freightInvoice._party_id;
      this.mvsFreight.companyName = this.common.params.freightInvoice['Party Name'];
      this.mvsFreight.invoiceNo = this.common.params.freightInvoice['Invoice No'];
      this.mvsFreight.date = new Date(this.common.params.freightInvoice._inv_date);
      this.mvsFreight.remark = this.common.params.freightInvoice._remarks;
      this.mvsFreight.id = this.common.params.freightInvoice._id ? this.common.params.freightInvoice._id : null;
    }
  }

  ngOnInit() {
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
    this.mvsFreight.companyAddress = consignor.address;
    this.mvsFreight.companyName = consignor.name;
    this.mvsFreight.companyId = consignor.id;
  }

  closeModal() {
    this.activeModal.close();
  }

  saveInvoice() {

    let params = {
      branchId: this.mvsFreight.branchId,
      partyId: this.mvsFreight.companyId,
      invoiceNo: this.mvsFreight.invoiceNo,
      invoiceDate: this.common.dateFormatter(this.mvsFreight.date).split(' ')[0],
      id: this.mvsFreight.id ? this.mvsFreight.id : null,
      remarks: this.mvsFreight.remark,
    };
    ++this.common.loading;
    this.api.post("FrieghtRate/saveMVSFreightInvoices", params)
      .subscribe(res => {
        --this.common.loading;
        console.log(res['data'][0].result);
        if (res['data'][0].y_id > 0) {
          this.common.showToast(res['data'][0].y_msg);
          if (this.btnTxt != 'Update Invoice') {
            this.lrAssign(res['data'][0].y_id);
          }
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

  lrAssign(id) {
    let row = {
      _branch_id: this.mvsFreight.branchId,
      _party_id: this.mvsFreight.companyId,
      _id: id
    }
    console.log('Date:', row);

    this.common.handleModalSize('class', 'modal-lg', '800');
    this.common.params = { row: row };
    const activeModal = this.modalService.open(MvsLrAssignComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', });
    activeModal.result.then(data => {
      console.log('Date:', data);

    });
  }


}
