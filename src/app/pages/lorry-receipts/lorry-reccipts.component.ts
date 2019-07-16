import { Component, OnInit, Renderer } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { UserService } from '../../services/user.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewComponent } from '../../modals/image-view/image-view.component';
import { LRViewComponent } from '../../modals/LRModals/lrview/lrview.component';
import { DatePipe } from '@angular/common';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
import { ActivatedRoute } from '@angular/router';
import { LrGenerateComponent } from '../../modals/LRModals/lr-generate/lr-generate.component';
import { ViewFrieghtInvoiceComponent } from '../../modals/FreightRate/view-frieght-invoice/view-frieght-invoice.component';
import { LrRateComponent } from '../../modals/LRModals/lr-rate/lr-rate.component';
import { TripSettlementComponent } from '../../modals/trip-settlement/trip-settlement.component';

@Component({
  selector: 'lorry-reccipts',
  templateUrl: './lorry-reccipts.component.html',
  styleUrls: ['./lorry-reccipts.component.scss', '../pages.component.css']
})
export class LorryRecciptsComponent implements OnInit {
  receipts = [];
  table = null;
  viewImages = null;
  activeImage = 'lr_image';
  viewType = 'allLR';
  startDate = '';
  endDate = '';
  lrType = "2";
  // showMsg = false;
  constructor(
    public api: ApiService,
    public common: CommonService,
    private datePipe: DatePipe,
    public user: UserService,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    public renderer: Renderer) {

    let today;
    today = new Date();
    this.endDate = this.common.dateFormatter(today);
    this.startDate = this.common.dateFormatter(new Date(today.setDate(today.getDate() - 15)));
    console.log('dates ', this.endDate, this.startDate)
    this.getLorryReceipts();


  }

  ngOnInit() {
  }


