import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { AddCompanyBranchComponent } from '../../modals/add-company-branch/add-company-branch.component';
import { CompanyAssociationComponent } from '../../modals/company-association/company-association.component';
import { CompanyEstablishmentComponent } from '../../modals/company-establishment/company-establishment.component';
import { CompanyContactsComponent } from '../../modals/company-contacts/company-contacts.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BankAccountsComponent } from '../bank-accounts/bank-accounts.component';
import { ConfirmComponent } from '../confirm/confirm.component';
import { PartyLedgerMappingComponent } from '../party-ledger-mapping/party-ledger-mapping.component';
import { AddCompanyAssociationComponent } from '../add-company-association/add-company-association.component';

@Component({
  selector: 'basic-party-details',
  templateUrl: './basic-party-details.component.html',
  styleUrls: ['./basic-party-details.component.scss']
})

export class BasicPartyDetailsComponent implements OnInit {

  isFormSubmit = false;
  Form: FormGroup;
  cmpName = null;
  assCmpnyId = null;
  userCmpnyId = null;
  cmpAlias = null;
  website = null;
  address = null;
  panNo = '';
  gstNo = '';
  partyId = null;
  partyName = null;
  value = false;
  modalClose = false;
  activeTab = 'Company Association';
  gstPanCheck = false;
  associationType = null;
  associationTypes = [];
  branchs = [];
  branchId = null;
  assType = null;
  refName = this.common.params.refName;

