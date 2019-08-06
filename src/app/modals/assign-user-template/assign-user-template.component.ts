import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'assign-user-template',
  templateUrl: './assign-user-template.component.html',
  styleUrls: ['./assign-user-template.component.scss']
})
export class AssignUserTemplateComponent implements OnInit {
  alltemplateList = [];
  templateList = [];
  branchId = null;
  templateType = 'LR';
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
      this.getBranchDetails();
    }
    this.getUserViews();
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

  assignTemplate(isAssign = "true") {
    let params = {
      templateId: this.templateId,
      branchId: this.branchId,
      type: this.templateType,
      isAssign: isAssign,
    }
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
    this.filterTemplate();
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
      templateId: view._id,
      branchId: view._branch_id,
      type: view._ref_type,
      isAssign: "false",
    }
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
        console.log(err);
      });
  }

}
