import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountsComponent } from '../accounts/accounts.component';

@Component({
  selector: 'ledgeraddress',
  templateUrl: './ledgeraddress.component.html',
  styleUrls: ['./ledgeraddress.component.scss']
})
export class LedgeraddressComponent implements OnInit {
  address='';
  accDetails=[];
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal,
    public api: ApiService) {
      this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 0);

      if (this.common.params) {
        console.log("After the modal Open:", this.common.params);
  
        this.accDetails = this.common.params.addressdata;
      
      }

     }

  ngOnInit() {
  }

  dismiss(response) {
    console.log('Accounts address:', this.address);
    // console.log('Accounts:', response);
    this.activeModal.close({ response: response,adddata:this.address});
    // this.activeModal.close({ ledger: this.Accounts });
  }

}