  data = [];
  cmpEstablishment = [];
  companyContacts = [];
  companyBanks = [];
  companyAssociation = [];
  table0 = {
    companyAssociation: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  table4 = {
    companyBanks: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  table3 = {
    companyContacts: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  table2 = {
    cmpEstablishment: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  headings = [];
  valobj = {};

  constructor(public activeModal: NgbActiveModal,
    public api: ApiService,
    public modalService: NgbModal,
    private formBuilder: FormBuilder,
    public common: CommonService) {
    console.log("association", this.common.params.cmpAssocDetail)
    this.userCmpnyId = this.common.params.cmpId;
    if (this.common.params.cmpAssocDetail) {
      this.value = true;
      this.associationType = this.common.params.associationType;
      this.cmpAlias = this.common.params.cmpAssocDetail['Company Alias'];
      this.panNo = this.common.params.cmpAssocDetail.Pan ? this.common.params.cmpAssocDetail.Pan : '';
      this.gstNo = this.common.params.cmpAssocDetail.Gst ? this.common.params.cmpAssocDetail.Gst : '';
      // this.remark = this.common.params.cmpAssocDetail.Remark;
      this.website = this.common.params.cmpAssocDetail.Website;
      //  this.assCmpnyId = this.common.params.cmpAssocDetail._asscompid;
      this.partyId = this.common.params.cmpAssocDetail._partyid;
      this.partyName = this.common.params.cmpAssocDetail['Company Name'];
      console.log("party Name", this.partyName);
      this.cmpName = this.common.params.cmpAssocDetail['Company Name'];
      this.userCmpnyId = this.common.params.cmpAssocDetail._usercmpyid;
      this.getCompanyAssociation();
      this.getCompanyBranches();
      this.getCompanyEstablishment();
      this.getCompanyContacts();
      this.getCompanyBanks();
    }
    this.getAssociationType();
    this.getSelfBranch();
    this.common.refresh = this.refresh.bind(this);

  }
  ngOnInit() {
    this.Form = this.formBuilder.group({
      company: ['', [Validators.required]],
      cmpAlias: [''],
      gstNo: [''],
      website: [''],
      address: [''],
      panNo: [''],
      branch: [''],
      association: [''],
    });
  }
  refresh() {
    this.getCompanyAssociation();
    this.getCompanyBranches();
    this.getCompanyEstablishment();
    this.getCompanyContacts();
    this.getCompanyBanks();

  }

  getAssociationType() {
    this.common.loading++;
    this.api.get('Suggestion/getAssocTypeWrtFo')
      .subscribe(res => {
        this.common.loading--;
        this.associationTypes = res['data'];
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getSelfBranch() {
    this.common.loading++;
    this.api.post('Suggestion/GetBranchList', {})
      .subscribe(res => {
        this.common.loading--;
        this.branchs = res['data'];
      },
        err => {
          this.common.loading--;
          console.log(err);
        });
  }

  // convenience getter for easy access to form fields
  get f() { return this.Form.controls; }

  checkFormat() {
    this.panNo = (this.panNo).toUpperCase();

  }

  closeModal() {
    this.modalClose = true;
    this.activeModal.close({ response: this.modalClose });
  }

  getCompanyAssociation() {
    const params = "assocType=" + this.associationType + "&partyId=" + this.partyId;
    this.common.loading++;
    this.api.get('ManageParty/getCmpAssocWrtType?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.companyAssociation = [];
        this.table0 = {
          companyAssociation: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        if (!res['data']) return;
        this.companyAssociation = res['data'];
        let first_rec = this.companyAssociation[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table0.companyAssociation.headings[key] = headerObj;
          }
        }
        this.table0.companyAssociation.columns = this.getCmpAssocTableColumns();
        console.log('Api Response:', res);
      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });
  }

  getCmpAssocTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.companyAssociation.map(companyAssocition => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.addeditCompanyAssociation.bind(this, companyAssocition, 'Update') }] };
        }
        else {
          this.valobj[this.headings[i]] = { value: companyAssocition[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  addeditCompanyAssociation(cmpAssocDetail?) {
    this.common.params = {
      cmpId: this.partyId,
      cmpName: this.partyName,
      userCmpId: this.userCmpnyId,
    };
    cmpAssocDetail && (this.common.params['cmpAssocDetail'] = cmpAssocDetail);
    const activeModal = this.modalService.open(AddCompanyAssociationComponent, {
      size: "sm",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data) {
        this.getCompanyAssociation();
      }
    });

  }


  getCompanyBranches() {
    let params = "assocCmpId=" + this.partyId;
    this.common.loading++;
    this.api.get('ManageParty/getCompanyBranches?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.data = [];
        this.table = {
          data: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        if (!res['data']) return;
        this.data = res['data'];
        let first_rec = this.data[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }
        }
        this.table.data.columns = this.getTableColumns();
        console.log('Api Response:', res);
      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });

  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(companyDetail => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", companyDetail[this.headings[i]]);
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.editCompanyBranch.bind(this, companyDetail, 'Update') }] };
        }
        else {
          this.valobj[this.headings[i]] = { value: companyDetail[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  addCompany(add) {
    this.common.params = {
      cmpId: this.partyId,
      cmpName: this.partyName,
      userCmpId: this.userCmpnyId,
      title: 'Add company Branch',
      flag: add
    }
    console.log("id", this.common.params);
    const activeModal = this.modalService.open(AddCompanyBranchComponent, {
      size: "sm",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data) {
        this.getCompanyBranches();
      }
    });
  }

  editCompanyBranch(companyDetail, update) {
    this.common.params = {
      cmpId: this.partyId,
      cmpName: this.partyName,
      title: 'Edit company Branch',
      doc: companyDetail,
      flag: update
    };

    const activeModal = this.modalService.open(AddCompanyBranchComponent, {
      size: "sm",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data) {
        this.getCompanyBranches();
      }
    });
  }




  getCompanyEstablishment() {
    let params = "assocCmpId=" + this.partyId;
    this.common.loading++;
    this.api.get('ManageParty/getCmpEstablishment?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.cmpEstablishment = [];
        this.table2 = {
          cmpEstablishment: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        if (!res['data']) return;
        this.cmpEstablishment = res['data'];
        let first_rec = this.cmpEstablishment[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table2.cmpEstablishment.headings[key] = headerObj;
          }
        }
        this.table2.cmpEstablishment.columns = this.getTableColumns2();
        console.log('Api Response:', res);
      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });
  }


  getTableColumns2() {
    let columns = [];
    console.log("Data=", this.data);
    this.cmpEstablishment.map(cmpEstablish => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.addCompanyEstablishment.bind(this, cmpEstablish) }] };
        }
        else {
          this.valobj[this.headings[i]] = { value: cmpEstablish[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }


  addCompanyEstablishment(cmpEstablish?) {
    this.common.params = {
      // cmpId: this.common.params.cmpId,
      // cmpName: this.common.params.cmpName,
      cmpId: this.partyId,
      cmpName: this.partyName,
      userCmpId: this.userCmpnyId,
    };

    cmpEstablish && (this.common.params['cmpEstablish'] = cmpEstablish);
    const activeModal = this.modalService.open(CompanyEstablishmentComponent, {
      size: "sm",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data) {
        this.getCompanyEstablishment();
      }
    });
  }

  getCompanyContacts() {
    let params = "assocCmpId=" + this.partyId;
    this.common.loading++;
    this.api.get('ManageParty/getCmpContacts?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.companyContacts = [];
        this.table3 = {
          companyContacts: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        if (!res['data']) return;
        this.companyContacts = res['data'];
        let first_rec = this.companyContacts[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table3.companyContacts.headings[key] = headerObj;
          }
        }
        this.table3.companyContacts.columns = this.getTableColumns3();
        console.log('Api Response:', res);
      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });
  }


