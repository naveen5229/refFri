import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountsComponent } from '../accounts/accounts.component';
import { AccountService } from '../../services/account.service';
import { AddCityComponent } from '../../acounts-modals/add-city/add-city.component';
import { AddStateComponent } from '../../acounts-modals/add-state/add-state.component';
@Component({
  selector: 'ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
  lastActiveId = '';
  deletedid = 0;
  foid=1;
  showConfirm = false;
  showExit = false;
  salutiondata = [];
  userdata = [];
  currentPage = 'Add Ledger';
  state = [];
  gstregtype = [
  {
    name: 'Unknown',
    id: 'Unknown'
  },
  {
    name: 'Composition',
    id: 'Composition'
  },
  {
    name: 'Consumer',
    id: 'Consumer'
  },
  {
    name: 'Regular',
    id: 'Regular'
  },
  {
    name: 'Unregistered',
    id: 'Unregistered'
  }
  ];
  activeId = "user";
  sizeledger=0;
  mannual=false;
  superparentid=0;
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
    approved: this.mannual,
    deleteview: 0,
    delete: 0,
    bankname: '',
    costcenter: 0,
    taxsubtype:'',
    taxtype:'',
    isnon:true,
    hsnno:0,
    hsndetail:'',
    gst:false,
    cess:0,
    igst:0,
    taxability:'',
    calculationtype:'',
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
      gst_reg_type:{
        name: 'Unknown',
        id: 'Unknown'
      },
      defaultcheck:'true'
    }]
  };
  allowBackspace = true;
  suggestionIndex = -1;



  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal,
    public api: ApiService,
    public accountService: AccountService) {
    console.log('Params requst: ', this.common.params);
    if (this.common.params && this.common.params.ledgerdata) {
      this.currentPage = "Edit Ledger";
      this.deletedid = this.common.params.deleted;
      this.foid=this.common.params.ledgerdata[0].y_foid
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
        isnon:this.common.params.ledgerdata[0].y_gst_is_non,
        hsnno:this.common.params.ledgerdata[0].y_gst_hsn_sac_no,
        hsndetail:this.common.params.ledgerdata[0].y_gst_hsn_sac_desc,
        gst:this.common.params.ledgerdata[0].y_gst_reg_type,
        cess:this.common.params.ledgerdata[0].y_gst_cess_per,
        igst:this.common.params.ledgerdata[0].y_gst_igst_per,
        taxability:this.common.params.ledgerdata[0].y_gst_taxability,
        calculationtype:this.common.params.ledgerdata[0].y_gst_calculation_type,
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
        approved: (this.common.params.ledgerdata[0].y_for_approved) ? false : true,
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
          gst_reg_type:{
            name: detail.y_gst_reg_type,
            id: detail.y_gst_reg_type
          },
      defaultcheck:"'"+detail.y_dtl_is_default+"'"

        });
      });
    }
