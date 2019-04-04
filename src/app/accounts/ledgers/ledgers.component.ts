import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';
import { UserService } from '../../@core/data/users.service';
@Component({
  selector: 'ledgers',
  templateUrl: './ledgers.component.html',
  styleUrls: ['./ledgers.component.scss']
})
export class LedgersComponent implements OnInit {
  Ledgers = [];
  selectedName = '';
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
  selectedRow = -1;

  openModal(ledger?) {
    let data =[];
    console.log('ledger123', ledger);
    if (ledger) {
      let params = {
        id: ledger.id,
        foid: ledger.foid
      }
      this.common.loading++;
      this.api.post('Accounts/EditLedgerdata', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('Res:', res['data']);
          data = res['data'];
          this.common.params = res['data'];
          // this.common.params = { data, title: 'Edit Ledgers Data' };
          const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass : "accountModalClass" });
          activeModal.result.then(data => {
            // console.log('Data: ', data);
            if (data.response) {
              this.addLedger(data.ledger);
            }
          });

        }, err => {
          this.common.loading--;
          console.log('Error: ', err);
          this.common.showError();
        });
    }

    else {
      this.common.params=null;
      const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false });
      activeModal.result.then(data => {
        // console.log('Data: ', data);
        if (data.response) {
          this.addLedger(data.ledger);
        }
      });
    }
  }

  addLedger(ledger) {
    console.log('ledgerdata', ledger);
    // const params ='';
    const params = {
      name: ledger.name,
      alias_name: ledger.aliasname,
      code: ledger.code,
      foid: ledger.user.id,
      per_rate: ledger.perrate,
      primarygroupid: ledger.undergroup.primarygroup_id,
      account_id: ledger.undergroup.id,
      accDetails: ledger.accDetails,
      x_id: ledger.id ? ledger.id: 0,
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Accounts/InsertLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        this.GetLedger();
        this.common.showToast('Ledger Has been saved!');
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  
  RowSelected(u: any) {
    console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }


}
