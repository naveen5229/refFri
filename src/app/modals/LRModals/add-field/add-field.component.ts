import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import { CommonService } from '../../../services/common.service';
import { UserService } from '../../../services/user.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder } from '@angular/forms';
import { ConfirmComponent } from '../../confirm/confirm.component';

@Component({
  selector: 'add-field',
  templateUrl: './add-field.component.html',
  styleUrls: ['./add-field.component.scss', '../../../pages/pages.component.css']
})
export class AddFieldComponent implements OnInit {
  types = [{
    id: null,
    name: null,
  }
  ];
  typeId = null;
  name = null;

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
    public common: CommonService,
    public user: UserService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {
    this.types = [{
      id: 1,
      name: 'Text'
    },
    {
      id: 2,
      name: 'Number'
    }];
    this.getFieldName();
  }

  ngOnInit() {
  }

  closeModal() {
    this.activeModal.close();
  }

  Add() {
    console.log("type:", this.typeId);
    let params = {
      name: this.name,
      type: this.typeId,
    }
    console.log("params", params);
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/lrSaveFoField', params)
      .subscribe(res => {
        this.common.loading--;
        console.log(res);
        this.common.showToast(res['data'][0].r_msg);
        this.getFieldName();

      }, err => {
        this.common.loading--;
        console.log('Err:', err);
      });
  }

  getFieldName() {
    this.common.loading++;
    this.api.get('Suggestion/lrFoFields?sugId=0')
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
        let action = { title: this.formatTitle('action'), placeholder: this.formatTitle('action'), hideHeader: true };
        this.table.data.headings['action'] = action;


        this.table.data.columns = this.getTableColumns();



      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  getTableColumns() {
    let columns = [];
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
      }
      this.valobj['action'] = { class: '', icons: this.Delete(doc) };
      columns.push(this.valobj);
    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  Delete(row) {
    let icons = [];
    icons.push(
      {
        class: "fas fa-trash-alt",
        action: this.deleteRow.bind(this, row),
      }
    )
    return icons;
  }
  deleteRow(row) {
    let params = {
      id: row._id,
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
          this.api.post('LorryReceiptsOperation/lrDeleteFoField', params)
            .subscribe(res => {
              this.common.loading--;
              console.log("Result:", res['data'][0].r_msg);
              if (res['data'][0].r_id > 0) {
                this.common.showToast("Delete SuccessFull");
                this.getFieldName();
              }
              else {
                this.common.showToast(res['data'][0].r_msg);
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
