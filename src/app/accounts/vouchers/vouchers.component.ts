import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockTypeComponent } from '../../acounts-modals/stock-type/stock-type.component';
// import { VoucherComponent } from '../../acounts-modals/voucher/voucher.component';
import { UserService } from '../../@core/data/users.service';
import { ActivatedRoute } from '@angular/router';
import { DatePickerComponent } from '../../modals/date-picker/date-picker.component';
@Component({
  selector: 'vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.scss']
})
export class VouchersComponent implements OnInit {
  Vouchers = [];
  voucherId = '';
  voucherName = '';
  voucher = {
    name: '',
    date: '',
    foid:'',
    user: {
      name: '',
      id: ''
    },
    vouchertypeid:'',
    amountDetails: [{
      transactionType: 'debit',
      ledger: '',
      amount: {
        debit: 0,
        credit: 0
      }
    }],
    code: '',
    remarks: ''
  };
  
  date = this.common.dateFormatter(new Date());
  constructor(public api: ApiService,
    public common: CommonService,
    private route: ActivatedRoute,
    public user: UserService,
    public modalService: NgbModal) {
    this.route.params.subscribe(params => {
      console.log('Params1: ', params);
      if (params.id) {
        this.voucherId = params.id;
        this.voucherName = params.name;
        this.getVouchers();
      }
    });

  }

  ngOnInit() {
  }

  getVouchers() {
    let params = {
      voucherId: this.voucherId
    };

    this.common.loading++;
    this.api.post('Voucher/GetVouchersData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res11:', res['data']);
        this.Vouchers = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  openVoucherModal(voucher?) {
    // console.log('voucher 0: ', voucher);
    // this.common.params = { voucher, voucherId: this.voucherId, voucherName: this.voucherName };
    // const activeModal = this.modalService.open(VoucherComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    // activeModal.result.then(data => {
    //   if (data.response) {
    //     console.log('data voucher test',data.Voucher);
    //     if (voucher) {
    //       //  this.updateStockItem(voucher.id, data.stockitem);
    //       //  return;
    //     }
    //     this.addVoucher(data.Voucher);

    //   }
    // });
  }

  dismiss(response) {
    console.log('Voucher:', this.voucher);
    if (response && (this.calculateTotal('credit') !== this.calculateTotal('debit'))) {
      this.common.showToast('Credit And Debit Amount Should be Same');
      return;
    }
    this.addVoucher(this.voucher);
  //  this.activeModal.close({ response: response, Voucher: this.voucher });
  }
  addVoucher(voucher) {
    console.log('voucher 1 :', voucher);
    //const params ='';
    const params = {
      foid: voucher.user.id,
     // vouchertypeid: voucher.voucher.id,
      customercode: voucher.code,
      remarks: voucher.remarks,
      date: voucher.date,
      amountDetails: voucher.amountDetails,
      vouchertypeid :this.voucherId
    };

    console.log('params 1 : ', params);
    this.common.loading++;

    this.api.post('Voucher/InsertVoucher', params)
      .subscribe(res => {
        this.common.loading--;
       // console.log('res: ', res['data'].code);
       
        this.getVouchers();
        this.common.showToast('Your Code :'+res['data'].code);
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }


  onSelected(selectedData, type, display) {
    this.voucher[type].name = selectedData[display];
    this.voucher[type].id = selectedData.id;
    console.log('Accounts User: ', this.voucher);
  }

  getDate(date) {
    const activeModal = this.modalService.open(DatePickerComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
      this.voucher.date = this.common.dateFormatter(data.date).split(' ')[0];
      //  console.log('Date:', this.date);
    });
  }

  addAmountDetails() {
    this.voucher.amountDetails.push({
      transactionType: 'debit',
      ledger: '',
      amount: {
        debit: 0,
        credit: 0
      }
    });
  }

  calculateTotal(type) {
    let total = 0;
    this.voucher.amountDetails.map(amountDetail => {
      // console.log('Amount: ',  amountDetail.amount[type]);
      total += amountDetail.amount[type];
    });
    return total;
  }
}
