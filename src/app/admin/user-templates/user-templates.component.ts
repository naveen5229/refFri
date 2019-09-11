import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveUserTemplateComponent } from '../../modals/save-user-template/save-user-template.component';
import { AssignUserTemplateComponent } from '../../modals/assign-user-template/assign-user-template.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { TemplatePreviewComponent } from '../../modals/template-preview/template-preview.component';
import { UserService } from '../../services/user.service';
import { TemplateDevviewComponent } from '../../modals/template-devview/template-devview.component';

@Component({
  selector: 'user-templates',
  templateUrl: './user-templates.component.html',
  styleUrls: ['./user-templates.component.scss']
})
export class UserTemplatesComponent implements OnInit {

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
  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    public user:UserService,
    private modalService: NgbModal) {
    this.getUserViews();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }

  refresh() {
    this.getUserViews();
  }


  getUserViews() {
    this.common.loading++;
    this.api.get('userTemplate/view')
      .subscribe(res => {
        this.common.loading--;
        console.log('res:', res);
        this.views = res['data'] || [];
        this.views.length ? this.setTable() : this.resetTable();
      }, err => {
        this.common.loading--;
        console.log(err);
      });
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

  formatTitle(strval) {
    let pos = strval.indexOf('_');
    if (pos > 0) {
      return strval.toLowerCase().split('_').map(x => x[0].toUpperCase() + x.slice(1)).join(' ')
    } else {
      return strval.charAt(0).toUpperCase() + strval.substr(1);
    }
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
        class: "far fa-eye devtemp",
        action: this.templateDevView.bind(this, 'Template Development View', view)
      },
      {
        class: "far fa-edit",
        action: this.addAndEdit.bind(this, 'Edit', view)
      },
      {
        class: "far fa-eye",
        action: this.templatePreview.bind(this, 'Preview', view)
      },
      {
        class: "fas fa-user",
        action: this.assign.bind(this, 'Edit', view)
      },
    ];
    if(this.user._details._id==57){
      icons.push(
      {
        class: "fas fa-trash-alt",
        action: this.deleteUserTemplate.bind(this, view)
      },
      )
    }
    return icons;
  }



  addAndEdit(title, row) {
    this.common.params = { title: title, userTemplate: row };
    const activeModal = this.modalService.open(SaveUserTemplateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      this.getUserViews();
    });
  }

  templatePreview(title, row) {
    let previewData = {
      title: title,
      previewId: row._id,
      refId: row._lrId,
      refType: row._ref_type
    }
    this.common.params = { previewData };
    const activeModal = this.modalService.open(TemplatePreviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr-manifest print-lr' });
    activeModal.result.then(data => {
      this.getUserViews();
    });
  }

  templateDevView(title, row) {
    this.common.params = { title: title, userTemplate: row };
    const activeModal = this.modalService.open(TemplateDevviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr-manifest print-lr' });
    activeModal.result.then(data => {
      this.getUserViews();
    });
  }



  deleteUserTemplate(row) {
    console.log("row:", row);
    let params = {
      rowId: row._id,
    }
    if (row._id) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          this.api.post('UserTemplate/delete', params)
            .subscribe(res => {
              this.common.loading--;
              this.common.showToast(res['msg']);
              this.getUserViews();

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

  assign(title, view) {
    console.log("view", view);
    let preAssignUserTemplate;
    if (view)
      preAssignUserTemplate = {
        type: view.Type,
        refType: view._ref_type,
        name: view.Name,
        id: view._id,
      }
    else
      preAssignUserTemplate = {};
    this.common.params = { title: title, preAssignUserTemplate };
    const activeModal = this.modalService.open(AssignUserTemplateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', });
    activeModal.result.then(data => {
      this.getUserViews();
    });
  }
}
