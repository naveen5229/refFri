import { Component, OnInit, Renderer2 } from '@angular/core';
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
import { AddFreightExpensesComponent } from '../../modals/FreightRate/add-freight-expenses/add-freight-expenses.component';
import { AddFreightRevenueComponent } from '../../modals/FreightRate/add-freight-revenue/add-freight-revenue.component';
import { LrPodDetailsComponent } from '../../modals/lr-pod-details/lr-pod-details.component';
import { AddReceiptsComponent } from '../../modals/add-receipts/add-receipts.component'
import { AddTransportAgentComponent } from '../../modals/LRModals/add-transport-agent/add-transport-agent.component'
import { TemplatePreviewComponent } from '../../modals/template-preview/template-preview.component';
import { PdfService } from '../../services/pdf/pdf.service';
import { FreightInvoiceComponent } from '../../modals/FreightRate/freight-invoice/freight-invoice.component';

import { AutoUnsubscribe } from "ngx-auto-unsubscribe";

@AutoUnsubscribe()
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
 
  lrType = "2";
  lrCategory = -1;
  vehicleType = -1;
  
  searchValue = null;
  searchString = null;
  
  endDate = new Date();
 startDate = new Date(new Date().setDate(new Date().getDate() - 15));
  // showMsg = false;
  constructor(
    public api: ApiService,
    private pdfService: PdfService,
    public common: CommonService,
    private datePipe: DatePipe,
    public user: UserService,
    public route: ActivatedRoute,
    private modalService: NgbModal,
    public renderer: Renderer2) {
    this.getLorryReceipts();
    this.common.refresh = this.refresh.bind(this);

  }



  ngOnDestroy(){}
