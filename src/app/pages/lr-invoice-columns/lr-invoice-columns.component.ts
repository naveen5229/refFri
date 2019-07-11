import { Component, OnInit } from '@angular/core';
import { AddConsigneeComponent } from '../../modals/LRModals/add-consignee/add-consignee.component';
import { CommonService } from '../../services/common.service';
import { AccountService } from '../../services/account.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lr-invoice-columns',
  templateUrl: './lr-invoice-columns.component.html',
  styleUrls: ['./lr-invoice-columns.component.scss', "../pages.component.css",]
})
export class LrInvoiceColumnsComponent implements OnInit {
  party = {
    name: null,
    id: null,
    address: null
  }
  docType = 1;
  LrInvoiceColumns = [];
  constructor(
    public common: CommonService,
    public accountService: AccountService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal,
  ) { }

  ngOnInit() {
  }

  getPartyDetail(party) {
    console.log("party", party);
    this.party.address = party.address;
    this.party.name = party.name;
    this.party.id = party.id;
  }

  getBranchDetails() {
    this.api.get('LorryReceiptsOperation/getBranchDetilsforLr?branchId=' + this.accountService.selected.branch.id)
      .subscribe(res => {
        console.log("branchdetails", res['data']);
      }, err => {
        console.log(err);
      });
  }

  addParty() {
    console.log("open material modal")
    const activeModal = this.modalService.open(AddConsigneeComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    activeModal.result.then(data => {
      console.log('Data:', data);

    });
  }

  getLrInvoiceColumns() {
    this.common.loading++;
    let params = {
      branchId: this.accountService.selected.branch.id,
      type: this.docType,
      partyId: this.party.id,
    }
    this.api.post('LorryReceiptsOperation/getLrInvoiceFields', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("getLrInvoiceColumns", res['data']);
        this.LrInvoiceColumns = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  resetData(type) {
    this.party.id = null;
  }


  saveLrInvoiceColumns() {
    this.common.loading++;
    let params = {
      branchId: this.accountService.selected.branch.id,
      type: this.docType,
      partyId: this.party.id,
      lrInvoiceColumns: JSON.stringify(this.LrInvoiceColumns),
    }
    console.log("Params", params)
    this.api.post('LorryReceiptsOperation/saveLrInvoiceFields', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("saveLrInvoiceColumns", res['data'][0].rtn_id);
        if (res['data'][0].rtn_id > 0) {
          this.common.showToast("Successfully Added");
        }
        else {
          this.common.showError("res['data'][0].rtn_msg");
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }
}
