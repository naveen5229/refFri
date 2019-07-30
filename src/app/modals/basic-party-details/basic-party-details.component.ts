import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { AddCompanyBranchComponent } from '../../modals/add-company-branch/add-company-branch.component';
import { CompanyAssociationComponent } from '../../modals/company-association/company-association.component';
import { CompanyEstablishmentComponent } from '../../modals/company-establishment/company-establishment.component';
import { CompanyContactsComponent } from '../../modals/company-contacts/company-contacts.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
  activeTab = 'Company Branches';


  dropDown = [
    { name: 'Self', id: 1 },
    { name: 'Others', id: 2 },
  ];

  companyExist = [];

  data = [];
  //  cmpAssoc = [];
  cmpEstablishment = [];
  companyContacts = [];
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
  // table1 = {
  //   cmpAssoc: {
  //     headings: {},
  //     columns: []
  //   },
  //   settings: {
  //     hideHeader: true
  //   }
  // };
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
      this.gstNo = this.common.params.cmpAssocDetail.Gst;
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
      this.getCompanyBranches();
      // this.getCompanyAssoc();
      this.getCompanyEstablishment();
      this.getCompanyContacts();
      this.getAssociationType();
    }
    this.getAssociationType();
    this.getSelfBranch();

    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
    this.Form = this.formBuilder.group({
      company: [''],
      cmpAlias: [''],
      gstNo: [''],
      assType: ['', [Validators.required]],
      branchId: [''],
      website: [''],
      remark: [''],
      // assType: ['',[Validators.required]],
      // panNo: ['', [Validators.required, Validators.pattern("^[A-Z]{5}[0-9]{4}[A-Z]$")]],
      panNo:[''],
      //  mobileNo: ['', [Validators.minLength(10), Validators.maxLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.Form.controls; }

  checkFormat() {
    this.panNo = (this.panNo).toUpperCase();

  }

  closeModal() {
    this.activeModal.close();
  }

  getAssociationType() {
    const params = "id=" + 63;
    this.api.get('Suggestion/getTypeMasterList?' + params)
      .subscribe(res => {
        this.associationType = res['data'];
      }, err => {
      });
  }

  // getSelfBranch() {
  //   let params = "assocCmpId=" + this.partyId + "&userCmpId=" + this.userCmpnyId;
  //   this.api.get('Suggestion/getSelfBranch?' + params)
  //     .subscribe(res => {
  //       this.branchs = res['data'];
  //     }, err => {
  //     });
  // }

  getSelfBranch() {

    this.api.post('Suggestion/GetBranchList',{})
      .subscribe(res => {
        this.branchs = res['data'];
      },
        err => {
        });

  }

  refresh() {
    this.getCompanyBranches();
    // this.getCompanyAssoc();
    this.getCompanyEstablishment();
    this.getCompanyContacts();
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

  // getCompanyAssoc() {
  //   this.common.loading++;
  //   this.api.get('ManageParty/getCompanyAssoc')
  //     .subscribe(res => {
  //       this.common.loading--;
  //       this.cmpAssoc = [];
  //       this.table1 = {
  //         cmpAssoc: {
  //           headings: {},
  //           columns: []
  //         },
  //         settings: {
  //           hideHeader: true
  //         }
  //       };
  //       this.headings = [];
  //       this.valobj = {};
  //       if (!res['data']) return;
  //       this.cmpAssoc = res['data'];
  //       let first_rec = this.cmpAssoc[0];
  //       for (var key in first_rec) {
  //         if (key.charAt(0) != "_") {
  //           this.headings.push(key);
  //           let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
  //           this.table1.cmpAssoc.headings[key] = headerObj;
  //         }
  //       }
  //       this.table1.cmpAssoc.columns = this.getTableColumns1();
  //       console.log('Api Response:', res);
  //     },
  //       err => {
  //         this.common.loading--;
  //         console.error('Api Error:', err);
  //       });

  // }


  // getTableColumns1() {
  //   let columns = [];
  //   console.log("Data=", this.data);
  //   this.cmpAssoc.map(companyAssoc => {
  //     this.valobj = {};
  //     for (let i = 0; i < this.headings.length; i++) {
  //       console.log("Type", this.headings[i]);
  //       console.log("doc index value:", companyAssoc[this.headings[i]]);
  //       if (this.headings[i] == "Action") {
  //         this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.addCompanyAssosiation.bind(this, companyAssoc) }] };
  //       }
  //       else {
  //         this.valobj[this.headings[i]] = { value: companyAssoc[this.headings[i]], class: 'black', action: '' };
  //       }
  //     }
  //     columns.push(this.valobj);
  //   });
  //   return columns;
  // }

  // addCompanyAssosiation(companyAssoc?) {
  //   this.common.params = companyAssoc ? { companyAssoc } : {
  //     cmpId: this.companyId,
  //     cmpName: this.companyName,
  //   };
  //   const activeModal = this.modalService.open(CompanyAssociationComponent, {
  //     size: "lg",
  //     container: "nb-layout"
  //   });
  //   activeModal.result.then(data => {
  //     if (data.response) {
  //       this.getCompanyAssoc();
  //     }
  //   });
  // }

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

    this.common.params =  {
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

  saveBasicDetails() {
    console.log("save Basic Details");
    console.log('gst and pan',this.gstNo,this.panNo);
    var regpan = /^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$/;
    var reggst = /^([0-9]){2}([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}([0-9]){1}([a-zA-Z]){1}([0-9]){1}?$/;
    if(this.panNo=='' && this.gstNo==''){
      this.common.showToast('enter');
      return;
    }else{
      if( this.panNo!='' && !regpan.test(this.panNo)  ){
        this.common.showError('Invalid Pan Number');
        return;
      }if(this.gstNo!='' && !reggst.test(this.gstNo)){
        this.common.showError('Invalid gstno Number');
        return;
      }if(this.panNo=='' || this.gstNo!=''){      
        this.panNo=this.gstNo.slice(2,11);
        console.log('pan from gst:',this.panNo);
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
        assocId: this.assocId
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
            this.panNo = null;
            this.gstNo = null;
            this.cmpAlias = null;
            this.assType = null;
            this.cmpName = null;
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