if(this.common.params && this.common.params.sizeledger) { 
  this.sizeledger=this.common.params.sizeledger;
}
console.log('sixe ledger',this.sizeledger);
    this.common.handleModalSize('class', 'modal-lg', '1250','px',this.sizeledger);
    this.GetSalution();
    // this.getUserData();
    this.getUnderGroup();
    this.GetState();
    this.setFoucus('name');

    this.mannual = this.accountService.selected.branch.is_inv_manualapprove;
    console.log('mannual',this.mannual);
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
    let IDs = ['undergroup','taxtype','taxsubtype','gst_reg_type'];
    this.Accounts.accDetails.map((amountDetails, index) => {
      IDs.push('salutation-' + index);
      IDs.push('state-' + index);
      IDs.push('city-' + index);
      IDs.push('gst_reg_type-' + index);
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
    gstregtype:this.gstregtype,
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
      }],
      gstcalcution:[
        {
          name:'On Value',
          id:'value'
        },
        {
          name:'On Time Rate',
          id:'rate'
        }
      ],
      taxability:[
        {
          name:'Unknown',
          id:'Unknown'
        },
        {
          name:'Exempt',
          id:'Exempt'
        },
        {
          name:'Nil Rated',
          id:'rated'
        },
        {
          name:'Taxable',
          id:'Taxable'
        }
      ]
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
      gst_reg_type:{
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

        if(this.Accounts.undergroup.id){
          res['data'].map((value)=>{
            if(value.y_id == this.Accounts.undergroup.id){
                this.superparentid=value.y_super_parent_id;
            }
          })
        }

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
  save(response){
  this.showConfirm = true;
  }

  dismiss(response) {
    console.log('Accounts:', this.Accounts);
    // console.log('Accounts:', response);
    if(this.foid >0){
    this.activeModal.close({ response: response, ledger: this.Accounts });
    }else{
    this.common.showError("Sysytem Entry Can't Update");
    this.activeModal.close({ response: false, ledger: this.Accounts });     
    }
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
  modelCondition(flag) {
  //  this.showConfirm = flag;
    this.activeModal.close({ response: flag});
 //   event.preventDefault();
   // return;
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
    if ((event.altKey && key === 'c') && (activeId.includes('city-'))) {
      console.log('alt + C pressed ');
      let index = activeId.split('-')[1];
      this.openModal(this.Accounts.accDetails[index].state.id);
      return;
    } 
    if ((event.altKey && key === 'c') && (activeId.includes('state-'))) {
      console.log('alt + C pressed ');
      let index = activeId.split('-')[1];
      this.openstateModal();
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
        if(this.superparentid === -8 || this.superparentid === -8 || this.superparentid === -5 || this.superparentid === -6){
          this.setFoucus('gst');
        } else if(this.superparentid === -46){
          this.setFoucus('taxtype');
        }else{
        this.setFoucus('isbank');
        }
      } else if (activeId.includes('taxtype')) {
        this.setFoucus('taxsubtype');
      }else if (activeId.includes('taxsubtype')) {
        this.setFoucus('isbank');
      }else if (activeId == 'igst'  ) {
        this.setFoucus('cess');
      }else if (activeId == 'gst' || activeId == 'notgst') {
        this.setFoucus('hsndetail');
     //  this.showConfirm = true;
     } else if (activeId == 'hsndetail') {
        this.setFoucus('hsnno');
       // this.showConfirm = true;
      }else if (activeId == 'hsnno') {
        this.setFoucus('notisnon');
       // this.showConfirm = true;
      }else if (activeId == 'cess') {
        this.setFoucus('isbank');
      }else if (activeId.includes('calculationtype')) {
        
        console.log('test??????');
        this.setFoucus('taxability');
      }else if (activeId.includes('taxability')) {
        
        console.log('test??????');        
        this.setFoucus('igst');
      }else if (activeId == 'isnon' || activeId == 'notisnon') {
        this.setFoucus('calculationtype');
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
        this.setFoucus('gst_reg_type-' + index);
      }else if (activeId.includes('gst_reg_type-')) {
        let index = activeId.split('-')[1];
        setTimeout(() => {
       let gsttype= this.Accounts.accDetails[index].gst_reg_type.id;
          if(gsttype === 'Unknown' || gsttype ==='Unregistered'){
            this.setFoucus('state-' + index);
          }else{
            this.setFoucus('gstNo-' + index);
          }
        }, 20);
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
        this.setFoucus('gst_reg_type-' + index);
      }else if (activeId.includes('gst_reg_type-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('tanNo-' + index);
      } else if (activeId.includes('city-')) {
        let index = activeId.split('-')[1];
        this.setFoucus('state-' + index);
      } else if (activeId.includes('state-')) {
        let index = activeId.split('-')[1];
        setTimeout(() => {
          let gsttype= this.Accounts.accDetails[index].gst_reg_type.id;
             if(gsttype === 'Unknown' || gsttype ==='Unregistered'){
               this.setFoucus('gst_reg_type-' + index);
             }else{
               this.setFoucus('gstNo-' + index);
             }
           }, 20);
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
      if (activeId == 'isbank') {
        
        if(this.superparentid === -8 || this.superparentid === -8 || this.superparentid === -5 || this.superparentid === -6){
          this.setFoucus('cess');
        } else if(this.superparentid === -46){
          this.setFoucus('taxsubtype');
        }else{
          this.setFoucus('costcenter1');
        }
      }
      if (activeId == 'taxsubtype') this.setFoucus('taxtype');
      if (activeId == 'taxtype') this.setFoucus('costcenter');
      if (activeId == 'cess') this.setFoucus('igst');
      if (activeId == 'igst') this.setFoucus('taxability');
      if (activeId == 'taxability') this.setFoucus('calculationtype');
      if (activeId == 'calculationtype') this.setFoucus('notisnon');
      if (activeId == 'notisnon' || 'isnon') this.setFoucus('hsnno');
      if (activeId == 'hsnno') this.setFoucus('hsndetail');
      if (activeId == 'hsndetail') this.setFoucus('gst');
      if (activeId == 'gst') this.setFoucus('costcenter1');
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
   capitalizeFirstLetter(str) {
    this.Accounts.name= str.charAt(0).toUpperCase() + str.slice(1);
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
  openModal(id) {
     // console.log('city', city);
      this.common.params = '';
      const activeModal = this.modalService.open(AddCityComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
         // this.updateCity(data.city, city.id);
       // this.getpageData();
       // return;
       this.GetCity(id);
        }
      });
    
    
  }
  openstateModal() {
    // console.log('city', city);
     this.common.params = '';
     const activeModal = this.modalService.open(AddStateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
     activeModal.result.then(data => {
       if (data.response) {
        // this.updateCity(data.city, city.id);
      // this.getpageData();
      // return;
      //this.GetCity(id);
      this.GetState();
       }
     });
   
   
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
    }else if (this.activeId.includes('gst_reg_type-')) {
      const index = parseInt(this.activeId.split('-')[1]);
      this.Accounts.accDetails[index].gst_reg_type.id = suggestion.id;
    }  else if (this.activeId.includes('city-')) {
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
    else if (activeId.includes('gst_reg_type-')) this.autoSuggestion.data = this.suggestions.gstregtype;
    else if (activeId.includes('city-')) this.autoSuggestion.data = this.suggestions.city;
    else if (activeId.includes('taxtype')) this.autoSuggestion.data = this.suggestions.taxtype;
    else if (activeId.includes('taxsubtype') && this.Accounts.taxtype.includes('GST') ) this.autoSuggestion.data = this.suggestions.taxsubtype;
    else if (activeId == 'calculationtype') this.autoSuggestion.data = this.suggestions.gstcalcution; 
    else if (activeId == 'taxability')this.autoSuggestion.data = this.suggestions.taxability; 
    else {
      this.autoSuggestion.data = [];
      this.autoSuggestion.display = '';
      this.autoSuggestion.targetId = '';
      return;
    }
    if (activeId == 'undergroup'){
      this.autoSuggestion.display = 'y_name';
      this.autoSuggestion.targetId = 'undergroup';
    }else{
    this.autoSuggestion.display = 'name';
    this.autoSuggestion.targetId = activeId;
    console.log('Auto Suggestion: ', this.autoSuggestion);
    }
  }

  onSelect(suggestion, activeId) {
    console.log('Suggestion: ', suggestion);
    if (activeId == 'undergroup') {
      this.Accounts.undergroup.name = suggestion.y_name;
      this.Accounts.undergroup.id = suggestion.y_id;
      this.superparentid = suggestion.y_super_parent_id;
      console.log('superparentid',this.superparentid);
    } else if (activeId.includes('salutation')) {
      const index = parseInt(activeId.split('-')[1]);
      this.Accounts.accDetails[index].salutation.name = suggestion.name;
      this.Accounts.accDetails[index].salutation.id = suggestion.id;

    } else if (activeId.includes('state')) {
      const index = parseInt(activeId.split('-')[1]);
      this.Accounts.accDetails[index].state.name = suggestion.name;
      this.Accounts.accDetails[index].state.id = suggestion.id;
      this.GetCity(suggestion.id);
    } else if (activeId.includes('gst_reg_type')) {
      const index = parseInt(activeId.split('-')[1]);
      this.Accounts.accDetails[index].gst_reg_type.name = suggestion.name;
      this.Accounts.accDetails[index].gst_reg_type.id = suggestion.id;
    }else if (activeId.includes('city')) {
      const index = parseInt(activeId.split('-')[1]);
      this.Accounts.accDetails[index].city.name = suggestion.name;
      this.Accounts.accDetails[index].city.id = suggestion.id;

    }
    else if (activeId.includes('taxtype')) {
      this.Accounts.taxtype = suggestion.name;
    }
    else if (activeId.includes('taxsubtype')) {
      this.Accounts.taxsubtype = suggestion.name;
    }else  if (activeId == 'calculationtype') {
      console.log('suggestion with id calculate',suggestion);
      this.Accounts.calculationtype = suggestion.name;
      this.setFoucus('taxability');
    } else  if (activeId == 'taxability') {
      console.log('suggestion with id taxability',suggestion);
      this.Accounts.taxability = suggestion.name;
      this.setFoucus('igst');
    } 
  }

  delete(tblid) {
    let params = {
      id: tblid
    };
    if(this.foid>0){
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
              this.approveDeleteFunction(1,'true',tblid);
          this.common.loading--;

        }
      });
    }
  }
  else{
    this.common.showError("System Entry Can't Delete");
  }
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
        }
       // this.GetLedger();
       this.modelCondition(true);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError('This Value has been used another entry!');
      });
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
