import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { StockTypeComponent } from '../../acounts-modals/stock-type/stock-type.component';
import { VoucherComponent} from '../../acounts-modals/voucher/voucher.component';
import { UserService } from '../../@core/data/users.service';

@Component({
  selector: 'vouchers',
  templateUrl: './vouchers.component.html',
  styleUrls: ['./vouchers.component.scss']
})
export class VouchersComponent implements OnInit {
  Vouchers =[];
  constructor(public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) { 

      this.getVouchers();
    }

  ngOnInit() {
  }

  getVouchers() {
    let params = {
      foid: 123
    };
    
    this.common.loading++;
    this.api.post('Voucher/GetVouchersData', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res:', res['data']);
        this.Vouchers = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  openVoucherModal (voucher?) {
    console.log('voucher 0: ',voucher);
      if (voucher) this.common.params = voucher;
      const activeModal = this.modalService.open(VoucherComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
      activeModal.result.then(data => {
         console.log('Data: ', data);
        if (data.response) {
         console.log(data.Voucher);
          if (voucher) {
          //  this.updateStockItem(voucher.id, data.stockitem);
          //  return;
          }
         this.addVoucher(data.Voucher);
  
        }
      });
    }

    addVoucher(voucher) {
      console.log('voucher 1 :',voucher);
      //const params ='';
       const params = {
          foid: voucher.user.id,
          vouchertypeid: voucher.voucher.id,
           customercode: voucher.code,
           remarks: voucher.remarks,
           date : voucher.date,
           amountDetails : voucher.amountDetails
       };
  
       console.log('params 1 : ',params);
      this.common.loading++;
  
      this.api.post('Voucher/InsertVoucher', params)
        .subscribe(res => {
          this.common.loading--;
          console.log('res: ', res);
          this.getVouchers();
        }, err => {
          this.common.loading--;
          console.log('Error: ', err);
          this.common.showError();
        });
  
    }
}
