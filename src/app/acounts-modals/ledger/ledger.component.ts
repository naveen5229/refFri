import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'ledger',
  templateUrl: './ledger.component.html',
  styleUrls: ['./ledger.component.scss']
})
export class LedgerComponent implements OnInit {
  showConfirm = false;
  showExit = false;
  salutiondata = [];
  userdata = [];

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
    accDetails: [{
      id: '',
      salutation: {
        name: '',
        id: ''
      },
      mobileNo: '',
      email: '',
      panNo: '',
      tanNo: '',
      gstNo: '',
      city: {
        name: '',
        id: ''
      },
      address: '',
      remarks: '',
      name: '',
      state: {
        name: '',
        id: ''
      }
    }]
  };
  allowBackspace = true;
  suggestionIndex = -1;


  
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    public api: ApiService) {
    console.log('Params: ', this.common.params);

    if (this.common.params) {
      console.log('edit ledger data ', this.common.params[0]);
      this.Accounts = {
        name: this.common.params[0].y_name,
        aliasname: this.common.params[0].y_alias_name,
        perrate: this.common.params[0].y_per_rate,
        user: {
          name: this.common.params.name,
          id: this.common.params.y_foid
        },
        undergroup: {
          name: this.common.params[0].accountgroup_name,
          id: this.common.params[0].y_accountgroup_id,
          primarygroup_id: '0',
        },
        id: this.common.params[0].y_id,
        code: this.common.params[0].y_code,
        accDetails: []
      };
      console.log('Accounts: ', this.Accounts);
      this.common.params.map(detail => {
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
          }
        });
      });
    }

    this.common.handleModalSize('class', 'modal-lg', '1250');
    this.GetSalution();
    this.getUserData();
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
    let IDs = ['undergroup'];
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
    list: []
  };


  addDetails() {
    this.Accounts.accDetails.push({
      id: '',
      salutation: {
        name: '',
        id: ''
      },
      mobileNo: '',
      email: '',
      panNo: '',
      tanNo: '',
      gstNo: '',
      city: {
        name: '',
        id: ''
      },
      address: '',
      remarks: '',
      name: '',
      state: {
        name: '',
        id: ''
      }

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
  keyHandler(event) {
    if (event.key == "Escape") {
      this.showExit = true;
    }
    const key = event.key.toLowerCase();
    const activeId = document.activeElement.id;
    console.log('Active Id', activeId);
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

      if (activeId.includes('user')) {
        this.setFoucus('code');
      } else if (activeId.includes('code')) {
        this.setFoucus('undergroup');
      } else if (activeId == 'name') {
        this.setFoucus('aliasname');
      } else if (activeId == 'aliasname') {
        this.setFoucus('code');
      } else if (activeId.includes('undergroup')) {
        if (this.suggestions.list.length) {
          this.selectSuggestion(this.suggestions.list[this.suggestionIndex == -1 ? 0 : this.suggestionIndex], this.activeId);
          this.suggestions.list = [];
          this.suggestionIndex = -1;
        }
        this.setFoucus('perrate');
      } else if (activeId.includes('perrate')) {
        this.setFoucus('salutation-0');
      } else if (activeId.includes('salutation-')) {
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
          this.setFoucus('perrate');
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

      if (activeId == 'perrate') this.setFoucus('undergroup');
      if (activeId == 'undergroup') this.setFoucus('aliasname');
      if (activeId == 'aliasname') this.setFoucus('name');
      if (activeId == 'name') this.setFoucus('code');
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
  }

}
