import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonService } from '../../services/common.service';
import { NgbModal, NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { StockitemComponent } from '../../acounts-modals/stockitem/stockitem.component';
import { UserService } from '../../@core/data/users.service';
import { ConfirmComponent } from '../../modals/confirm/confirm.component';

@Component({
  selector: 'stockitems',
  templateUrl: './stockitems.component.html',
  styleUrls: ['./stockitems.component.scss']
})
export class StockitemsComponent implements OnInit {
  StockItems = [];
  selectedRow = -1;
  activeId = '';
  pageName="";
  sizeIndex=0;
  constructor(private activeModal: NgbActiveModal,
    public api: ApiService,
    public common: CommonService,
    public user: UserService,
    public modalService: NgbModal) {
      if(this.common.params && this.common.params.pageName){
          this.pageName=this.common.params.pageName;
      }
    this.getStockItems();
    this.common.currentPage = 'Stock Item';
    this.common.refresh = this.refresh.bind(this);
    if(this.common.params && this.common.params.pageName){
    this.common.handleModalSize('class', 'modal-lg', '1150','px',this.sizeIndex);     
     }
  }

  ngOnInit() {
  }
  refresh() {
    this.getStockItems();
  }

  getStockItems() {
    let params = {
      foid: 123
    };

    this.common.loading++;
    this.api.post('Stock/GetStockItem', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('Res new:', res['data']);
        this.StockItems = res['data'];

      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }

  openStockItemModal(stockitem?) {
    console.log('stockitem close time', stockitem);
    if (stockitem) {
      if(this.pageName){
        stockitem.sizeIndex=1;     
         }
      this.common.params = stockitem;
      const activeModal = this.modalService.open(StockitemComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("after modal close :", data.stockItem);
          const params = {
            foid: 123,
            name: data.stockItem.name,
            code: data.stockItem.code,
            stocksubtypeid: data.stockItem.stockSubType.id,
            sales: data.stockItem.sales,
            purchase: data.stockItem.purchase,
            minlimit: data.stockItem.minlimit,
            maxlimit: data.stockItem.maxlimit,
            isactive: data.stockItem.isactive,
            inventary: data.stockItem.inventary,
            stockunit: data.stockItem.unit.id,
            stockItemid: stockitem.id,
            gst:data.stockItem.gst,
            details:data.stockItem.details,
            hsnno:data.stockItem.hsnno,
            isnon:data.stockItem.isnon,
            cess:data.stockItem.cess,
            igst:data.stockItem.igst,
            taxability:data.stockItem.taxability,
            calculationtype:data.stockItem.calculationtype,
            openinngbal:data.stockItem.openingbal,
            openingqty:data.stockItem.openingqty

          };
          console.log('paramsans: ', params);
          this.common.loading++;

          this.api.post('Stock/UpdateStockItem', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: update ', res['data'][0].save_stockitem);
              let result = res['data'][0].save_stockitem;
              if (result['success']) {
                this.common.showToast("Stock item Update Succefully");
              }
              else {
                this.common.showToast(result);
              }

              this.getStockItems();
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
              this.common.showError();
            });
        }
      });
    }
    else {
      if(this.pageName){
        this.sizeIndex=1;     
         }
      this.common.params =  {sizeIndex:this.sizeIndex};
      const activeModal = this.modalService.open(StockitemComponent, { size: 'lg', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          this.addStockItem(data.stockItem);
        }
      });
    }

  }

  addStockItem(stockItem) {
    console.log(stockItem);
    // const params ='';
    const params = {
      foid: 123,
      name: stockItem.name,
      code: stockItem.code,
      stocksubtypeid: stockItem.stockSubType.id,
      sales: stockItem.sales,
      purchase: stockItem.purchase,
      minlimit: stockItem.minlimit,
      maxlimit: stockItem.maxlimit,
      isactive: stockItem.isactive,
      inventary: stockItem.inventary,
      stockunit: stockItem.unit.id,
      gst:stockItem.gst,
      details:stockItem.hsndetail,
      hsnno:stockItem.hsnno,
      isnon:stockItem.isnon,
      cess:stockItem.cess,
     igst:stockItem.igst,
     taxability:stockItem.taxability,
     calculationtype:stockItem.calculationtype,
     openinngbal:stockItem.openingbal,
    openingqty:stockItem.openingqty
    };

    console.log('params: stocks ', params);
    this.common.loading++;

    this.api.post('Stock/InsertStockItem', params)
      .subscribe(res => {
        this.common.loading--;
        console.log('res: ', res);
        let result = res['data'][0].save_stockitem;
        if (res['success']) {
          this.common.showToast("Stock item Added Successfully");
        }
        else {
          this.common.showToast(result);
        }
        this.getStockItems();
      }, err => {
        this.common.loading--;
        console.log('Error: ', err);
        this.common.showError();
      });

  }


  keyHandler(event) {
    const key = event.key.toLowerCase();
    this.activeId = document.activeElement.id;
    console.log('Active event', event, this.activeId);
    if ((key.includes('arrowup') || key.includes('arrowdown')) && !this.activeId && this.StockItems.length) {
      /************************ Handle Table Rows Selection ********************** */
      if (key == 'arrowup' && this.selectedRow != 0) this.selectedRow--;
      else if (this.selectedRow != this.StockItems.length - 1) this.selectedRow++;

    }
  }

  modelCondition() {
    this.activeModal.close({ });
    event.preventDefault();
    return;
  }
  delete(tblid) {
    let params = {
      id: tblid,
      tblidname: 'id',
      tblname: 'stockitem'
    };
    if (tblid) {
      console.log('city', tblid);
      this.common.params = {
        title: 'Delete City ',
        description: `<b>&nbsp;` + 'Are you sure want to delete' + `<b>`,
      }
      const activeModal = this.modalService.open(ConfirmComponent, { size: 'sm', container: 'nb-layout', backdrop: 'static', keyboard: false, windowClass: "accountModalClass" });
      activeModal.result.then(data => {
        if (data.response) {
          console.log("data", data);
          this.common.loading++;
          this.api.post('Stock/deletetable', params)
            .subscribe(res => {
              this.common.loading--;
              console.log('res: ', res);
              this.getStockItems();
              this.common.showToast(" This Value Has been Deleted!");
            }, err => {
              this.common.loading--;
              console.log('Error: ', err);
              this.common.showError('This Value has been used another entry!');
            });
        }
      });
    }
  }
}
