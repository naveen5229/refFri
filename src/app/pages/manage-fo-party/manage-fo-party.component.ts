import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BasicPartyDetailsComponent } from '../../modals/basic-party-details/basic-party-details.component';
import { CommonService } from '../../services/common.service';
import { PartyLedgerMappingComponent } from '../../modals/party-ledger-mapping/party-ledger-mapping.component';



@Component({
  selector: 'manage-fo-party',
  templateUrl: './manage-fo-party.component.html',
  styleUrls: ['./manage-fo-party.component.scss']
})
export class ManageFoPartyComponent implements OnInit {
  assType = null;
  associationType = [];
  companyId = null;
  companyName = null;
  companyExist = false;
  data = [];
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

  constructor(public api: ApiService,
    public modalService: NgbModal,
    public common: CommonService) {
    this.refresh();
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }

  refresh() {
    this.checkCompany();
    this.getAssociationType();
  }

  getAssociationType() {
    this.api.get('Suggestion/getAssocTypeWrtFo')
      .subscribe(res => {
        this.associationType = res['data'];
      }, err => {
      });
  }

  checkCompany() {
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
    this.api.get('ManageParty/checkCompany')
      .subscribe(res => {

        if (res['data'] == null) {
          this.companyExist = false;
          console.log("ABCD", res['data']);
          this.common.showError("please add company");
        } else {
          this.companyExist = true;
          this.companyId = res['data'][0].company_id;
          this.companyName = res['data'][0].Company;
        }
        console.log("para", this.companyId, this.companyName, res['data'])
        console.log(res)
      }, err => {
      });
  }

  getCmpAssocWrtType() {
    const params = "assocType=" + this.assType;
    console.log("pod", params);
    this.common.loading++;
    this.api.get('ManageParty/getCmpAssocWrtType?' + params)
      .subscribe(res => {
        this.common.loading--;
        if (res['data'] == null) {
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
          this.common.showError("Data Not found");
          return

        } else {
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

        }

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
    this.data.map(cmpAssocDetail => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", cmpAssocDetail[this.headings[i]]);
        if (this.headings[i] == "Action") {
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.addNewParty.bind(this, cmpAssocDetail) }] };
        }
        else {
          this.valobj[this.headings[i]] = { value: cmpAssocDetail[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  addNewParty(cmpAssocDetail?) {
    console.log("TESTING")
    this.common.params = {
      cmpId: this.companyId,
      cmpName: this.companyName,
    };
    cmpAssocDetail && (this.common.params['cmpAssocDetail'] = cmpAssocDetail);
    console.log("add",this.common.params);
    const activeModal = this.modalService.open(BasicPartyDetailsComponent, {
      size: "lg",
      container: "nb-layout"
    });
    activeModal.result.then(data => {
      if (data.response) {
        this.getCmpAssocWrtType();
      }
    });

  }

  partyMapping(){
    const activeModal = this.modalService.open(PartyLedgerMappingComponent, {
      size: "lg",
      container: "nb-layout"
    });

  }

}