  getLorryReceipts() {
    console.log('viewtype:', this.viewType);
    var enddate = new Date(this.common.dateFormatter1(this.endDate).split(' ')[0]);
    let params = {
      startDate: this.common.dateFormatter1(this.startDate).split(' ')[0],
      endDate: this.common.dateFormatter1(enddate.setDate(enddate.getDate() + 1)).split(' ')[0],
      type: this.viewType,
      status: this.lrType
    };

    ++this.common.loading;
    this.api.post('FoDetails/getLorryStatus', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res000000:', res);
        if (res['data']) {
          this.receipts = res['data'];
          // console.log("Receipt",this.receipts);
          this.table = this.setTable();
        }
        else {
          this.receipts = [];
        }
      }, err => {
        --this.common.loading;

        console.log('Err:', err);
      });

  }

  getImage(receipt) {
    console.log(receipt);
    let images = [{
      name: "LR",
      image: receipt.lr_image
    },
    {
      name: "Invoice",
      image: receipt.invoice_image
    },
    {
      name: "Other Image",
      image: receipt.other_image
    }];
    console.log("images:", images);
    this.common.params = { images, title: 'LR Details' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout' });
  }

  printLr(receipt) {
    console.log("receipts", receipt);
    this.common.params = { lrId: receipt.lr_id }
    const activeModal = this.modalService.open(LRViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    activeModal.result.then(data => {
      console.log('Date:', data);

    });
  }

  setTable() {
    let headings = {
      LRId: { title: 'LR Id', placeholder: 'LR Id' },
      VehiceNo: { title: 'Vehicle No', placeholder: 'Vehicle No' },
      LRNo: { title: 'LR No', placeholder: 'LR No' },
      LRDate: { title: 'LR Date', placeholder: 'LR Date' },
      Consigner: { title: 'Consigner', placeholder: 'Consigner' },
      consignee: { title: 'consignee', placeholder: 'consignee' },
      Source: { title: 'Source', placeholder: 'Source' },
      Destination: { title: 'Destination', placeholder: 'Destination' },
      AddTime: { title: 'AddTime', placeholder: 'AddTime' },
      Image: { title: 'Image', placeholder: 'Image' },
      Action: { title: 'Action', placeholder: 'Action' },

    };

    // if (this.user._loggedInBy == 'admin') {
    //   headings['delete'] = { title: 'Delete', placeholder: 'Delete', hideSearch: true, class: 'del' };
    // }
    return {
      receipts: {
        headings: headings,
        columns: this.getTableColumns()
      },
      settings: {
        hideHeader: true
      }
    }
  }

  getTableColumns() {
    let columns = [];
    this.receipts.map(R => {

      let column = {
        LRId: { value: R.lr_id },
        VehiceNo: { value: R.regno },
        LRNo: { value: R.lr_no },
        LRDate: { value: this.datePipe.transform(R.lr_date, 'dd MMM HH:mm ') },
        Consigner: { value: R.lr_consigner_name },
        consignee: { value: R.lr_consignee_name },
        Source: { value: R.lr_source },
        Destination: { value: R.lr_destination },
        AddTime: { value: this.datePipe.transform(R.addtime, 'dd MMM HH:mm ') },
        Image: R.lr_image ? { value: `<span>view</span>`, isHTML: true, action: this.getImage.bind(this, R) } : '',
        Action: {
          value: '', isHTML: true, action: null, icons: [{
            class: 'fa fa-print icon green', action: this.printLr.bind(this, R)
          },
          { class: 'fa fa-pencil-square-o icon edit', action: this.openGenerateLr.bind(this, R) },
          { class: 'fa fa-trash icon red', action: this.deleteLr.bind(this, R) },
          { class: 'fa fa-inr  icon', action: this.lrRates.bind(this, R) },
          { class: 'fa fa-handshake-o  icon', action: this.tripSettlement.bind(this, R) },
          ]//`<i class="fa fa-print"></i>`, isHTML: true, action: this.printLr.bind(this, R),
          // `<i class="fa fa-trash"></i>`, isHTML: true, action: this.deleteLr.bind(this, R)
        }
      };
      columns.push(column);

    });
    return columns;
  }

  getDate(type) {

    this.common.params = { ref_page: 'LrView' }
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      if (data.date) {
        if (type == 'start') {
          this.startDate = '';
          return this.startDate = this.common.dateFormatter1(data.date).split(' ')[0];
          console.log('fromDate', this.startDate);
        }
        else {

          this.endDate = this.common.dateFormatter1(data.date).split(' ')[0];
          // return this.endDate = date.setDate( date.getDate() + 1 )
          console.log('endDate', this.endDate);
        }

      }

    });


  }
  deleteLr(lr) {
    console.log("Lr dddd", lr);
    if (!confirm("Are You Sure you want to delete LR?")) {
      return;
    }
    this.common.loading++;
    this.api.post('LorryReceiptsOperation/deleteGeneratedLr', { lrId: lr.lr_id, vehicleId: lr.vid })
      .subscribe(res => {
        this.common.loading--;
        console.log("response:", res);
        if (res['data'][0].r_id > 0) {
          this.common.showToast("Sucessfully Deleted", 10000);
          this.getLorryReceipts();
        }
      }, err => {
        this.common.loading--;
        console.log(err);
      });
  }

  tripSettlement(row) {
    console.log("======", row)
    let refData = {
      refId: row.lr_id,
      refType: 11
    }
    this.common.params = { refData: refData }
    const activeModal = this.modalService.open(TripSettlementComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
    });
  }

  openGenerateLr(Lr) {
    console.log("Lr", Lr);
    this.common.params = { LrData: Lr }
    const activeModal = this.modalService.open(LrGenerateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data:', data);
      this.getLorryReceipts();

    });
  }

  lrRates(Lr) {
    console.log("Lr", Lr);
    this.common.params = { LrData: Lr }
    const activeModal = this.modalService.open(LrRateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data:', data);
    });
  }
}