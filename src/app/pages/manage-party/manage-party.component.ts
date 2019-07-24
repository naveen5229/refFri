import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddCompanyBranchComponent } from '../../modals/add-company-branch/add-company-branch.component';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { CompanyAssociationComponent } from '../../modals/company-association/company-association.component';
import { CompanyEstablishmentComponent } from '../../modals/company-establishment/company-establishment.component';
import { CompanyContactsComponent } from '../../modals/company-contacts/company-contacts.component';

@Component({
  selector: 'manage-party',
  templateUrl: './manage-party.component.html',
  styleUrls: ['./manage-party.component.scss']
})
export class ManagePartyComponent implements OnInit {

  companyId = null;
  companyName = null;
  companyType = 1;
  activeTab='Company Branches';
  

  dropDown = [
    { name: 'Self', id: 1 },
    { name: 'Others', id: 2 },
  ];

  data = [];
  cmpAssoc = [];
  cmpEstablishment=[];
  table2 = {
    cmpEstablishment: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  table1 = {
    cmpAssoc: {
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

  constructor(public modalService: NgbModal,
    public api: ApiService,
    public common: CommonService) {
    this.checkCompany();
    this.getCompanyBranches();
    this.getCompanyAssoc();
    this.getCompanyEstablishment();
  }

  ngOnInit() {
  }

  checkCompany() {
    this.api.get('ManageParty/checkCompany')
      .subscribe(res => {
        this.companyId = res['data'][0].company_id;
        this.companyName = res['data'][0].Company;
        console.log("para", this.companyId, this.companyName, res['data'])
        console.log(res)
      }, err => {
      });
  }

  getCompanyBranches() {
    const params = "status=" + this.companyType;
    console.log("pod", params);
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
      cmpId: this.companyId,
      cmpName: this.companyName,
      title: 'Add company Branch',
      flag: add
    }
    console.log("id", this.common.params);
    const activeModal = this.modalService.open(AddCompanyBranchComponent, {
      size: "md",
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
      cmpId: this.companyId,
      cmpName: this.companyName,
      title: 'Edit company Branch',
      doc: companyDetail,
      flag: update
    };

    const activeModal = this.modalService.open(AddCompanyBranchComponent, {
      size: "md",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data.response) {
        this.getCompanyBranches();
      }
    });
  }

  getCompanyAssoc() {
    this.common.loading++;
    this.api.get('ManageParty/getCompanyAssoc')
      .subscribe(res => {
        this.common.loading--;
        this.cmpAssoc = [];
        this.table1 = {
          cmpAssoc: {
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
        this.cmpAssoc = res['data'];
        let first_rec = this.cmpAssoc[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table1.cmpAssoc.headings[key] = headerObj;
          }
        }
        this.table1.cmpAssoc.columns = this.getTableColumns1();
        console.log('Api Response:', res);
      },
        err => {
          this.common.loading--;
          console.error('Api Error:', err);
        });

  }


  getTableColumns1() {
    let columns = [];
    console.log("Data=", this.data);
    this.cmpAssoc.map(companyAssoc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", companyAssoc[this.headings[i]]);
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.addCompanyAssosiation.bind(this, companyAssoc) }] };
        }
        else {
          this.valobj[this.headings[i]] = { value: companyAssoc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  addCompanyAssosiation(companyAssoc?) {
    this.common.params = companyAssoc ? { companyAssoc } : {
      cmpId: this.companyId,
      cmpName: this.companyName,
    };
    const activeModal = this.modalService.open(CompanyAssociationComponent, {
      size: "md",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data.response) {
        this.getCompanyAssoc();
      }
    });
  }

  getCompanyEstablishment() {
    this.common.loading++;
    this.api.get('ManageParty/getCmpEstablishment')
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
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.addCompanyEstablishment.bind(this,cmpEstablish) }] };
        }
        else {
          this.valobj[this.headings[i]] = { value: cmpEstablish[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }


  addCompanyEstablishment(cmpEstablish?){

    this.common.params = cmpEstablish ? { cmpEstablish } :'';
    const activeModal = this.modalService.open(CompanyEstablishmentComponent, {
      size: "md",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data.response) {
        this.getCompanyEstablishment();
      }
    });
  }

  addCompanyContacts(){
    const activeModal = this.modalService.open(CompanyContactsComponent, {
      size: "md",
      container: "nb-layout"
    });

  }


}
