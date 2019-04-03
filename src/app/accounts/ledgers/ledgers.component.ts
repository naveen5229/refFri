import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LedgerComponent} from '../../acounts-modals/ledger/ledger.component';
import { UserService } from '../../@core/data/users.service';
@Component({
  selector: 'ledgers',
  templateUrl: './ledgers.component.html',
  styleUrls: ['./ledgers.component.scss']
})
export class LedgersComponent implements OnInit {
  Ledgers =[];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {

      this.GetLedger();
      this.common.currentPage = 'Ledger';
     }

  ngOnInit() {
  }
  GetLedger() {
    let params = {
      foid: 123
    };
    
    this.common.loading++;
    this.api.post('Accounts/GetLedgerdata', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.Ledgers = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  openModal (ledger?) {
     console.log('ledger123',ledger);
       if (ledger) this.common.params = ledger;
       const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' ,keyboard :false});
       activeModal.result.then(data => {
         // console.log('Data: ', data);
         if (data.response) {
          this.addLedger(data.ledger);
         }
       });
     }
     addLedger(ledger) {
      console.log('ledgerdata',ledger);
     // const params ='';
      const params = {
          name: ledger.name,
          alias_name: ledger.aliasname,
          code: ledger.code,
          foid: ledger.user.id,
          per_rate: ledger.perrate,
          primarygroupid: ledger.account.primarygroup_id,
          account_id: ledger.account.id,
          accDetails: ledger.accDetails,
          x_id:0
       };
  
       console.log('params11: ',params);
      this.common.loading++;
  
      this.api.post('Accounts/InsertLedger', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res: ', res);
          this.GetLedger();
        }, err => {
          this.common.loading--;
          console.log('Error: ', err);
          this.common.showError();
        });
  
    }

}
