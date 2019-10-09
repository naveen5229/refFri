import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { AccountService } from '../../../services/account.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmComponent } from '../../confirm/confirm.component';

@Component({
  selector: 'freight-rate-rules',
  templateUrl: './freight-rate-rules.component.html',
  styleUrls: ['./freight-rate-rules.component.scss']
})
export class FreightRateRulesComponent implements OnInit {
  party = {
    name: null,
    id: null,
    address: null
  }
  btnName="Add Rule";
  material = {
    name: null,
    id: null
  }
 

  rateRules = [];

  rateApplied = '1';
  rateParam = 'weight';
  rateName = null;
  rateId = null;

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

  constructor(public common: CommonService,
    public accountService: AccountService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    this.common.handleModalSize('class', 'modal-lg', '1100');
  }


  getPartyDetail(party) {
    console.log("party", party);
    this.party.address = party.address;
    this.party.name = party.name;
    this.party.id = party.id;
  }

  getMaterialDetail(material) {
    this.material.name = material.name;
    this.material.id = material.id;
  }
  getBranchDetails() {
    this.api.get('LorryReceiptsOperation/getBranchDetilsforLr?branchId=' + this.accountService.selected.branch.id)
      .subscribe(res => {
        console.log("branchdetails", res['data']);
      }, err => {
        console.log(err);
      });
  }

  resetData(type) {
    this.party.id = null;
  }

  resetMaterail(material) {
    this.material.id = null;
  }



  closeModal() {
    this.activeModal.close();
  }



  ngOnInit() {
  }


  getRateData() {
    this.common.loading++;
    let params = {
      branchId: this.accountService.selected.branch.id,
      rateApplied: this.rateApplied,
      rateParam: this.rateParam,
      partyId: this.party.id,
      materialId: this.material.id
    }
    this.api.post('FrieghtRate/getRateRules', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("report Formats", res['data']);
        this.rateRules = res['data'] || [];
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
        this.rateRules = res['data'];
        let first_rec = this.rateRules[0];
        for (var key in first_rec) {
          if (key.charAt(0) != "_") {
            this.headings.push(key);
            let headerObj = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
            this.table.data.headings[key] = headerObj;
          }

        }
        // let action = { title: this.formatTitle('action'), placeholder: this.formatTitle('action'), hideHeader: true };
        // this.table.data.headings['action'] = action;
        this.table.data.columns = this.getTableColumns();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.rateRules);
    this.rateRules.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      this.valobj['Action'] = { class: '', icons: this.rowIcons(doc) };
      columns.push(this.valobj);

    });
    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  rowIcons(row) {

    let icons = [];
    icons.push(
      {
        class: "fa fa-edit",
        action: this.updateRateFormat.bind(this, row),
      },
     
      {
        class: "fas fa-trash-alt ml-2",
        action: this.deleteRecord.bind(this, row),
      }
    )
    return icons;
  }

 

  updateRateFormat(row) {
    this.common.loading++;
    this.api.get('FrieghtRate/rateRuleEditDetail?id=' + row._id)
      .subscribe(res => {
        this.common.loading--;
        this.btnName="Update Rule";
        this.party.name = res['data'][0]['party_name'];
        this.party.id = res['data'][0]['party_id'];
        this.material.name = res['data'][0]['material_name'];
        this.material.id = res['data'][0]['material_id'];
        this.rateId = res['data'][0]['id'];
        this.accountService.selected.branch.id = res['data'][0]['branch_id'];
        this.accountService.selected.branchId = res['data'][0]['branch_id'];
        this.accountService.selected.branch.name = res['data'][0]['branch_name'];
        this.rateApplied = res['data'][0]['rule_value'];
        this.rateParam = res['data'][0]['rule_type'];
        this.rateName = res['data'][0]['name'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  saveRateFormat() {
    this.common.loading++;
    let params = {
      id: this.rateId,
      branchId: this.accountService.selected.branch.id,
      rateApplied: this.rateApplied,
      rateParam: this.rateParam,
      partyId: this.party.id,
      materialId: this.material.id,
      name: this.rateName
    }
    this.api.post('FrieghtRate/saveRateRule', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response", res);
        if (res['data'] && res['data'][0] && res['data'][0].r_id > 0) {
          this.btnName="Add Rule";
          this.common.showToast("SuccessFully Added");
          this.getRateData();
        } else {
          this.common.showError(res['data'][0].r_msg);
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  deleteRecord(row) {
    console.log("Delete_id:", row);
    let id = null;
    let params = {
      id: row._id
    }
    if (row._id) {
      this.common.params = {
        title: 'Delete Record',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      console.log("id:", row._id);
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('FrieghtRate/deleteRateRule', params)
            .subscribe(res => {
              this.common.loading--;

              this.common.showToast(res['msg']);

              this.getRateData();
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

  selectBranch() {
    this.accountService.selected.branch = this.accountService.branches.find(branch => {
      if (branch.id == this.accountService.selected.branchId) return true;
      return false;
    });
    this.getBranchDetails();
  }

  resetRateData()
  {
        this.party.name = null;
        this.party.id = null;
        this.material.name = null;
        this.material.id = null;
        this.rateId = null;
        this.accountService.selected.branch.id = null;
        this.accountService.selected.branchId = null;
        this.accountService.selected.branch.name = null;
        this.rateApplied = '1';
        this.rateParam = 'weight';
        this.rateName = null;
        this.btnName="Add Rule";
  } 
}

