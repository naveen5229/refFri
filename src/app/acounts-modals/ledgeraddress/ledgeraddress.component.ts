import { Component, OnInit, HostListener } from '@angular/core';
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
  address = '';
  accDetails = [];
  selectedRow = 0;
  selectedName = '';
  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event) {
    this.keyHandler(event);
  }

  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal,
    public api: ApiService) {
    this.common.handleModalSize('class', 'modal-lg', '1250', 'px', 0);

    if (this.common.params) {
      console.log("After the modal Open:", this.common.params);

      this.accDetails = this.common.params.addressdata;
      this.accDetails.map((addDetail)=>{
          if(addDetail.is_default){
            this.address = addDetail.address;
          }
      })


    }

  }

  ngOnInit() {
  }

  keyHandler(event) {
    const key = event.key.toLowerCase();
    if ((key.includes('arrowup') || key.includes('arrowdown')) && this.accDetails.length) {
      // console.log('-Jai rana---');
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.accDetails.length - 1) this.selectedRow++;
      this.address = this.accDetails[this.selectedRow].address;
    }
  }

  dismiss(response) {
    console.log('Accounts address:', this.address);
    // console.log('Accounts:', response);
    
    this.activeModal.close({ response: response, adddata:this.address.split("@")[0],addressid:this.address.split("@")[1] });
    // this.activeModal.close({ ledger: this.Accounts });
  }

  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }
}
