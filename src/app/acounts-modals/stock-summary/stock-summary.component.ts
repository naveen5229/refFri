import { Component, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { OrderComponent } from '../../acounts-modals/order/order.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.scss']
})
export class StockSummaryComponent  implements OnInit {
  title = '';
  voucherCode ='';
  Detail = [];
  constructor(
    private activeModal: NgbActiveModal,
    public common: CommonService,
    public modalService: NgbModal,
    public api: ApiService) {

      console.log('detail params',this.common.params); 

    this.getDetailList();
    this.common.handleModalSize('class', 'modal-lg', '1150');
 
  }
  ngOnInit() {
  }

  getDetailList() {
    let params = {
      endDate: this.common.params.endDate,
      startDate: this.common.params.startDate,
      stockItem: this.common.params.stockItem,
      stocksubtype: this.common.params.stocksubtype,
      stocktype: this.common.params.stocktype,
      warehouse: (this.common.params.warehouse) ? this.common.params.warehouse : 0,
      branchid: (this.common.params.branchid) ? this.common.params.branchid : 0,
      
    };
    console.log('vcid', params);

    this.api.post('Stock/getDetailList', params)
      .subscribe(res => {
        // this.common.loading--;
        this.Detail = res['data'];
        console.log('Res:', this.Detail);

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });
  }

  filterCostDetails(unFilterData) {
    let costFilter = [];
   // console.log('Unfilter:', unFilterData);
    if (unFilterData) {
      let costStr = unFilterData.replace(/'/g, '');
      costStr = costStr.substring(1, costStr.length - 1).replace(/{/g, '').replace(/}/g, '').replace(/"/g, '');
      console.log('Cost STR:', costStr);
      let costArray = costStr.split(',');
      console.log('Cost Array:', costArray);
      costArray.map(cost => {
        costFilter.push(cost)
      })
    }

    return costFilter;


  }
  dismiss(response) {
    //console.log('Accounts:', this.Branches);
    this.activeModal.close({ response: response, test: this.Detail });
  }
  openinvoicemodel(invoiceid,ordertypeid,create=0,) {
    // console.log('welcome to invoice ');
    //  this.common.params = invoiceid;
    this.common.params = {
      invoiceid: invoiceid,
      delete: 0,
      newid:create,
      ordertype:ordertypeid,
      sizeIndex:1
    };
    const activeModal = this.modalService.open(OrderComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static' });
    activeModal.result.then(data => {
       console.log('Data: invoice ', data);
      if (data.delete) {
        console.log('open succesfull');
         // this.getDayBook();
        // this.addLedger(data.ledger);
      }
    });
  }
}
