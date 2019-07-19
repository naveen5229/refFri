import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountsComponent } from '../accounts/accounts.component';

@Component({
  selector: 'ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
  lastActiveId = '';
  deletedid = 0;
  showConfirm = false;
  showExit = false;
  salutiondata = [];
  userdata = [];
  currentPage = 'Add Ledger';
  state = [];
  activeId = "user";
  Accounts = {
    name: '',
    aliasname: '',
    perrate: '',
    user: {
      name: '',
      id: ''
    },
    undergroup: {
      name: '',
      id: '',
      primarygroup_id: ''
    },
    id: '',
    code: '',
    branchname: '',
    branchcode: '',
    accnumber: 0,
    creditdays: 0,
    isbank: 0,
    openingisdr: 1,
    openingbalance: 0,
    approved: 1,
    deleteview: 0,
    delete: 0,
    bankname: '',
    costcenter: 0,
    taxsubtype:'',
    taxtype:'',
    accDetails: [{
      id: '',
      salutation: {
        name: 'Not Applicable',
        id: '-1'
      },
      mobileNo: '',
      email: '',
      panNo: '',
      tanNo: '',
      gstNo: '',
      city: {
        name: '',
        id: -1
      },
      address: '',
      remarks: '',
      name: '',
      state: {
        name: '',
        id: ''
      },
      defaultcheck:'true'
    }]
  };
  allowBackspace = true;
  suggestionIndex = -1;



  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal,
    public api: ApiService) {
    console.log('Params requst: ', this.common.params);
    if (this.common.params && this.common.params.ledgerdata) {
      this.currentPage = "Edit Ledger";
      this.deletedid = this.common.params.deleted;
      // console.log('deleted id',this.deletedid);
      // console.log('edit ledger data ', this.common.params.ledgerdata[0]);
      this.Accounts = {
        name: this.common.params.ledgerdata[0].y_name,
        aliasname: this.common.params.ledgerdata[0].y_alias_name,
        perrate: this.common.params.ledgerdata[0].y_per_rate,
        user: {
          name: this.common.params.name,
          id: this.common.params.y_foid
        },
        undergroup: {
          name: this.common.params.ledgerdata[0].accountgroup_name,
          id: this.common.params.ledgerdata[0].y_accountgroup_id,
          primarygroup_id: '0',
        },
        id: this.common.params.ledgerdata[0].y_id,
        code: this.common.params.ledgerdata[0].y_code,
        branchname: this.common.params.ledgerdata[0].branch_name,
        bankname: this.common.params.ledgerdata[0].y_bank_name,
        branchcode: this.common.params.ledgerdata[0].branch_code,
        accnumber: this.common.params.ledgerdata[0].ac_no,
        creditdays: this.common.params.ledgerdata[0].credit_days,
        isbank: (this.common.params.ledgerdata[0].branch_code) ? 1 : 0,
        openingisdr: (this.common.params.ledgerdata[0].opening_bal_isdr == true) ? 1 : 0,
        openingbalance: this.common.params.ledgerdata[0].opening_balance,
        approved: (this.common.params.ledgerdata[0].y_for_approved == true) ? 1 : 0,
        deleteview: (this.common.params.ledgerdata[0].y_del_review == true) ? 1 : 0,
        costcenter: (this.common.params.ledgerdata[0].is_constcenterallow == true) ? 1 : 0,
        delete: 0,
        taxsubtype:this.common.params.ledgerdata[0].y_tax_sub_type,
         taxtype:this.common.params.ledgerdata[0].y_tax_type,
        accDetails: []
      };
      console.log('Accounts: ', this.Accounts);
      this.common.params.ledgerdata.map(detail => {
        this.Accounts.accDetails.push({
          id: detail.y_dtl_id,
          salutation: {
            name: detail.salutation_name,
            id: detail.y_dtl_salutation_id
          },
          mobileNo: detail.y_dtl_mobileno,
          email: detail.y_dtl_email,
          panNo: detail.y_dtl_pan_no,
          tanNo: detail.y_dtl_tan_no,
          gstNo: detail.y_dtl_gst_no,

          city: {
            name: detail.city_name,
            id: detail.y_dtl_city_id
          },
          address: detail.y_dtl_address,
          remarks: detail.y_dtl_remarks,
          name: detail.y_dtl_name,
          state: {
            name: detail.province_name,
            id: detail.province_id
          },
      defaultcheck:detail.y_dtl_is_default

        });
      });
    }

    this.common.handleModalSize('class', 'modal-lg', '1250');
    this.GetSalution();
    // this.getUserData();
    this.getUnderGroup();
    this.GetState();
    this.setFoucus('name');
  }

  handleArrowUpDown(key) {
    const suggestionIDs = this.generateIDs();
    console.log('Key:', key, suggestionIDs, suggestionIDs.indexOf(this.activeId));
    if (suggestionIDs.indexOf(this.activeId) == -1) return;

    if (key == 'arrowdown') {
      if (this.suggestionIndex != this.suggestions.list.length - 1) this.suggestionIndex++;
      else this.suggestionIndex = 0;
    } else {
      if (this.suggestionIndex != 0) this.suggestionIndex--;
      else this.suggestionIndex = this.suggestions.list.length - 1;
    }

    // this.voucher.amountDetails[index].ledger.name = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_name;
    // this.voucher.amountDetails[index].ledger.id = this.ledgers.suggestions[this.activeLedgerIndex].y_ledger_id;
  }

  generateIDs() {
    let IDs = ['undergroup','taxtype','taxsubtype'];
    this.Accounts.accDetails.map((amountDetails, index) => {
      IDs.push('salutation-' + index);
      IDs.push('state-' + index);
      IDs.push('city-' + index);
    });
    return IDs;
  }
  autoSuggestion = {
    data: [],
    targetId: '',
    display: ''
  };


  suggestions = {
    underGroupdata: [],
    supplierLedgers: [],
    state: [],
    salutiondata: [],
    city: [],
    list: [],
    taxtype:[{
      id:'GST',
      name:'GST'
      },{
        id:'Others',
        name:'Others'
        }],
    taxsubtype:[{
      id:'',
      name:'Central tax'},{
        id:'cess',
      name:'Cess'},{
        id:'integrated tax',
      name:'Integrated Tax'},
     {id:'state tax',
      name:'State Tax'
      }]
  };



  addDetails() {
    this.Accounts.accDetails.push({
      id: '',
      salutation: {
        name: 'Not Applicable',
        id: '-1'
      },
      mobileNo: '',
      email: '',
      panNo: '',
      tanNo: '',
      gstNo: '',
      city: {
        name: '',
        id: -1
      },
      address: '',
      remarks: '',
      name: '',
      state: {
        name: '',
        id: ''
      },
      defaultcheck:'false'


    });
  }

  GetSalution() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Suggestion/GetSalutation', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.salutiondata = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  GetState() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Suggestion/GetState', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.state = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  GetCity(stateid) {
    let params = {
      state: stateid
    };

    this.common.loading++;
    this.api.post('Suggestion/GetCity', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.city = res['data'];
        this.autoSuggestion.data = res['data'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  getUnderGroup() {
    let params = {
      search: 123
    };

    this.common.loading++;
    this.api.post('Suggestion/getAllUnderGroupData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.suggestions.underGroupdata = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  getUserData() {
    let params = {
      search: 123
    };

    this.common.loading++;
    this.api.post('Suggestion/getAllfouser', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.userdata = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }
  ngOnInit() {

  }
  dismiss(response) {
    console.log('Accounts:', this.Accounts);
    // console.log('Accounts:', response);
    this.activeModal.close({ response: response, ledger: this.Accounts });
    // this.activeModal.close({ ledger: this.Accounts });
  }

  onSelected(selectedData, type, display) {
    this.Accounts[type].name = selectedData[display];
    this.Accounts[type].id = selectedData.id;
    console.log('Accounts User: ', this.Accounts);
  }
  onParent(selectedData, type, display) {
    this.Accounts[type].name = selectedData[display];
    this.Accounts[type].id = selectedData.id;
    this.Accounts[type].primarygroup_id = selectedData.primarygroup_id;
    console.log('Accounts Parent: ', this.Accounts);
  }
  modelCondition() {
    this.showConfirm = false;
    event.preventDefault();
    return;
  }
  changeevent(value) {
    console.log('vlue ', value);
    this.setFoucus('branchname');
  }

  keyHandler(event) {
    if (event.key == "Escape") {
      this.showExit = true;
    }
    console.log('GGGGGG', event);
    // else if (activeId.includes('isbank') && (activeId.includes('isbank').checked)){ 
    //   this.setFoucus('branchname');
    // }
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('Active Id', activeId);
    console.log('ccc:', (event.altKey && key === 'c'));
    console.log('yyy:', activeId);

    if ((event.altKey && key === 'c') && (activeId.includes('undergroup'))) {
      console.log('alt + C pressed');
      this.openAccountModal();
      return;
    }
    this.setAutoSuggestion();

    if (this.showExit) {
      if (key == 'y' || key == 'enter') {
        this.showExit = false;
        event.preventDefault();
        this.activeModal.close();
        return;
        // this.close();
      } else if (key == 'n') {
        this.showExit = false;
        event.preventDefault();
        return;

      }

    }
    if (this.showConfirm) {
      if (key == 'y' || key == 'enter') {
        console.log('Ledgers show confirm:', this.Accounts);
        this.dismiss(true);
        this.common.showToast('Your Value Has been saved!');
      }
      this.showConfirm = false;
      event.preventDefault();
      return;
    }

    if (key == 'enter') {
      this.allowBackspace = true;
      // console.log('active', activeId);
      // console.log('Active jj: ', activeId.includes('aliasname'));

      if (activeId.includes('branchcode')) {
        this.setFoucus('accnumber');
      } else if (activeId == 'name') {
        this.setFoucus('aliasname');
      } else if (activeId == 'aliasname') {
        this.setFoucus('undergroup');
      } else if (activeId.includes('undergroup')) {
        this.setFoucus('perrate');
      } else if (activeId.includes('perrate')) {
        this.setFoucus('openingbalance');
      } else if (activeId.includes('openingbalance')) {
        this.setFoucus('openingisdr');
      } else if (activeId.includes('openingisdr')) {
        this.setFoucus('creditdays');
      } else if (activeId.includes('branchname')) {
        this.setFoucus('branchcode');
      } else if (activeId.includes('accnumber')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('salutation-0');
      } else if (activeId.includes('isbank') && (this.Accounts.isbank == 0)) {
        this.setFoucus('salutation-0');
      } else if (activeId.includes('isbank') && (this.Accounts.isbank == 1)) {
        this.setFoucus('bankname');
      } else if (activeId.includes('bankname')) {
        this.setFoucus('branchname');
      } else if (activeId.includes('creditdays')) {
        this.setFoucus('costcenter');
      } else if (activeId.includes('costcenter')) {
        this.setFoucus('taxtype');
      } else if (activeId.includes('taxtype')) {
        this.setFoucus('taxsubtype');
      }else if (activeId.includes('taxsubtype')) {
        this.setFoucus('isbank');
      }else if (activeId.includes('salutation-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('accountName-' + index);
      } else if (activeId.includes('accountName-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('mobileno-' + index);
      } else if (activeId.includes('mobileno-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('email-' + index);
      } else if (activeId.includes('email-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('panNo-' + index);
      } else if (activeId.includes('panNo-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('tanNo-' + index);
      } else if (activeId.includes('tanNo-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('gstNo-' + index);
      } else if (activeId.includes('gstNo-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('state-' + index);
      } else if (activeId.includes('state-')) {
        let index = activeId.split('-')[1];
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('city-' + index);
      } else if (activeId.includes('city-')) {
        let index = activeId.split('-')[1];
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('address-' + index);
      } else if (activeId.includes('address-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('remarks-' + index);
      } else if (activeId.includes('remarks-')) {
        let index = activeId.split('-')[1];
        console.log(index);
        if ((this.Accounts.accDetails.length) - 1 == parseInt(index)) { this.showConfirm = true; }

        // this.setFoucus('mobileno-'+index);
      } else {
        console.log('active--', activeId);
      }
    } else if (key == 'backspace' && this.allowBackspace) {
      event.preventDefault();
      console.log('active 1', activeId);

      if (activeId.includes('salutation-')) {
        let index = parseInt(activeId.split('-')[1]);
        if (index != 0) {
          this.setFoucus('remarks-' + (index - 1));
        } else {
          this.setFoucus('isbank');
        }
      } else if (activeId.includes('accountName-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('salutation-' + index);
      } else if (activeId.includes('mobileno-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('accountName-' + index);
      } else if (activeId.includes('email-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('mobileno-' + index);
      } else if (activeId.includes('panNo-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('email-' + index);
      } else if (activeId.includes('tanNo-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('panNo-' + index);
      } else if (activeId.includes('gstNo-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('tanNo-' + index);
      } else if (activeId.includes('city-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('state-' + index);
      } else if (activeId.includes('state-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('gstNo-' + index);
      } else if (activeId.includes('address-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('city-' + index);
      } else if (activeId.includes('remarks-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('address-' + index);
      }
      console.log('active 2', activeId);

      if (activeId == 'accnumber') this.setFoucus('perrate');
      if (activeId == 'creditdays') this.setFoucus('branchcode');
      if (activeId == 'branchcode') this.setFoucus('branchname');
      if (activeId == 'branchname') this.setFoucus('accnumber');
      if (activeId == 'perrate') this.setFoucus('undergroup');
      if (activeId == 'undergroup') this.setFoucus('aliasname');
      if (activeId == 'aliasname') this.setFoucus('name');
      if (activeId == 'name') this.setFoucus('code');
      if (activeId == 'isbank') this.setFoucus('taxsubtype');
      if (activeId == 'taxsubtype') this.setFoucus('taxtype');
      if (activeId == 'taxtype') this.setFoucus('costcenter');

      if (activeId == 'code') {
        console.log('active 3', activeId);
        this.setFoucus('user')
      };
    } else if (key.includes('arrow')) {
      this.allowBackspace = false;
    } else if (key != 'backspace') {
      this.allowBackspace = false;
      //event.preventDefault();
    }
    else if (key == 'Escape') {
      alert('hello');
      //event.preventDefault();
    }
  }

  setFoucus(id, isSetLastActive = true) {
    setTimeout(() => {
      let element = document.getElementById(id);
      console.log('Element: ', element);
      element.focus();
      // this.moveCursor(element, 0, element['value'].length);
      // if (isSetLastActive) this.lastActiveId = id;
      // console.log('last active id: ', this.lastActiveId);
    }, 100);
    this.setAutoSuggestion();
  }
  selectSuggestion(suggestion, id?) {
    console.log('Suggestion: ', suggestion);
    if (this.activeId == 'undergroup') {
      this.Accounts.undergroup.name = suggestion.name;
      this.Accounts.undergroup.id = suggestion.id;
    } else if (this.activeId.includes('salutation-')) {
      const index = parseInt(this.activeId.split('-')[1]);
      this.Accounts.accDetails[index].salutation.id = suggestion.id;

    } else if (this.activeId.includes('state-')) {
      const index = parseInt(this.activeId.split('-')[1]);
      this.Accounts.accDetails[index].state.id = suggestion.id;
      this.GetCity(suggestion.id);
    } else if (this.activeId.includes('city-')) {
      const index = parseInt(this.activeId.split('-')[1]);
      this.Accounts.accDetails[index].city.id = suggestion.id;

    }

  }


  setAutoSuggestion() {
    let activeId = document.activeElement.id;
    console.log('suggestion active', activeId, this.suggestions.underGroupdata);
    if (activeId == 'undergroup') this.autoSuggestion.data = this.suggestions.underGroupdata;
    else if (activeId.includes('salutation-')) this.autoSuggestion.data = this.suggestions.salutiondata;
    else if (activeId.includes('state-')) this.autoSuggestion.data = this.suggestions.state;
    else if (activeId.includes('city-')) this.autoSuggestion.data = this.suggestions.city;
    else if (activeId.includes('taxtype')) this.autoSuggestion.data = this.suggestions.taxtype;
    else if (activeId.includes('taxsubtype') && this.Accounts.taxtype.includes('GST') ) this.autoSuggestion.data = this.suggestions.taxsubtype;
    else {
      this.autoSuggestion.data = [];
      this.autoSuggestion.display = '';
      this.autoSuggestion.targetId = '';
      return;
    }

    this.autoSuggestion.display = 'name';
    this.autoSuggestion.targetId = activeId;
    console.log('Auto Suggestion: ', this.autoSuggestion);
  }

  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    if (activeId == 'undergroup') {
      this.Accounts.undergroup.name = suggestion.name;
      this.Accounts.undergroup.id = suggestion.id;
    } else if (activeId.includes('salutation')) {
      const index = parseInt(activeId.split('-')[1]);
      this.Accounts.accDetails[index].salutation.name = suggestion.name;
      this.Accounts.accDetails[index].salutation.id = suggestion.id;

    } else if (activeId.includes('state')) {
      const index = parseInt(activeId.split('-')[1]);
      this.Accounts.accDetails[index].state.name = suggestion.name;
      this.Accounts.accDetails[index].state.id = suggestion.id;
      this.GetCity(suggestion.id);
    } else if (activeId.includes('city')) {
      const index = parseInt(activeId.split('-')[1]);
      this.Accounts.accDetails[index].city.name = suggestion.name;
      this.Accounts.accDetails[index].city.id = suggestion.id;

    }
    else if (activeId.includes('taxtype')) {
      this.Accounts.taxtype = suggestion.name;
    }
    else if (activeId.includes('taxsubtype')) {
      this.Accounts.taxsubtype = suggestion.name;
    }
  }

  delete(tblid) {
    let params = {
      id: tblid
    };
    if (tblid) {
      console.log('city', tblid);
      this.common.params = {
        title: 'Delete Ledger ',
        description: `<b>&nbsp;` + 'Are you sure want to delete ? ' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        this.common.loading++;
        if (data.response) {
          console.log("data", data);
          this.Accounts.delete = 1;
          this.activeModal.close({ response: true, ledger: this.Accounts });
          this.common.loading--;

        }
      });
    }
  }

  permantdelete(tblid) {
    let params = {
      id: tblid,
      tblidname: 'id',
      tblname: 'ledger'
    };
    if (tblid) {
      console.log('city', tblid);
      this.common.params = {
        title: 'Delete City ',
        description: `<b>&nbsp;` + 'Are you sure want to delete permanently ?' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('Stock/deletetable', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: ', res);
              //this.getStockItems();
              this.activeModal.close({ response: true, ledger: this.Accounts });
              this.common.showToast(" This Value Has been Deleted!");
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
              this.common.showError('This Value has been used another entry!');
            });
        }
      });
    }
  }


  openAccountModal(Accounts?) {


    this.common.params = null;
    const activeModal = this.modalService.open(AccountsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
    activeModal.result.then(data => {
      if (data.response) {
        this.addAccount(data.Accounts);
        return;
      }
    });

  }

  addAccount(Accounts1) {
    console.log('accountdata', Accounts1);
    const params = {
      name: Accounts1.name,
      foid: 123,
      parentid: Accounts1.account.id,
      primarygroupid: Accounts1.account.primarygroup_id,
      x_id: 0
    };
    console.log('params11: ', params);
    this.common.loading++;
    this.api.post('Accounts/InsertAccount', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_secondarygroup;
        if (result == '') {
          this.common.showToast("Add Successfull  ");
        }
        else {
          this.common.showToast(result);
        }
        this.getUnderGroup();
        // this.GetAccount();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }
  changedefault(i){
    console.log('defaulyt check value', this.Accounts.accDetails[i].defaultcheck);
    this.Accounts.accDetails.map(checkvalue=>{
          checkvalue.defaultcheck='false';
    });
    this.Accounts.accDetails[i].defaultcheck='true';
  }

}
