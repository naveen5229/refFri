import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFreightRevenueComponent } from '../../modals/FreightRate/add-freight-revenue/add-freight-revenue.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';
import { EntityFlagsComponent } from '../../modals/entity-flags/entity-flags.component';

@Component({
  selector: 'freight-revenue',
  templateUrl: './freight-revenue.component.html',
  styleUrls: ['./freight-revenue.component.scss', '../pages.component.css']
})
export class FreightRevenueComponent implements OnInit {
  startTime = new Date(new Date().setDate(new Date().getDate() - 15));
  endTime = new Date();
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
    private datePipe: DatePipe,
    public user: UserService,
    private modalService: NgbModal) {
    this.viewFreightRevenue();
    this.common.refresh = this.refresh.bind(this);

  }

  ngOnInit() {
  }


  refresh() {
    this.viewFreightRevenue();
  }


  viewFreightRevenue() {
    if (!this.startTime || !this.endTime) {
      this.common.showError("Dates cannot be blank.");
      return;
    }

    let params = {
      startTime: this.common.dateFormatter(this.startTime),
      endTime: this.common.dateFormatter(this.endTime)
    }
    console.log("params", params);
    ++this.common.loading;

    this.api.post('FrieghtRate/viewRevenue', params)
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
        let action = { title: this.formatTitle('action'), placeholder: this.formatTitle('action'), hideHeader: true };
        this.table.data.headings['action'] = action;


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
        console.log("doc index value:", doc[this.headings[i]]);
        this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };

      }
      this.valobj['action'] = { class: '', icons: this.freightDelete(doc) };
      columns.push(this.valobj);

    });

    return columns;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1);
  }

  freightDelete(row) {

    let icons = [];
    icons.push(
      {
        class: "fas fa-edit",
        action: this.editFreightRevenue.bind(this, row),
      },
      {
        class: "fas fa-trash-alt",
        action: this.deleteRow.bind(this, row),
      }
    )
    return icons;
  }
  deleteRow(row) {
    console.log("row:", row);
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
          this.api.post('FrieghtRate/deleteRevenue', params)
            .subscribe(res => {
              this.common.loading--;
              console.log("Result:", res['data'][0].y_msg);

              this.common.showToast(res['data'][0].y_msg);
              if (res['data'][0].y_id > 0)
                this.viewFreightRevenue();

            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
            });
        }
      });
    }
  }

  addFreightRevenue() {
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { title: 'Add Freight Revenue ' };
    const activeModal = this.modalService.open(AddFreightRevenueComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      if (data) {
        this.viewFreightRevenue();
      }
    });
  }




  editFreightRevenue(row) {
    this.common.handleModalSize('class', 'modal-lg', '1100');
    this.common.params = { title: 'Edit Freight Revenue ', row: row };
    const activeModal = this.modalService.open(AddFreightRevenueComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
      if (data) {
        this.viewFreightRevenue();
      }
    });
  }

  add() {
    this.common.handleModalSize('class', 'modal-lg', '800');
    this.common.params = { title: 'Entity Flag ', };
    const activeModal = this.modalService.open(EntityFlagsComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {

    });
  }



}
