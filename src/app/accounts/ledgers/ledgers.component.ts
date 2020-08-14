import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { LedgerComponent } from '../../acounts-modals/ledger/ledger.component';
import { UserService } from '../../@core/data/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import * as localforage from 'localforage';

@Component({
  selector: 'ledgers',
  templateUrl: './ledgers.component.html',
  styleUrls: ['./ledgers.component.scss']
})
export class LedgersComponent implements OnInit {
  Ledgers = [];
  selectedName = '';
  deletedId = 0;
  pageName="";
  sizeledger=0;
  pages = {
    count: 0,
    active: 1,
    limit: 1000,
  };
  data = [];
  jrxPageTimer: any;
  filters = [
    { name: 'Under Group', key: 'groupname', search: '' },
    { name: 'Name', key: 'name', search: '' },
    { name: 'Alias Name', key: 'alias_name', search: '' },
    { name: 'Cost Center Allow', key: 'is_constcenterallow', search: '' },
    { name: 'Date', key: 'entry_dt', search: '' },
  ];
  jrxTimeout: any;
  searchedData = [];
  constructor(private activeModal :NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public router: Router,
    public modalService: NgbModal,
    public accountService: AccountService,) {
    this.common.refresh = this.refresh.bind(this);

    localforage.getItem('ledgers_data')
      .then((dayBookData: any) => {
        if (dayBookData) {
          this.Ledgers = dayBookData;
          this.filterData();
        }
      });

    this.route.params.subscribe(params => {
     // console.log('Params1: ', params);
      if (params.id) {
        this.deletedId = parseInt(params.id);
        this.GetLedger();
      }
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    });
    if(this.common.params && this.common.params.pageName){
      this.pageName=this.common.params.pageName;
      this.deletedId = 0;
        this.GetLedger();
        this.sizeledger=1;
  }
    this.common.currentPage = (this.deletedId == 2) ? 'Cost Category Ledger' : 'Ledger';
    this.common.handleModalSize('class', 'modal-lg', '1250','px',0);

  }

  ngOnInit() {
  }
  refresh() {
    this.GetLedger();
  }
  GetLedger() {
    let params = {
      foid: 123,
      deleted: this.deletedId
    };
//console.log('deleted ledger and simple',params);
    this.common.loading++;
    this.api.post('Accounts/GetLedgerdata', params)
      .subscribe(res => {
        this.common.loading--;
        //console.log('Res:', res['data']);
        this.Ledgers = res['data'];
      //  this.data = res['data'];
       this.filterData();
        if (this.Ledgers.length) {
          document.activeElement['blur']();
          this.selectedRow = 0;
        }
      }, err => {
        this.common.loading--;
       // console.log('Error: ', err);
        this.common.showError();
      });

  }

  
  filterData() {
   
    this.pages.count = Math.floor(this.Ledgers.length / this.pages.limit);
    if (this.Ledgers.length % this.pages.limit) {
      this.pages.count++;
    }
    console.log('length calculate ---',this.Ledgers.length,this.pages.count);
    localforage.setItem('ledgers_data', this.Ledgers);
    this.jrxPagination(this.pages.active < this.pages.count ? this.pages.active : this.pages.count);
  }
  jrxPagination(page, data?) {
    this.pages.active = page;
    let startIndex = this.pages.limit * (this.pages.active - 1);
    let lastIndex = (this.pages.limit * this.pages.active);
    this.data = data ? data.slice(startIndex, lastIndex) : this.searchedData.length ? this.searchedData.slice(startIndex, lastIndex) : this.Ledgers.slice(startIndex, lastIndex);
  }
  
  jrxPageLimitReset() {
    this.jrxPageTimer = setTimeout(() => {
      if (typeof this.pages.limit === 'string') {
        this.pages.limit = parseInt(this.pages.limit) || 0;
      }

      if (!this.pages.limit || this.pages.limit < 100) {
        this.pages.limit = this.accountService.perPage;
        this.common.showError('Minimum per page limit 100');
        return;
      }

      this.pages.count = Math.floor(this.Ledgers.length / this.pages.limit);
      if (this.Ledgers.length % this.pages.limit) {
        this.pages.count++;
      }

      this.accountService.perPage = this.pages.limit;
      localStorage.setItem('per_page', this.accountService.perPage.toString());
      this.jrxPagination(this.pages.active < this.pages.count ? this.pages.active : this.pages.count);
    }, 500);
  }

