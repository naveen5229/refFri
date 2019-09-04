import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { VoucherTypeGetComponent } from '../../modals/voucher-type-get/voucher-type-get.component';
import { AddFreightExpensesComponent } from '../../modals/FreightRate/add-freight-expenses/add-freight-expenses.component';
import { AddFreightRevenueComponent } from '../../modals/FreightRate/add-freight-revenue/add-freight-revenue.component';

@Component({
  selector: 'vouchers-summary',
  templateUrl: './vouchers-summary.component.html',
  styleUrls: ['./vouchers-summary.component.scss']
})
export class VouchersSummaryComponent implements OnInit {
  table = {
    data: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  voucherSummaries = [];
  startDate = new Date();
  endDate = new Date();
  voucher = [{
    name: 'pending',
    id: '1'
  },
  {
    name: 'voucherPending',
    id: '2'
  },
  {
    name: 'completed',
    id: '3'
  }]
  voucherID = 1;
  constructor(public common: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.getVouchersSummary();
    this.endDate = new Date();
    this.startDate = new Date(new Date().setDate(new Date(this.endDate).getDate() - 30));
    this.common.refresh = this.refresh.bind(this);
  }

  ngOnInit() {
  }
  refresh() {
    this.getVouchersSummary();
  }

  getVouchersSummary() {
    const params = "startDate=" + this.common.dateFormatter1(this.startDate) + "&endDate=" + this.common.dateFormatter1(this.endDate) + "&statusType=" + this.voucherID;
    this.common.loading++;
    this.api.get('UploadedVouchers/getUploadedVoucherSummary?' + params)
      .subscribe(res => {
        this.common.loading--;
        this.voucherSummaries = res['data'] || [];
        if (!this.voucherSummaries.length) {
          this.resetTable();
          return;
        }
        this.setTable();
      }, err => {
        this.common.loading--;
        console.log('Api Error:', err);
        this.common.showError();
      });
  }

  setTable() {
    this.table.data = {
      headings: this.generateHeadings(this.voucherSummaries[0]),
      columns: this.getTableColumns(this.voucherSummaries, this.voucherSummaries[0])
    }
  }

  generateHeadings(keyObject) {
    let headings = {};
    for (var key in keyObject) {
      if (key.charAt(0) != "_") {
        headings[key] = { title: this.formatTitle(key), placeholder: this.formatTitle(key) };
      }
    }
    return headings;
  }

  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }

  getTableColumns(vouchers, keyObject) {
    let columns = [];
    vouchers.map(voucher => {
      let column = {}
      for (let key in this.generateHeadings(keyObject)) {
        if (key == "Action") {
          column[key] = { value: "", action: null, icons: this.getIcons(voucher) };
        } else {
          column[key] = { value: voucher[key], class: 'black', action: '' };
        }
      }
      columns.push(column);
    });
    return columns;
  }

  getIcons(voucher) {
    console.log("vouchar", voucher);

    let icons = [];
    if (voucher._vehicle_id) {
      icons.push({
        class: 'fas fa-user-shield',
        action: this.voucherTypeGet.bind(this, voucher)
      });
    }
    else {
      icons.push({
        class: 'fa fa-user',
        action: this.voucherTypeGet.bind(this, voucher)
      });
    }


    if (voucher._ref_id && voucher._ref_type) {
      icons.push({
        class: 'fa fa-list',
        action: this.openFreightExpense.bind(this, voucher)
      });
    }
    return icons;
  }

  resetTable() {
    this.table = {
      data: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
  }

  voucherTypeGet(voucher) {
    let modalType = 2;
    if (voucher._type_id) modalType = 1;

    this.common.params = { voucher, modalType };
    const activeModal = this.modalService.open(VoucherTypeGetComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.getVouchersSummary();
      }
    })
  }

  openFreightExpense(voucher) {
    const params = {
      id: null,
      refId: voucher._ref_id,
      refernceType: voucher._ref_type,
      remarks: null,
    };

    if (voucher._type_id == '-152') {
      this.common.params = { expenseData: params };
      this.modalService.open(AddFreightExpensesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    } else if (voucher._type_id == '-153') {
      this.common.params = { revenueData: params };
      this.modalService.open(AddFreightRevenueComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' })
    }
  }

}
