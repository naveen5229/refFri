import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../services/account.service';
import { ConfirmComponent } from '../confirm/confirm.component';

@Component({
  selector: 'assign-user-template',
  templateUrl: './assign-user-template.component.html',
  styleUrls: ['./assign-user-template.component.scss']
})
export class AssignUserTemplateComponent implements OnInit {
  showdata = {
    show: true
  }
  party = {
    name: null,
    id: null,
    address: null
  }
  material = {
    name: null,
    id: null
  }
  alltemplateList = [];
  templateList = [];
  branchId = null;
  templateType = 'LR';
  templateTypeShow = null;
  templateName = 'N.A';
  templateId = null;
  title = '';
  showTable = false;
  views = [];
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };

  constructor(private api: ApiService,
    private common: CommonService,
    private modalService: NgbModal,
    private activeModal: NgbActiveModal,
    public accountService: AccountService) {
    if (this.accountService.selected.branch.id) {
      // this.branchId = this.accountService.selected.branch.id;
      this.getBranchDetails();
    }
    if (this.common.params.title == "Edit") {
      this.showdata.show = false;
      this.templateType = this.common.params.preAssignUserTemplate.refType;
      this.templateTypeShow = this.common.params.preAssignUserTemplate.type;
      this.templateName = this.common.params.preAssignUserTemplate.name;
      this.templateId = this.common.params.preAssignUserTemplate.id;
      this.party.id  =  this.common.params.preAssignUserTemplate.partyId;
      this.party.name =this.common.params.preAssignUserTemplate.partyName;
      this.material.name =this.common.params.preAssignUserTemplate.materialName;
      this.material.id = this.common.params.preAssignUserTemplate.materialId;
      this.getUserViews(true);
    } else {
      this.getUserViews();
    }
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  getBranchDetails() {
    this.api.get('LorryReceiptsOperation/getBranchDetilsforLr?branchId=' + this.accountService.selected.branch.id)
      .subscribe(res => {
        console.log("branchdetails", res['data'][0]);
      }, err => {
        this.common.loading--;
        console.log(err);
      });
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

  assignTemplate(isAssign = "true") {
    let params = {
      templateId: this.templateId,
      branchId: this.accountService.selected.branch.id,
      type: this.templateType,
      isAssign: isAssign,
      materialId:this.material.id,
      partyId: this.party.id
    }
    console.log("paraaaaaaaaaaaaa",params)
    this.common.loading++;
    this.api.post('UserTemplate/assign', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res:', res);
        if (res['data'][0].y_id <= 0) {
          this.common.showError(res['data'][0].y_msg);
        }
        else {
          this.common.showToast(res['data'][0].y_msg);
          this.getUserViews(true);
        }

      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  changeTemplateType(template) {
    console.log("template value:", template);
    this.templateId = template._id;
    this.getUserViews(true);
  }
  selectTemplateType() {
    document.getElementById('templateId')['value'] = '';
    this.filterTemplate();
  }

  resetData(type) {
    this.party.id = null;
  }

  resetMaterail(material) {
    this.material.id = null;
  }

  getUserViews(isBranch = false) {
    let params = "id=" + (this.templateId ? this.templateId : "") + "&isBranch=" + (isBranch ? "true" : "false");
    this.common.loading++;
    this.api.get('userTemplate/view?' + params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res:', res);
        if (isBranch) {
          this.views = res['data'] || [];
          this.views.length ? this.setTable() : this.resetTable();
        }
        else {
          this.alltemplateList = res['data'];
          this.filterTemplate();
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  filterTemplate() {

    this.templateList = this.alltemplateList.filter(element => {
      return element._ref_type == this.templateType;
    });
    console.log("template list:", this.templateList);

  }
  resetTable() {
    this.table.data = {
      headings: {},
      columns: []
    };
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(),
      columns: this.getTableColumns()
    };
    return true;
  }

  generateHeadings() {
    let headings = {};
    for (var key in this.views[0]) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: key, placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  getTableColumns() {
    let columns = [];
    this.views.map(view => {
      let column = {};
      for (let key in this.generateHeadings()) {
        if (key == 'Action') {
          column[key] = {
            value: "",
            isHTML: false,
            action: null,
            icons: this.actionIcons(view)
          };
        } else {
          column[key] = { value: view[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    })

    return columns;
  }

  actionIcons(view) {
    let icons = [
      {
        class: "icon fas fa-user-alt-slash",
        action: this.unassignTemplate.bind(this, view)
      },
    ];
    return icons;
  }

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
  }

  unassignTemplate(view) {
    let params = {
      templateId: view._template_id,
      branchId: view._branch_id,
      type: view._ref_type,
      isAssign: "false",
      materialId:view._material_id,
      partyId:view._party_id,
      rowId:view._id
    }
    if (view._id) {
      this.common.params = {
        title: 'Unassign Template  ',
        description: `<b>&nbsp;` + 'Are Sure To Unassign This Record ?' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('UserTemplate/assign', params)
            .subscribe(res => {
              this.common.loading--;
              if (res['data'][0].y_id <= 0) {
                this.common.showError(res['data'][0].y_msg);
              }
              else {
                this.common.showToast(res['data'][0].y_msg);
                this.getUserViews(true);
              }

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }



}