ngOnInit() {
  }

  refresh() {

    this.getLorryReceipts();
  }

  getLorryReceipts() {
    if (this.endDate < this.startDate) {
      this.common.showError("End Date Should be greater than Start Date");
      return 0;
    }
    let params = {
      startDate: this.common.dateFormatter(this.startDate),
      endDate: this.common.dateFormatter(this.endDate),
      type: this.viewType,
      status: this.lrType,
      lrCategory: this.lrCategory,
      vehicleType: this.vehicleType,
      searchValue: this.searchValue,
      searchString: this.searchString
    };
    console.log("api params Data:", params);
    this.table = null;
    this.receipts = [];
    ++this.common.loading;
    this.api.post('FoDetails/getLorryStatus', params)
      .subscribe(res => {
        --this.common.loading;
        console.log('Res000000:', res);
        if (res['data']) {
          this.receipts = res['data'];
          console.log("Receipt", this.receipts);
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

  getPodImage(receipt) {
    console.log("val===", receipt);
    let refdata = {
      refid: "",
      reftype: "",
      doctype: "",
      docid: receipt.pod_docid
    }
    this.common.params = { refdata: refdata, title: 'docImage' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', windowClass: 'imageviewcomp' });

  }

  RefData() {
    let refdata = {
      refid: "",
      reftype: "",
      doctype: "",
      docid: ""
    }
      ;

    this.common.params = { refdata: refdata, title: 'docImage' };
    const activeModal = this.modalService.open(ImageViewComponent, { size: 'lg', container: 'nb-layout', windowClass: 'imageviewcomp' });
  }


  printLr(receipt) {
    let previewData = {
      title: 'Lorry Receipt',
      previewId: null,
      refId: receipt.lr_id,
      refType: "LR_PRT",
      autoPrint: true
    }
    this.common.params = { previewData };
    console.log("receipts", receipt);

    // const activeModal = this.modalService.open(LRViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    const activeModal = this.modalService.open(TemplatePreviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr-manifest print-lr' });

    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }


  addReceipts() {
    const activeModal = this.modalService.open(AddReceiptsComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
    }).catch(err => console.log('Error:', err));
  }

  addTransportAgent() {
    const activeModal = this.modalService.open(AddTransportAgentComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
    }).catch(err => console.log('Error:', err));
  }


  setTable() {
    let headings = {
      // LRId: { title: 'LR Id', placeholder: 'LR Id' },
      LRNo: { title: 'LR No', placeholder: 'LR No' },
      LRDate: { title: 'LR Date', placeholder: 'LR Date', type : 'date' },
      VehiceNo: { title: 'Vehicle No', placeholder: 'Vehicle No' },
      Consigner: { title: 'Consigner', placeholder: 'Consigner' },
      Consignee: { title: 'Consignee', placeholder: 'Consignee' },
      TA: { title: 'TA', placeholder: 'TA' },
      Supplier: { title: 'Supplier', placeholder: 'Supplier' },
      Source: { title: 'Source', placeholder: 'Source' },
      Destination: { title: 'Destination', placeholder: 'Destination' },
      AddTime: { title: 'AddTime', placeholder: 'AddTime', type: 'date' },
      Revenue: { title: 'Revenue', placeholder: 'Revenue' },
      Expense: { title: 'Expense', placeholder: 'Expense' },
      LRImage: { title: 'LRImage', placeholder: 'LRImage' },
      AddedBy: { title: 'AddedBy', placeholder: 'AddedBy' },
      details: { title: 'POD', placeholder: 'POD' },
      Action: { title: 'Action', placeholder: 'Action' },
      Invoice: { title: 'Invoice', placeholder: 'Invoice' },

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
        LRDate: { value: R.lr_date },
        Consigner: { value: R.lr_consigner_name },
        Consignee: { value: R.lr_consignee_name },
        TA: { value: R.lr_ta_name },
        Supplier: { value: R.lr_supplier_name },
        Source: { value: R.lr_source },
        Destination: { value: R.lr_destination },
        AddTime: { value: this.datePipe.transform(R.addtime, 'dd MMM HH:mm ') },
        Revenue: R.revenue_amount > 0 ? { value: '', class: 'text-center', isHTML: false, icons: [{ class: 'fa fa-inr icon i-green', action: this.lrRates.bind(this, R, 0) }, { class: 'fa fa-check icon i-green ml-2', action: this.openRevenueModal.bind(this, R, 0) }] } : { value: '', class: 'text-center', isHTML: false, icons: [{ class: 'fa fa-inr i-red-cross', action: this.lrRates.bind(this, R, 0) }, { class: 'fa fa-times-circle i-red-cross ml-2', action: this.openRevenueModal.bind(this, R, 0) }] },
        Expense: R.expense_amount > 0 ? { value: '', class: 'text-center', isHTML: false, icons: [{ class: 'fa fa-inr icon i-green', action: this.lrRates.bind(this, R, 1) }, { class: 'fa fa-check icon i-green ml-2', action: this.openExpenseModal.bind(this, R, 1) }] } : { value: '', class: 'text-center', isHTML: false, icons: [{ class: 'fa fa-inr i-red-cross', action: this.lrRates.bind(this, R, 1) }, { class: 'fa fa-times-circle i-red-cross ml-2', action: this.openExpenseModal.bind(this, R, 1) }] },
        LRImage: R.lr_image ?
          { value: '', class: 'text-center', isHTML: false, action: null, icons: [{ class: 'fa fa-eye icon', action: this.getImage.bind(this, R) }] } :
          { value: '', class: 'text-center', isHTML: false, action: null, icons: [{ class: 'fa fa-times-circle i-red-cross' }] },
        AddedBy:{value:R.name},
        details: {
          value: '', action: null, isHTML: false, icons: [
            {
              class: R.pod_docid ? 'far fa-image i-green icon mr-1' : 'far fa-image i-red-cross mr-1', action: R.pod_docid ? this.getPodImage.bind(this, R) : null
            }, {
              class: R.poddetails ? 'fa fa-list icon i-green mr-1' : 'fa fa-list i-red-cross mr-1', action: this.openPodDeatilsModal.bind(this, R)
            },
            {
              class: R.podreceived ? 'fa fa-check icon i-green' : 'fa fa-check   i-red-cross', action: null,

            }
          ]
        },


        Action: { value: '', isHTML: true, action: null, icons: this.actionIcons(R) },
        Invoice: {
          value: '', isHTML: true, action: null, icons: [
            { class: R._frinvid ? 'fa fa-print icon' : R.revenue_amount > 0 ? 'fas fa-edit icon edit ' : '', action: R._frinvid > 0 ? this.invoice.bind(this, R) : R.revenue_amount > 0 ? this.invoiceFromLr.bind(this, R) : '' },

          ]
        }
      };
      columns.push(column);

    });
    return columns;
  }

  actionIcons(R) {
    let icons = [
      { class: 'fa fa-print icon', action: this.printLr.bind(this, R) },
      { class: 'fa fa-handshake-o  icon', action: this.tripSettlement.bind(this, R) },
    ];
    this.user.permission.edit && icons.push({ class: R.is_locked ? '' : 'fas fa-edit icon edit', action: this.openGenerateLr.bind(this, R) });
    this.user.permission.delete && icons.push({ class: R.is_locked ? '' : 'fa fa-trash icon', action: this.deleteLr.bind(this, R) });

    return icons;
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

  openGenerateLr(lr) {
    let lrData = {
      lrId: lr.lr_id
    }
    this.common.params = { lrData: lrData }
    const activeModal = this.modalService.open(LrGenerateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data:', data);
      this.getLorryReceipts();

    });
  }

  lrRates(Lr, type) {
    let generalModal = true;
    if (type == 1 && Lr.is_adv_expense > 0) {
      generalModal = false;
    } else if (type == 0 && Lr.is_adv_revenue > 0) {
      generalModal = false;
    }

    let rate = {
      lrId: Lr.lr_id,
      rateType: type,
      generalModal: generalModal,
    }
    this.common.params = { rate: rate }
    const activeModal = this.modalService.open(LrRateComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data:', data);
      this.getLorryReceipts();

    });
  }

  openExpenseModal(lr) {
    let expense = {
      refernceType: 11,
      refId: lr.lr_id
    }
    console.log("openExpenseModal ", expense);
    this.common.params = { expenseData: expense };
    const activeModal = this.modalService.open(AddFreightExpensesComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      console.log('Data:', data);
      this.getLorryReceipts();
    });
  }
  openRevenueModal(lr) {
    let revenue = {
      refernceType: 11,
      refId: lr.lr_id
    }
    console.log("openExpenseModal ", revenue);
    this.common.params = { revenueData: revenue };
    const activeModal = this.modalService.open(AddFreightRevenueComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.getLorryReceipts();
    })

  }
  openPodDeatilsModal(lr) {
    console.log("====lr=====", lr);
    let podDetails = {
      podId: lr._podid,
      lrId: lr.lr_id
    }
    console.log("====podDetails=====", podDetails);

    this.common.params = { podDetails: podDetails };
    const activeModel = this.modalService.open(LrPodDetailsComponent, { size: 'lg', container: 'nb-layout', windowClass: 'lrpoddetail' });
    activeModel.result.then(data => {
      this.getLorryReceipts();
    })
  }

  invoiceFromLr(row) {
    let params = {
      lrId: row.lr_id
    }
    this.api.post('FrieghtRate/invoiceFromLr', params)
      .subscribe(res => {
        console.log('result', res['data'][0]);
        if (res['data'] && res['data'][0].r_id > 0) {
          let inv = {
            _frinvid: res['data'][0].r_id
          }
          this.common.showToast(res['data'][0].r_msg);
          this.invoice(inv);
        } else if (res['data']) {
          this.common.showError(res['data'][0].r_msg);
        }
      }, err => {
        console.log(err);
      });
  }


  invoice(inv, type?) {
    let previewData = {
      title: 'Invoice',
      previewId: null,
      refId: inv._frinvid,
      refType: "FRINV"
    }
    this.common.params = { previewData };
    console.log("invoice", inv);

    // const activeModal = this.modalService.open(LRViewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr' });
    const activeModal = this.modalService.open(TemplatePreviewComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', windowClass: 'print-lr-manifest print-lr' });

    activeModal.result.then(data => {
      console.log('Date:', data);
    });
  }

  printPDF(){
    let name=this.user._loggedInBy=='admin' ? this.user._details.username : this.user._details.name;
    console.log("Name:",name);
    let details = [
      ['Name: ' + name,'Start Date: '+this.common.dateFormatter1(this.startDate),'End Date: '+this.common.dateFormatter1(this.endDate),  'Report: '+'Lorry-Receipt']
    ];
    this.pdfService.jrxTablesPDF(['tblLorryReceipt'], 'lorry-receipt', details);
  }
}

