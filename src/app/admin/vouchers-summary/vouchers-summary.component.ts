import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { VoucherTypeGetComponent } from '../../modals/voucher-type-get/voucher-type-get.component';

@Component({
  selector: 'vouchers-summary',
  templateUrl: './vouchers-summary.component.html',
  styleUrls: ['./vouchers-summary.component.scss']
})
export class VouchersSummaryComponent implements OnInit {
  table = {
    voucherSummaries: {
      headings: {},
      columns: []
    },
    settings: {
      hideHeader: true
    }
  };
  voucherSummaries = [];


  constructor(private activeModal: NgbActiveModal,
    public common: CommonService,
    private commonService: CommonService,
    public api: ApiService,
    private modalService: NgbModal) {
    this.VouchersSummaryList();
  }

  ngOnInit() {
  }

  VouchersSummaryList() {
    this.clearVoucherData();
    this.common.loading++;
    this.api.get('UploadedVouchers/getUploadedVoucherSummary')
      .subscribe(res => {
        this.common.loading--;
        this.voucherSummaries = res['data'];
        if (this.voucherSummaries == null) {
          this.voucherSummaries = [];
          this.table = null;
        }
        this.setTable();
      }, err => {
        this.common.loading--;
        this.common.showError();
      });
  }

  setTable() {
    this.table.voucherSummaries = {
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
          column[key] = { value: "", action: null, icons: [{ class: 'fa fa-user', action: this.voucherTypeGet.bind(this, voucher) }] };
        } else {
          column[key] = { value: voucher[key], class: 'black', action: '' };
        }

      }
      columns.push(column);
    });
    return columns;
  }

  clearVoucherData() {
    this.table = {
      voucherSummaries: {
        headings: {},
        columns: []
      },
      settings: {
        hideHeader: true
      }
    };
    this.voucherSummaries = [];
  }
  voucherTypeGet(details) {
    let modaltype;
    if (details._type_id) {
      modaltype = 1;
    } else {
      modaltype = 2;
    }
    this.common.params = { VoucherDetails: details, state: modaltype };
    const activeModal = this.modalService.open(VoucherTypeGetComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.response) {
        this.VouchersSummaryList();
      }
    })
  }

}
