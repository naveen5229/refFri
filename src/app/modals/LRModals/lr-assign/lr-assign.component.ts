import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../services/common.service';
import { ApiService } from '../../../services/api.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'lr-assign',
  templateUrl: './lr-assign.component.html',
  styleUrls: ['./lr-assign.component.scss', '../../../pages/pages.component.css']
})
export class LrAssignComponent implements OnInit {
  startTime = new Date(new Date().setDate(new Date().getDate() - 7));
  endTime = new Date();
  branchId = null;
  partyId = null;
  dataList = [];
  selectedType = [];
  invoiceId = null;
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

  constructor(public common: CommonService,
    public api: ApiService,
    public activeModal: NgbActiveModal,
    private modalService: NgbModal) {

    console.log("Data:::", this.common.params.row);
    this.branchId = this.common.params.row._branch_id ? this.common.params.row._branch_id : null;
    this.partyId = this.common.params.row._party_id ? this.common.params.row._party_id : null;
    this.invoiceId = this.common.params.row._id ? this.common.params.row._id : null;
    this.getlrUnmapped();
    this.viewlrData();

  }

  ngOnInit() {
  }
  closeModal() {
    this.activeModal.close();
  }

  refresh() {
    this.viewlrData();
    this.getlrUnmapped();
  }

  getlrUnmapped() {
    this.common.loading++;
    let params = {
      startTime: this.common.dateFormatter(this.startTime).split(' ')[0],
      endTime: this.common.dateFormatter(this.endTime).split(' ')[0],
      partyId: this.partyId,
      branchId: this.branchId,
      invoiceId: null,
    }
    console.log("params", params);
    this.api.post('FrieghtRate/getlrUnmapped', params)
      .subscribe(res => {
        this.common.loading--;
        this.dataList = res['data'];

      }, err => {
        this.common.loading--;

        console.log('Err:', err);
      });
  }

  onChange(email: string, isChecked: boolean) {
    if (isChecked) {
      this.selectedType.push(email);
    } else {
      let index = this.selectedType.indexOf(email);
      this.selectedType.splice(index, 1);
    }
    console.log(this.selectedType);
    return this.selectedType
  }

  selectAll(isChecked) {
    console.log("test", isChecked);
    if (isChecked) {
      console.log("true", isChecked);

      this.dataList.forEach(ele => {
        this.selectedType.push(ele.id);
      });
    }
    if (!isChecked) {
      console.log("false", isChecked);

      this.dataList.forEach(element => {
        this.selectedType.pop();
      });
    }
    console.log("Select Id:", this.selectedType);
  }

  assignGroups() {
    this.common.loading++;
    let params = {
      invoiceId: this.invoiceId,
      lrIds: JSON.stringify(this.selectedType).replace("[", "{").replace("]", "}"),
      lrId: null,
    }
    console.log("params", params);
    this.api.post('FrieghtRate/assignGroups', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success']) {
          this.common.showToast(res['msg']);
          this.refresh();
        }
      }, err => {
        this.common.loading--;

        console.log('Err:', err);
      });
  }

  viewlrData() {
    this.common.loading++;
    let params = {
      startTime: this.common.dateFormatter(this.startTime).split(' ')[0],
      endTime: this.common.dateFormatter(this.endTime).split(' ')[0],
      partyId: this.partyId,
      branchId: this.branchId,
      invoiceId: this.invoiceId,
    }
    console.log("params", params);
    this.api.post('FrieghtRate/getlrUnmapped', params)
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

        this.table.data.columns = this.getTableColumns();


      }, err => {
        this.common.loading--;

        console.log('Err:', err);
      });
  }


  getTableColumns() {

    let columns = [];
    console.log("Data=", this.data);
    this.data.map(doc => {
      this.valobj = {};

      for (let i = 0; i < this.headings.length; i++) {
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        // if (this.headings['Action'] == 'Action') {
        //   console.log("testing");

        this.valobj['Action'] = { class: '', icons: this.UnMappedLr(doc) };

        // }
      }
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  UnMappedLr(row) {
    let icons = [];

    icons.push(
      {
        class: "fa fa-window-close",
        action: this.unAssginLr.bind(this, row),
      },


    )
    return icons;
  }
  unAssginLr(row) {
    this.common.loading++;
    let params = {
      invoiceId: this.invoiceId,
      lrIds: null,
      lrId: row._id,
    }
    console.log("params", params);
    this.api.post('FrieghtRate/assignGroups', params)
      .subscribe(res => {
        this.common.loading--;
        if (res['success'] == true) {
          this.common.showToast(res['msg']);

          this.refresh();
        }

      }, err => {
        this.common.loading--;

        console.log('Err:', err);
      });
  }


}
