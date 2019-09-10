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

@Component({
  selector: 'basic-party-details',
  templateUrl: './basic-party-details.component.html',
  styleUrls: ['./basic-party-details.component.scss']
})

export class BasicPartyDetailsComponent implements OnInit {

  isFormSubmit = false;
  Form: FormGroup;
  branchId = null;
  cmpName = null;
  associationType = [];
  branchs = [];
  assCmpnyId = null;
  userCmpnyId = null;
  cmpAlias = null;
  assType = '';
  save = false;
  website = null;
  remark = null;
  panNo = '';
  gstNo = '';
  assocId = null;
  companyId = null;
  companyName = null;
  partyId = null;
  partyName = null;
  value = false;
  modalClose = false;
  partyCode = null;
  userCode = null;
  activeTab = 'Company Branches';
  gstPanCheck = false;

  dropDown = [
    { name: 'Self', id: 1 },
    { name: 'Others', id: 2 },
  ];

  companyExist = [];

  data = [];
  cmpEstablishment = [];
  companyContacts = [];
  companyBanks = [];
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
      this.cmpAlias = this.common.params.cmpAssocDetail['Company Alias'];
      this.panNo = this.common.params.cmpAssocDetail.Pan;
      this.gstNo = this.common.params.cmpAssocDetail.Gst ? this.common.params.cmpAssocDetail.Gst : '';
      this.branchId = this.common.params.cmpAssocDetail._branchid;
      this.assType = this.common.params.cmpAssocDetail._asstype;
      this.remark = this.common.params.cmpAssocDetail.Remark;
      this.website = this.common.params.cmpAssocDetail.Website;
      this.assCmpnyId = this.common.params.cmpAssocDetail._asscompid;
      this.assocId = this.common.params.cmpAssocDetail._id;
      this.partyId = this.common.params.cmpAssocDetail._asscompid;
      this.partyName = this.common.params.cmpAssocDetail['Company Name'];
      this.cmpName = this.common.params.cmpAssocDetail['Company Name'];
      this.userCmpnyId = this.common.params.cmpAssocDetail._usercmpyid;
      this.userCode = this.common.params.cmpAssocDetail._usersuppcode ? this.common.params.cmpAssocDetail._usersuppcode : null;
      this.partyCode = this.common.params.cmpAssocDetail._partysuppcode ? this.common.params.cmpAssocDetail._partysuppcode : null;
      this.getCompanyBranches();
      this.getCompanyEstablishment();
      this.getCompanyContacts();
      this.getAssociationType();
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
      assType: ['', [Validators.required]],
      branchId: [''],
      website: [''],
      remark: [''],
      panNo: [''],
      userSupplier: [''],
      partySupplier: [''],
    });
  }

  refresh() {
    this.getCompanyBranches();
    this.getCompanyEstablishment();
    this.getCompanyContacts();
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

  getAssociationType() {
    this.api.get('Suggestion/getAssocTypeWrtFo')
      .subscribe(res => {
        this.associationType = res['data'];
      }, err => {
      });
  }

  getSelfBranch() {
    this.api.post('Suggestion/GetBranchList', {})
      .subscribe(res => {
        this.branchs = res['data'];
      },
        err => {
        });
  }

  getCompanyBranches() {
    let params = "assocCmpId=" + this.partyId + "&userCmpId=" + this.userCmpnyId;
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
      if (data.response) {
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
      if (data.response) {
        this.getCompanyBranches();
      }
    });
  }


  getCompanyEstablishment(branchId?) {
    let params = "assocCmpId=" + this.partyId + "&userCmpId=" + this.userCmpnyId;
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
      if (data.response) {
        this.getCompanyEstablishment(data.response);
      }
    });
  }

  getCompanyContacts() {
    let params = "assocCmpId=" + this.partyId + "&userCmpId=" + this.userCmpnyId;
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
      if (data.response) {
        this.getCompanyContacts();
      }
    });
  }

  getCompanyBanks() {
    let params = "partyId=" + this.partyId + "&userCmpId=" + this.userCmpnyId;
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
      if (data.response) {
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
    console.log("save Basic Details");
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

    let params = {
      branchId: this.branchId,
      website: this.website,
      remark: this.remark,
      panNo: this.panNo,
      gstNo: this.gstNo,
      cmpAlias: this.cmpAlias,
      assType: this.assType,
      cmpName: this.cmpName,
      assCmpnyId: this.assCmpnyId,
      userCmpnyId: this.userCmpnyId,
      assocId: this.assocId,
      userSuppCode: this.userCode,
      partySuppCode: this.partyCode,
    }
    ++this.common.loading;
    console.log("params", params);
    this.api.post('ManageParty/addCompWithAssoc', params)
      .subscribe(res => {
        --this.common.loading;
        console.log("Testing")
        if (res['data'][0].y_id > 0) {
          this.value = true;
          this.partyId = res['data'][0].y_id;
          this.partyName = res['data'][0].y_compname;
          this.branchId = null;
          this.website = null;
          this.remark = null;
          this.panNo = '';
          this.gstNo = '';
          this.cmpAlias = null;
          // this.assType = '';
          this.cmpName = null;
          this.userCode = null;
          this.partyCode = null;
          this.common.params = {
            partyId: res['data'][0].y_ass_id,
            userGroupId: this.assType,
          };
          this.modalService.open(PartyLedgerMappingComponent, { size: "lg", container: "nb-layout" });
          this.common.showToast(res['data'][0].y_msg);

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