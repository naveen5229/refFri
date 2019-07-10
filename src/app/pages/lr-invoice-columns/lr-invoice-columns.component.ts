import { Component, OnInit } from '@angular/core';
import { AddConsigneeComponent } from '../../modals/LRModals/add-consignee/add-consignee.component';
import { CommonService } from '../../services/common.service';
import { AccountService } from '../../services/account.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lr-invoice-columns',
  templateUrl: './lr-invoice-columns.component.html',
  styleUrls: ['./lr-invoice-columns.component.scss']
})
export class LrInvoiceColumnsComponent implements OnInit {
  party = {
    name: null,
    id: null,
    address: null
  }
  doctype=null;
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
        this.common.loading--;
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

}
