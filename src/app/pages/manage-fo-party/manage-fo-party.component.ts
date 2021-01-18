import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BasicPartyDetailsComponent } from '../../modals/basic-party-details/basic-party-details.component';
import { CommonService } from '../../services/common.service';
import { PartyLedgerMappingComponent } from '../../modals/party-ledger-mapping/party-ledger-mapping.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';



import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
@Component({
  selector: 'manage-fo-party',
  templateUrl: './manage-fo-party.component.html',
  styleUrls: ['./manage-fo-party.component.scss']
})
export class ManageFoPartyComponent implements OnInit {
  assType = null;
  searchValue = '';
  searchString = '';
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

  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {
    // this.checkCompany();
    this.getAssociationType();
  }

  getAssociationType() {
    this.common.loading++;
    this.api.get('Suggestion/getAssocTypeWrtFo')
      .subscribe(res => {
        this.common.loading--;
        this.associationType = res['data'];
      }, err => {
        this.common.loading--;
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

        if (!res['data'] || !res['data'].length) {
          this.companyExist = false;
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
    const params = "assocType=" + this.assType+
    "&searchValue="+ this.searchValue+
      "&searchString="+this.searchString;
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
          this.valobj[this.headings[i]] = {
            value: "", action: null,
            icons: [{ class: 'fa fa-edit', action: this.addNewParty.bind(this, 'Edit', cmpAssocDetail) },
            { class: 'fab fa-reddit', action: this.partyMapping.bind(this, cmpAssocDetail) },
            { class: 'fa fa-trash', action: this.deleteParty.bind(this, cmpAssocDetail) }]
          };
        }
        else {
          this.valobj[this.headings[i]] = { value: cmpAssocDetail[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  addNewParty(string, cmpAssocDetail?) {
    console.log("TESTING")
    this.common.params = {
      cmpId: this.companyId,
      cmpName: this.companyName,
      associationType: this.assType,
      refName: string
    };
    cmpAssocDetail && (this.common.params['cmpAssocDetail'] = cmpAssocDetail);
    console.log("add", this.common.params);
    const activeModal = this.modalService.open(BasicPartyDetailsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'add-consige-veiw' });
    // activeModal.result.then(data => {
    //   if (data.response) {
    //     this.getCmpAssocWrtType();
    //   }
    // });

  }

  partyMapping(cmpAssocDetail) {
    if (cmpAssocDetail._ledid == null) {
      this.common.params = {
        partyId: cmpAssocDetail._id,
        userGroupId: cmpAssocDetail._asstype,
      };
      const activeModal = this.modalService.open(PartyLedgerMappingComponent, {
        size: "lg",
        container: "nb-layout"
      });
      activeModal.result.then(data => {
        if (data) {
          this.getCmpAssocWrtType();
        }
      });
    } else {
      this.common.showToast('Ledger Already Mapped')
    }
  }

  deleteParty(party) {
    const params = {
      assocId: party._id,
    }
    if (party._id) {
      this.common.params = {
        title: 'Delete Party ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post("ManageParty/deletePartyAssociation", params)
            .subscribe(res => {
              console.log('Api Response:', res)
              this.common.showToast(res['msg']);
              this.getCmpAssocWrtType();
              this.common.loading--;
            },
              err => console.error(' Api Error:', err));
        }
      });
    }
  }


}
