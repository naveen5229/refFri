import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { DatePipe } from '@angular/common';
import { UserService } from '../../@core/data/users.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddFreightRevenueComponent } from '../../modals/FreightRate/add-freight-revenue/add-freight-revenue.component';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'freight-revenue',
  templateUrl: './freight-revenue.component.html',
  styleUrls: ['./freight-revenue.component.scss', '../pages.component.css']
})
export class FreightRevenueComponent implements OnInit {

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
  }

  ngOnInit() {
  }


  addFreightRevenue() {
    this.common.handleModalSize('class', 'modal-lg', '1100');
    const activeModal = this.modalService.open(AddFreightRevenueComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  viewFreightRevenue() {
    let params = {

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
      type: 'location',
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
          this.api.post('FrieghtRate/deleteFrieghtRateDetails', params)
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


}