  jrxSearch(filter) {
    clearTimeout(this.jrxTimeout);
    this.jrxTimeout = setTimeout(() => {
      this.searchedData = [];
      if (filter.search) {
        for (let i = 0; i < this.Ledgers.length; i++) {
          if (this.Ledgers[i][filter.key]) {
            if ((filter.key === 'y_date' && this.common.changeDateformat(this.Ledgers[i][filter.key], 'dd-MMM-yy').toLowerCase().includes(filter.search.toLowerCase())) || this.Ledgers[i][filter.key].toLowerCase().includes(filter.search.toLowerCase())) {
              this.searchedData.push(this.Ledgers[i]);
            }
          }
        }

        this.pages.count = Math.floor(this.searchedData.length / this.pages.limit);
        if (this.Ledgers.length % this.pages.limit) this.pages.count++;
        this.jrxPagination(this.pages.active < this.pages.count ? this.pages.active : this.pages.count, this.searchedData);

      } else {
        this.searchedData = [];
        this.pages.count = Math.floor(this.Ledgers.length / this.pages.limit);
        if (this.Ledgers.length % this.pages.limit) this.pages.count++;
        this.jrxPagination(this.pages.active < this.pages.count ? this.pages.active : this.pages.count);
      }

    }, 500);
  }
  updateLedgerCostCenter(checkvalue, id) {
    let params = {
      ledgerid: id,
      ladgervalue: checkvalue.target.checked
    };
    //console.log('ledger data', checkvalue.target.checked, id);
    // console.log('ledger data1', checkvalue, id);
    this.common.loading++;
    this.api.post('Accounts/SaveLedgerCostCenter', params)
      .subscribe(res => {
        this.common.loading--;
      //  console.log('Res:', res['data']);
        // this.Ledgers = res['data'];
        this.common.showToast(res['data'][0].y_errormsg);

      }, err => {
        this.common.loading--;
       // console.log('Error: ', err);
        this.common.showError();
      });

  }


  selectedRow = -1;

  openModal(ledger?) {
    let data = [];
   // console.log('ledger123', ledger);
    if (ledger) {
      let params = {
        id: ledger.id,
        foid: ledger.foid,
      }
      this.common.loading++;
      this.api.post('Accounts/EditLedgerdata', params)
        .subscribe(res => {
          this.common.loading--;
         // console.log('Res:', res['data']);
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
            if (data.ledger) {
              this.addLedger(data.ledger);
            }else{
              this.GetLedger();
            }
            }
          });

        }, err => {
          this.common.loading--;
         // console.log('Error: ', err);
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
   // console.log('ledgerdata', ledger);
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
      taxsubtype:ledger.taxsubtype,
      isnon:ledger.isnon,
      hsnno:ledger.hsnno,
      hsndetail:ledger.hsndetail,
      gst:ledger.gst,
      cess:ledger.cess,
      igst:ledger.igst,
      taxability:ledger.taxability,
      calculationtype:ledger.calculationtype,
    };

   // console.log('params11: ', params);
    this.common.loading++;

    this.api.post('Accounts/InsertLedger', params)
      .subscribe(res => {
        this.common.loading--;
       // console.log('res: ', res);
        this.GetLedger();
        if (res['data'][0].y_errormsg) {
          this.common.showToast(res['data'][0].y_errormsg);
        } else {
          this.common.showToast('Ledger Has been saved!');
        }
      }, err => {
        this.common.loading--;
       // console.log('Error: ', err);
        this.common.showError();
      });

  }


  RowSelected(u: any) {
  //  console.log('data of u', u);
    this.selectedName = u;   // declare variable in component.
  }

  modelCondition() {
    this.activeModal.close({ });
    event.preventDefault();
    return;
  }
}
