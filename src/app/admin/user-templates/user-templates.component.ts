import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SaveUserTemplateComponent } from '../../modals/save-user-template/save-user-template.component';

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
    private modalService: NgbModal) {
    this.getUserViews();

  }

  ngOnInit() {
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

  resetTable(){
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
        class:"far fa-edit",
        action: this.addAndEdit.bind(this,'Edit', view)
      },
      {
        class: "far fa-eye",
      },
      {
        class: "fas fa-trash-alt",
      },
      {
        class: "fas fa-user",
      },
    ];
    return icons;
  }



  addAndEdit(title,row) {
    this.common.params={title:title,userTemplate: row };
    const activeModal = this.modalService.open(SaveUserTemplateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getUserViews();
      }
    });
  }
}