  getTableColumns3() {
    let columns = [];
    console.log("Data=", this.data);
    this.companyContacts.map(contactDetail => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.addCompanyContacts.bind(this, contactDetail) }] };
        }
        else {
          this.valobj[this.headings[i]] = { value: contactDetail[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  addCompanyContacts(contactDetail?) {
    this.common.params = {
      cmpId: this.partyId,
      cmpName: this.partyName,
      userCmpId: this.userCmpnyId,
    };
    contactDetail && (this.common.params['contactDetail'] = contactDetail);
    const activeModal = this.modalService.open(CompanyContactsComponent, {
      size: "sm",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data) {
        this.getCompanyContacts();
      }
    });
  }

  getCompanyBanks() {
    let params = "partyId=" + this.partyId;
    this.common.loading++;
    this.api.get('ManageParty/getPartyBankAccouts?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.companyBanks = [];
        this.table4 = {
          companyBanks: {
            headings: {},
            columns: []
          },
          settings: {
            hideHeader: true
          }
        };
        this.headings = [];
        this.valobj = {};
        if (!res['data']) return;
        this.companyBanks = res['data'];
        let first_rec = this.companyBanks[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table4.companyBanks.headings[key] = headerObj;
          }
        }
        this.table4.companyBanks.columns = this.getTableColumns4();
        console.log('Api Response:', res);
      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });
  }


  getTableColumns4() {
    let columns = [];
    // console.log("Data=", this.data);
    this.companyBanks.map(bankDetails => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.addCompanyBank.bind(this, bankDetails) }] };
        }
        else {
          this.valobj[this.headings[i]] = { value: bankDetails[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  addCompanyBank(bankDetails?) {
    this.common.params = {
      cmpId: this.partyId,
      cmpName: this.partyName,
      userCmpId: this.userCmpnyId,
    };
    bankDetails && (this.common.params['bankDetails'] = bankDetails);
    const activeModal = this.modalService.open(BankAccountsComponent, {
      size: "sm",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data) {
        this.getCompanyBanks();
      }
    });
  }

  saveDetails() {
    if (this.panNo == '' && this.gstNo == '') {
      this.common.params = {
        title: 'PAN/GST CONFIRMATION',
        description: 'Do you Still Continue Either PAN OR GST ?',
        btn2: "No",
        btn1: 'Yes'
      };
      console.log("Inside confirm model")
      const activeModal = this.modalService.open(ConfirmComponent, { size: "sm", container: "nb-layout" });
      activeModal.result.then(data => {
        console.log('res', data);
        if (data.response) {
          this.gstPanCheck = true;
          this.saveBasicDetails();
        }
      });
    } else {
      this.saveBasicDetails();
    }
  }

  saveBasicDetails() {
    console.log('gst and pan', this.gstNo, this.panNo);
    var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    var reggst = /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9a-zA-Z]){1}?$/;
    if (!this.gstPanCheck) {
      if (this.panNo != '' && !regpan.test(this.panNo)) {
        this.common.showError('Invalid Pan Number');
        return;
      } if (this.gstNo != '' && !reggst.test(this.gstNo)) {
        this.common.showError('Invalid gstno Number');
        return;
      } if (this.panNo == '' && this.gstNo != '') {
        this.panNo = this.gstNo.slice(2, 11);
        console.log('pan from gst:', this.panNo);
      }
    }

    let params;
    params = {
      cmpName: this.cmpName,
      cmpAlias: this.cmpAlias,
      address: this.address,
      website: this.website,
      panNo: this.panNo,
      gstNo: this.gstNo,
      cmpId: this.partyId,
      // userCmpnyId: this.userCmpnyId,
    }

    if (this.refName == 'Add') {
      params['assocType'] = this.assType;
        params['branchId'] = this.branchId;
    }
    //    assocType:this.assType,
    //    branchId:this.branchId,
    // }

    ++this.common.loading;
    console.log("params", params);
    this.api.post('ManageParty/addAndUpdateParty', params)
      .subscribe(res => {
        --this.common.loading;
        console.log("Testing")
        if (res['data'][0].y_id > 0) {
          this.value = true;
          this.partyId = res['data'][0].y_id;
          this.partyName = res['data'][0].y_compname;
          this.website = null;
          this.address = null;
          this.panNo = '';
          this.gstNo = '';
          this.cmpAlias = null;
          this.cmpName = null;
          // this.common.params = {
          //   partyId: res['data'][0].y_ass_id,
          //   // userGroupId: this.assType,
          // };
          // this.modalService.open(PartyLedgerMappingComponent, { size: "lg", container: "nb-layout" });
          this.common.showToast(res['data'][0].y_msg);
          this.getCompanyAssociation();

        } else {
          this.common.showError(res['data'][0].y_msg)
        }
      },
        err => {
          --this.common.loading;
          console.error(' Api Error:', err)
        });
  }


}