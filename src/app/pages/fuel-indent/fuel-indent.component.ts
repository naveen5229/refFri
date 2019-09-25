import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CommonService } from '../../services/common.service';
import { ReminderComponent } from '../../modals/reminder/reminder.component';
import { AddFuelIndentComponent } from '../../modals/add-fuel-indent/add-fuel-indent.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'fuel-indent',
  templateUrl: './fuel-indent.component.html',
  styleUrls: ['./fuel-indent.component.scss']
})
export class FuelIndentComponent implements OnInit {

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
  vehicleType = 0;
  vehicleStatus = 0;
  regno = null;

  dropDown1 = [
    { name: 'Self', id: 0 },
    { name: 'Company', id: 1 },
  ];

  dropDown2 = [
    { name: 'Pending', id: 0 },
    { name: 'Complete', id: 1 },
    { name: 'reject', id: -1 },
    { name: 'All', id: -2 },

  ];

  endDate = new Date();
  startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 7));
  indentType = '0';
  apiUrl = "Fuel/getPendingFuelIndentWrtFo?";
  constructor(public api: ApiService,
    private modalService: NgbModal,
    public common: CommonService) {
    this.getFuelIndent();
    this.common.refresh = this.refresh.bind(this);


  }

  ngOnInit() {
  }
  refresh() {

    this.getFuelIndent();
  }

  getFuelIndent() {
    if (this.indentType == '0') {
      this.apiUrl = "Fuel/getPendingFuelIndentWrtFo?";
    }
    else {
      this.apiUrl = "Fuel/getPendingCashIndentWrtFo?";

    }
    console.log("url", this.apiUrl);
    const params = "startdate=" + this.common.dateFormatter1(this.startDate) + "&enddate=" + this.common.dateFormatter1(this.endDate) + "&addedBy=" + this.vehicleType + "&status=" + this.vehicleStatus + "&regno=" + this.regno;
    console.log("params", params);
    ++this.common.loading;
    this.api.get(this.apiUrl + params)
      .subscribe(res => {
        --this.common.loading;
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
      }, err => {
        --this.common.loading;
        this.common.showError(err);
        console.log('Error: ', err);
      });
  }

  getTableColumns() {
    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {
        console.log("Type", this.headings[i]);
        console.log("doc index value:", doc[this.headings[i]]);
        if (this.headings[i] == "Action") {
          console.log("Test");
          this.valobj[this.headings[i]] = { value: "", action: null, icons: [{ class: 'fa fa-edit', action: this.editFuelIndent.bind(this, doc) }, { class: 'fa fa-trash', action: this.deleteFuelIndent.bind(this, doc) },] };
        } else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }
      }
      columns.push(this.valobj);
    });
    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  editFuelIndent(editFuelData) {
    console.log("Edit fuel Data", editFuelData);
    let refData = {
      refType: editFuelData._ref_type,
      refId: editFuelData._ref_id,
    };
    this.common.params = {
      title: 'Edit Fuel Indent',
      editFuelData: editFuelData,
      button: 'update',
      index: 0,
      refData: refData
    };
    const activeModal = this.modalService.open(AddFuelIndentComponent, { size: "lg", container: "nb-layout", backdrop: 'static' })
    activeModal.result.then(data => {
      if (data.response) {
        this.getFuelIndent();
      }
    });
  }



  deleteFuelIndent(doc) {
    console.log("values", doc);
    const params = {
      rowid: doc._id,
    }
    if (doc._id) {
      this.common.params = {
        title: 'Delete  ',
        description: `<b>&nbsp;` + 'Are Sure To Delete This Record' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.common.loading++;
          console.log("par", params);
          this.api.post('Fuel/deleteFuelIndent', params)
            .subscribe(res => {
              console.log('Api Response:', res)
              this.common.showToast(res['msg']);
              this.getFuelIndent();
              this.common.loading--;
            },
              err => console.error(' Api Error:', err));
        }
      });
    }
  }

  addFuelIndent() {
    this.common.params = {
      title: 'Add Fuel Indent',
      button: 'add',
      index: 0,

    };
    const activeModal = this.modalService.open(AddFuelIndentComponent, { size: "lg", container: "nb-layout", backdrop: 'static' })
    activeModal.result.then(data => {
      if (data.response) {
        this.getFuelIndent();
      }
    });
  }

}
