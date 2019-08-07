import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../services/common.service';
import { ApiService } from '../../services/api.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { VoucherTypeGetComponent } from '../../modals/voucher-type-get/voucher-type-get.component';
import { VoucherTypeMapComponent } from '../../modals/voucher-type-map/voucher-type-map.component';
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

  headings = [];
  valobj = {};
  data = [];
  type_id = null;

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
    this.data = [];

    this.common.loading++;
    this.api.get('UploadedVouchers/getUploadedVoucherSummary')
      .subscribe(res => {
        this.common.loading--;
        this.data = res['data'];
        this.type_id = this.data[0]._type_id;

        console.log('typeID', this.type_id);
        if (this.data == null) {
          this.data = [];
          this.table = null;
        }
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
        this.common.showError();
      });
  }
  formatTitle(title) {
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  getTableColumns() {
    let columns = [];

    this.data.map(doc => {
      let type = doc._type_id;
      this.valobj = {};
      for (let i = 0; i < this.headings.length; i++) {


        if (this.headings[i] == "Action") {
          console.log('testing action');
          this.valobj[this.headings[i]] = { value: "", action: null, icons: this.generateColumns(type, doc) };

        }

        else {
          this.valobj[this.headings[i]] = { value: doc[this.headings[i]], class: 'black', action: '' };
        }

      }
      columns.push(this.valobj);
    });
    return columns;
  }

  generateColumns(type, data) {
    let icons = [{
      class: 'fa fa-user',
      action: this.change.bind(this, data)
    }];
    if (type != null) {
      icons.push({
        class: 'fa fa-list',
        action: this.changetripState.bind(this, data)
      });
    }
    return icons;

  }
  change(details) {
    // let images = [{
    //   name: "Doc Image",
    //   image: details._image
    // }];
    this.common.params = { VoucherDetails: details };
    const activeModal2 = this.modalService.open(VoucherTypeGetComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal2.result.then(data => {
      if (data.response) {
        this.VouchersSummaryList();
      }
    })
  }
  changetripState(details) {
    this.common.params = { VoucherDetails: details }
    const activeModal = this.modalService.open(VoucherTypeMapComponent, { size: 'md', container: 'nb-layout', backdrop: 'static' });
  }
}
