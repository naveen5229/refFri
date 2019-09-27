import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { AccountService } from '../../services/account.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LrInvoiceColumnsComponent } from '../../pages/lr-invoice-columns/lr-invoice-columns.component';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'add-report-formats',
  templateUrl: './add-report-formats.component.html',
  styleUrls: ['./add-report-formats.component.scss']
})
export class AddReportFormatsComponent implements OnInit {
  party = {
    name: null,
    id: null,
    address: null
  }
  btnName="Add Format";
  material = {
    name: null,
    id: null
  }
  types = [];
  reportFormats = [];

  reportType = 'LR';
  isGlobal = false;
  formatName = null;
  formatId = null;

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
  getTypes() {
    ++this.common.loading;
    this.api.get('Suggestion/getTypeMaster?typeId=66')
      .subscribe(res => {
        console.log("branchdetails", res['data']);
        --this.common.loading;
        this.types = res['data'];
      }, err => {
        --this.common.loading;
        console.log(err);
      });
  }


  closeModal() {
    this.activeModal.close();
  }



  ngOnInit() {
  }


  getReportFormat() {
    this.common.loading++;
    let params = {
      branchId: this.accountService.selected.branch.id,
      reportType: this.reportType,
      partyId: this.party.id,
      isGlobal: this.isGlobal,
      materialId: this.material.id
    }
    this.api.post('LorryReceiptsOperation/getFormatReportsList', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("report Formats", res['data']);
        this.reportFormats = res['data'] || [];
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
        this.reportFormats = res['data'];
        let first_rec = this.reportFormats[0];
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
    console.log("Data=", this.reportFormats);
    this.reportFormats.map(doc => {
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
        action: this.updateReportFormate.bind(this, row),
      },
      {
        class: "fa fa-eye ml-2",
        action: this.openColumnAssignModal.bind(this, row),
      },
      {
        class: "fas fa-trash-alt ml-2",
        action: this.deleteRecord.bind(this, row),
      }
    )
    return icons;
  }

  openColumnAssignModal(format) {
    let params = {
      id: format._id
    }
    this.common.params = { format: params };
    console.log(this.common.params);
    const activeModal = this.modalService.open(LrInvoiceColumnsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('data:', data);
    });
  }


  updateReportFormate(row) {
    this.common.loading++;
    this.api.get('LorryReceiptsOperation/reportFormatEditDetail?id=' + row._id)
      .subscribe(res => {
        this.common.loading--;
        this.btnName="Update Format";
        this.party.name = res['data'][0]['party_name'];
        this.party.id = res['data'][0]['party_id'];
        this.material.name = res['data'][0]['material_name'];
        this.material.id = res['data'][0]['material_id'];
        this.formatId = res['data'][0]['id'];
        this.accountService.selected.branch.id = res['data'][0]['branch_id'];
        this.accountService.selected.branchId = res['data'][0]['branch_id'];
        this.accountService.selected.branch.name = res['data'][0]['branch_name'];
        this.reportType = res['data'][0]['report_type'];
        this.formatName = res['data'][0]['name'];
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  saveReportFormat() {
    this.common.loading++;
    let params = {
      id: this.formatId,
      branchId: this.accountService.selected.branch.id,
      reportType: this.reportType,
      partyId: this.party.id,
      isGlobal: this.isGlobal,
      materialId: this.material.id,
      name: this.formatName
    }
    this.api.post('LorryReceiptsOperation/saveReportFormat', params)
      .subscribe(res => {
        this.common.loading--;
        console.log("response", res);
        if (res['data'] && res['data'][0] && res['data'][0].r_id > 0) {
          this.btnName="Add Format";
          this.common.showToast("SuccessFully Added");
          this.getReportFormat();
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
          this.api.post('LorryReceiptsOperation/deleteReportFormat', params)
            .subscribe(res => {
              this.common.loading--;

              this.common.showToast(res['msg']);

              this.getReportFormat();
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

  resetFormatData()
  {
        this.party.name = null;
        this.party.id = null;
        this.material.name = null;
        this.material.id = null;
        this.formatId = null;
        this.accountService.selected.branch.id = null;
        this.accountService.selected.branchId = null;
        this.accountService.selected.branch.name = null;
        this.reportType = null;
        this.formatName = null;
        this.btnName="Add Format";
  }
}
