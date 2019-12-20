import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';
import { UserService } from '../../@core/data/users.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'ledgerapprove',
  templateUrl: './ledgerapprove.component.html',
  styleUrls: ['./ledgerapprove.component.scss']
})
export class LedgerapproveComponent implements OnInit {
  Ledgers = [];
  selectedName = '';
  deletedId = 0;
  pageName="";
  sizeledger=0;
  constructor(private activeModal :NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public router: Router,
    public modalService: NgbModal) {
    this.common.refresh = this.refresh.bind(this);


    this.route.params.subscribe(params => {
      console.log('Params1: ', params);
      if (params.id) {
        this.deletedId = parseInt(params.id);
        this.GetLedger(4);
      }
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    });
    if(this.common.params && this.common.params.pageName){
      this.pageName=this.common.params.pageName;
      this.deletedId = 0;
        this.GetLedger(4);
        this.sizeledger=1;
  }
  this.GetLedger(4);
    this.common.currentPage =  'Ledger Pending For Approval';
    this.common.handleModalSize('class', 'modal-lg', '1250','px',0);

  }

  ngOnInit() {
  }
  refresh() {
    console.log('ledger approve test');
    this.GetLedger(4);
  }
  GetLedger(id) {
    let params = {
      foid: 123,
      deleted: id
    };
    console.log('approve ledger',params);

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

  updateLedgerCostCenter(checkvalue, id) {
    let params = {
      ledgerid: id,
      ladgervalue: checkvalue.target.checked
    };
    console.log('ledger data', checkvalue.target.checked, id);
    // console.log('ledger data1', checkvalue, id);
    this.common.loading++;
    this.api.post('Accounts/SaveLedgerCostCenter', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        // this.Ledgers = res['data'];
        this.common.showToast(res['data'][0].y_errormsg);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }


  selectedRow = -1;

  openModal(ledger?) {
    let data = [];
    console.log('ledger123', ledger);
    if (ledger) {
      let params = {
        id: ledger.id,
        foid: ledger.foid,
      }
      this.common.loading++;
      this.api.post('Accounts/EditLedgerdata', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('Res:', res['data']);
          data = res['data'];
          this.common.params = {
            ledgerdata: res['data'],
            deleted: this.deletedId,
        sizeledger:this.sizeledger
          }
          // this.common.params = { data, title: 'Edit Ledgers Data' };
          const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
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
      this.common.params = null;
      const activeModal = this.modalService.open(LedgerComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
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
      branchname: ledger.branchname,
      branchcode: ledger.branchcode,
      accnumber: ledger.accnumber,
      creditdays: ledger.creditdays,
      openingbalance: ledger.openingbalance,
      isdr: ledger.openingisdr,
      approved: ledger.approved,
      deleteview: ledger.deleteview,
      delete: ledger.delete,
      x_id: ledger.id ? ledger.id : 0,
      bankname: ledger.bankname,
      costcenter: ledger.costcenter,
      taxtype:ledger.taxtype,
      taxsubtype:ledger.taxsubtype
    };

    console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Accounts/InsertLedger', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
       // this.GetLedger();
        if (res['data'][0].y_errormsg) {
          this.common.showToast(res['data'][0].y_errormsg);
        } else {
          this.common.showToast('Ledger Has been saved!');
        }
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

  modelCondition() {
    this.activeModal.close({ });
    event.preventDefault();
    return;
  }
  approveDeleteFunction(type, typeans,xid) {
    console.log('type',type,'typeans',typeans,'xid',xid);
    let params = {
      id: xid,
      flagname: (type == 1) ? 'deleted' : 'forapproved',
      flagvalue: typeans
    };
    this.common.loading++;
    this.api.post('Company/ledgerDeleteApprooved', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        //this.getStockItems();
        this.activeModal.close({ response: true });
        if (type == 1 && typeans == 'true') {
          this.common.showToast(" This Value Has been Deleted!");
        } else if (type == 1 && typeans == 'false') {
          this.common.showToast(" This Value Has been Restored!");
        } else {
          this.common.showToast(" This Value Has been Approved!");
          this.GetLedger(4);
        }
      //  this.GetLedger();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError('This Value has been used another entry!');
      });
  }
}